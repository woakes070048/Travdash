import Telescope from 'meteor/nova:lib';
import Trips from './collection.js';
import marked from 'marked';
import Users from 'meteor/nova:users';

//////////////////////////////////////////////////////
// Collection Hooks                                 //
//////////////////////////////////////////////////////

/**
 * @summary Generate HTML body and excerpt from Markdown on trip insert
 */
Trips.before.insert(function (userId, doc) {
  if(!!doc.description) {
    const htmlBody = Telescope.utils.sanitize(marked(doc.description));
    doc.htmlBody = htmlBody;
    doc.excerpt = Telescope.utils.trimHTML(htmlBody,30);
  }
});

/**
 * @summary Generate HTML body and excerpt from Markdown when trip body is updated
 */
Trips.before.update(function (userId, doc, fieldNames, modifier) {
  // if body is being modified or $unset, update htmlBody too
  if (Meteor.isServer && modifier.$set && modifier.$set.description) {
    const htmlBody = Telescope.utils.sanitize(marked(modifier.$set.description));
    modifier.$set.htmlBody = htmlBody;
    modifier.$set.excerpt = Telescope.utils.trimHTML(htmlBody,30);
  }
  if (Meteor.isServer && modifier.$unset && (typeof modifier.$unset.description !== "undefined")) {
    modifier.$unset.htmlBody = "";
    modifier.$unset.excerpt = "";
  }
});

/**
 * @summary Generate slug when trip title is updated
 */
Trips.before.update(function (userId, doc, fieldNames, modifier) {
  // if title is being modified, update slug too
  if (Meteor.isServer && modifier.$set && modifier.$set.title) {
    modifier.$set.slug = Telescope.utils.slugify(modifier.$set.title);
  }
});

/**
 * @summary Disallow $rename
 */
Trips.before.update(function (userId, doc, fieldNames, modifier) {
  if (!!modifier.$rename) {
    throw new Meteor.Error("illegal $rename operator detected!");
  }
});

//////////////////////////////////////////////////////
// Callbacks                                        //
//////////////////////////////////////////////////////

/*

### trips.new.method

- TripsNewUserCheck
- TripsNewRateLimit
- TripsNewSubmittedPropertiesCheck

### trips.new.sync

- TripsNewDuplicateLinksCheck
- TripsNewRequiredPropertiesCheck

### trips.new.async

- TripsNewIncrementPostCount
- TripsNewUpvoteOwnPost
- TripsNewNotifications

### trips.edit.method

- TripsEditUserCheck
- TripsEditSubmittedPropertiesCheck

### trips.edit.sync

- TripsEditDuplicateLinksCheck
- TripsEditForceStickyToFalse

### trips.edit.async

- TripsEditSetPostedAt
- TripsEditRunPostApprovedCallbacks

### trips.approve.async

- TripsApprovedNotification

### users.remove.async

- UsersRemoveDeleteTrips

*/

// ------------------------------------- trips.new.method -------------------------------- //

/**
 * @summary Check that the current user can create a trip
 */
function TripsNewUserCheck (trip, user) {
  // check that user can trip
  if (!user || !Users.canDo(user, "trips.new"))
    throw new Meteor.Error(601, 'you_need_to_login_or_be_invited_to_trip_new_stories');
  return trip;
}
Telescope.callbacks.add("trips.new.method", TripsNewUserCheck);

/**
 * @summary Rate limiting
 */
function TripsNewRateLimit (trip, user) {

  if(!Users.isAdmin(user)){

    var timeSinceLastPost = Users.timeSinceLast(user, Trips),
      numberOfTripsInPast24Hours = Users.numberOfItemsInPast24Hours(user, Trips),
      postInterval = Math.abs(parseInt(Telescope.settings.get('postInterval', 30))),
      maxTripsPer24Hours = Math.abs(parseInt(Telescope.settings.get('maxTripsPerDay', 30)));

    // check that user waits more than X seconds between trips
    if(timeSinceLastPost < postInterval)
      throw new Meteor.Error(604, 'please_wait'+(postInterval-timeSinceLastPost)+'seconds_before_posting_again');

    // check that the user doesn't post more than Y trips per day
    if(numberOfTripsInPast24Hours > maxTripsPer24Hours)
      throw new Meteor.Error(605, 'sorry_you_cannot_submit_more_than'+maxTripsPer24Hours+'trips_per_day');

  }

  return trip;
}
Telescope.callbacks.add("trips.new.method", TripsNewRateLimit);

/**
 * @summary Properties
 */
function TripsNewSubmittedPropertiesCheck (trip, user) {

  // admin-only properties
  // status
  // postedAt
  // userId
  // sticky (default to false)

  const schema = Trips.simpleSchema()._schema;

  // go over each schema field and throw an error if it's not editable
  _.keys(trip).forEach(function (fieldName) {

    var field = schema[fieldName];
    if (!Users.canSubmitField (user, field)) {
      throw new Meteor.Error("disallowed_property", 'disallowed_property_detected' + ": " + fieldName);
    }

  });
  // note: not needed there anymore, this is already set in the next callback 'trips.new.sync' with other related properties (status, createdAt)
  // if no trip status has been set, set it now
  // if (!trip.status) {
  //   trip.status = Trips.getDefaultStatus(user);
  // }

  // if no userId has been set, default to current user id
  if (!trip.userId) {
    trip.userId = user._id;
  }

  return trip;
}
Telescope.callbacks.add("trips.new.method", TripsNewSubmittedPropertiesCheck);

// ------------------------------------- trips.new.sync -------------------------------- //

/**
 * @summary Check for duplicate links
 */
function TripsNewDuplicateLinksCheck (trip, user) {
  if(!!trip.url) {
    Trips.checkForSameUrl(trip.url);
  }
  return trip;
}
Telescope.callbacks.add("trips.new.sync", TripsNewDuplicateLinksCheck);

/**
 * @summary Check for necessary properties
 */
function TripsNewRequiredPropertiesCheck (trip, user) {

  // initialize default properties
  const defaultProperties = {
    createdAt: new Date(),
    author: Users.getDisplayNameById(trip.userId),
    status: Trips.getDefaultStatus(user)
  };

  trip = _.extend(defaultProperties, trip);

  // generate slug
  trip.slug = Telescope.utils.slugify(trip.name);

  // if trip is approved but doesn't have a postedAt date, give it a default date
  // note: pending trips get their postedAt date only once theyre approved
  if (Trips.isApproved(trip) && !trip.postedAt) {
    trip.postedAt = new Date();
  }

  return trip;
}
Telescope.callbacks.add("trips.new.sync", TripsNewRequiredPropertiesCheck);

/**
 * @summary Set the trip's isFuture to true if necessary
 */
function TripsNewSetFuture (trip, user) {
  trip.isFuture = trip.postedAt && trip.postedAt.getTime() > trip.createdAt.getTime() + 1000; // round up to the second
  return trip;
}
Telescope.callbacks.add("trips.new.sync", TripsNewSetFuture);

// ------------------------------------- trips.new.async -------------------------------- //

/**
 * @summary Increment the user's trip count
 */
function TripsNewIncrementTripCount (trip) {

  var userId = trip.userId;
  Users.update({_id: userId}, {$inc: {"telescope.tripCount": 1}});
}
Telescope.callbacks.add("trips.new.async", TripsNewIncrementTripCount);

/**
 * @summary Make users upvote their own new trips
 */
function TripsNewUpvoteOwnTrip (trip) {
  if (typeof Telescope.operateOnItem !== "undefined") {

    var tripAuthor = Users.findOne(trip.userId);

    Telescope.operateOnItem(Trips, trip._id, tripAuthor, "upvote");
  }
}
Telescope.callbacks.add("trips.new.async", TripsNewUpvoteOwnTrip);

/**
 * @summary Add new trip notification callback on trip submit
 */
function TripsNewNotifications (trip) {

  if (typeof Telescope.notifications !== "undefined") {

    var adminIds = _.pluck(Users.adminUsers({fields: {_id:1}}), '_id');
    var notifiedUserIds = _.pluck(Users.find({'telescope.notifications_trips': true}, {fields: {_id:1}}).fetch(), '_id');
    var notificationData = {
      trip: _.pick(trip, '_id', 'userId', 'title', 'url', 'slug')
    };

    // remove trip author ID from arrays
    adminIds = _.without(adminIds, trip.userId);
    notifiedUserIds = _.without(notifiedUserIds, trip.userId);

    if (trip.status === Trips.config.STATUS_PENDING && !!adminIds.length) {
      // if trip is pending, only notify admins
      Telescope.notifications.create(adminIds, 'newPendingPost', notificationData);
    } else if (!!notifiedUserIds.length) {
      // if trip is approved, notify everybody
      Telescope.notifications.create(notifiedUserIds, 'newPost', notificationData);
    }
  }
}
Telescope.callbacks.add("trips.new.async", TripsNewNotifications);

// ------------------------------------- trips.edit.method -------------------------------- //

function TripsEditUserCheck (modifier, trip, user) {
  // check that user can edit document
  if (!user || !Users.canEdit(user, trip)) {
    throw new Meteor.Error(601, 'sorry_you_cannot_edit_this_trip');
  }
  return modifier;
}
Telescope.callbacks.add("trips.edit.method", TripsEditUserCheck);

function TripsEditSubmittedPropertiesCheck (modifier, trip, user) {
  const schema = Trips.simpleSchema()._schema;
  // go over each field and throw an error if it's not editable
  // loop over each operation ($set, $unset, etc.)
  _.each(modifier, function (operation) {
    // loop over each property being operated on
    _.keys(operation).forEach(function (fieldName) {

      var field = schema[fieldName];
      if (!Users.canEditField(user, field, trip)) {
        throw new Meteor.Error("disallowed_property", 'disallowed_property_detected' + ": " + fieldName);
      }

    });
  });
  return modifier;
}
Telescope.callbacks.add("trips.edit.method", TripsEditSubmittedPropertiesCheck);

// ------------------------------------- trips.edit.sync -------------------------------- //

/**
 * @summary Check for duplicate links
 */
const TripsEditDuplicateLinksCheck = (modifier, trip) => {
  if(trip.url !== modifier.$set.url && !!modifier.$set.url) {
    Trips.checkForSameUrl(modifier.$set.url);
  }
  return modifier;
};
Telescope.callbacks.add("trips.edit.sync", TripsEditDuplicateLinksCheck);

/**
 * @summary Force sticky to default to false when it's not specified
 * (simpleSchema's defaultValue does not work on edit, so do it manually in callback)
 */
function TripsEditForceStickyToFalse (modifier, trip) {
  if (!modifier.$set.sticky) {
    if (modifier.$unset && modifier.$unset.sticky) {
      delete modifier.$unset.sticky;
    }
    modifier.$set.sticky = false;
  }
  return modifier;
}
Telescope.callbacks.add("trips.edit.sync", TripsEditForceStickyToFalse);

/**
 * @summary Set status
 */
function TripsEditSetIsFuture (modifier, trip) {
  // if a trip's postedAt date is in the future, set isFuture to true
  modifier.$set.isFuture = modifier.$set.postedAt && modifier.$set.postedAt.getTime() > new Date().getTime() + 1000;
  return modifier;
}
Telescope.callbacks.add("trips.edit.sync", TripsEditSetIsFuture);

/**
 * @summary Set postedAt date
 */
function TripsEditSetPostedAt (modifier, trip) {
  // if trip is approved but doesn't have a postedAt date, give it a default date
  // note: pending trips get their postedAt date only once theyre approved
  if (Trips.isApproved(trip) && !trip.postedAt) {
    modifier.$set.postedAt = new Date();
  }
  return modifier;
}
Telescope.callbacks.add("trips.edit.sync", TripsEditSetPostedAt);

// ------------------------------------- trips.edit.async -------------------------------- //

function TripsEditRunPostApprovedCallbacks (trip, oldPost) {
  // var now = new Date();

  if (Trips.isApproved(trip) && !Trips.isApproved(oldPost)) {
    Telescope.callbacks.runAsync("trips.approve.async", trip);
  }
}
Telescope.callbacks.add("trips.edit.async", TripsEditRunPostApprovedCallbacks);

// ------------------------------------- trips.approve.async -------------------------------- //

/**
 * @summary Add notification callback when a trip is approved
 */
function TripsApprovedNotification (trip) {
  if (typeof Telescope.notifications !== "undefined") {
    var notificationData = {
      trip: _.pick(trip, '_id', 'userId', 'title', 'url')
    };

    Telescope.notifications.create(trip.userId, 'tripApproved', notificationData);
  }
}
Telescope.callbacks.add("trips.approve.async", TripsApprovedNotification);

// ------------------------------------- users.remove.async -------------------------------- //

function UsersRemoveDeleteTrips (user, options) {
  if (options && options.deleteTrips) {
    Trips.remove({userId: user._id});
  } else {
    // not sure if anything should be done in that scenario yet
    // Trips.update({userId: userId}, {$set: {author: "\[deleted\]"}}, {multi: true});
  }
}
Telescope.callbacks.add("users.remove.async", UsersRemoveDeleteTrips);
