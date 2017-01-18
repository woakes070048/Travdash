import Telescope from 'meteor/nova:lib';
// import Comments from "meteor/nova:comments";
import Users from 'meteor/nova:users';
import { Counts } from 'meteor/tmeasday:publish-counts';
import Trips from '../collection.js';

Trips._ensureIndex({"status": 1, "postedAt": 1});

// ------------------------------------- Helpers -------------------------------- //

/**
 * @summary Get all users relevant to a list of trips
 * (authors of the listed trips, and first four commenters of each trip)
 * @param {Object} trips
 */
const getTripsListUsers = trips => {

  // add the userIds of each trip authors
  let userIds = _.pluck(trips.fetch(), 'userId');

  // for each trip, also add first four commenter's userIds to userIds array
  trips.forEach(function (trip) {
    userIds = userIds.concat(_.first(trip.commenters,4));
  });

  userIds = _.unique(userIds);

  return Users.find({_id: {$in: userIds}}, {fields: Users.publishedFields.list});

};

/**
 * @summary Get all users relevant to a single trip
 * (author of the current trip, authors of its comments, and upvoters & downvoters of the trip)
 * @param {Object} trip
 */
const getSingleTripUsers = trip => {

  let users = [trip.userId]; // publish trip author's ID

  /*
  NOTE: to avoid circular dependencies between nova:trips and nova:comments,
  use callback hook to get comment authors
  */
  users = Telescope.callbacks.run("trips.single.getUsers", users, trip);

  // add upvoters
  if (trip.upvoters && trip.upvoters.length) {
    users = users.concat(trip.upvoters);
  }

  // add downvoters
  if (trip.downvoters && trip.downvoters.length) {
    users = users.concat(trip.downvoters);
  }

  // remove any duplicate IDs
  users = _.unique(users);

  return Users.find({_id: {$in: users}}, {fields: Users.publishedFields.list});
};

// ------------------------------------- Publications -------------------------------- //

/**
 * @summary Publish a list of trips, along with the users corresponding to these trips
 * @param {Object} terms
 */
Meteor.publish('trips.list', function (terms) {

  // this.unblock(); // causes bug where publication returns 0 results

  this.autorun(function () {

    const currentUser = this.userId && Users.findOne(this.userId);

    terms.currentUserId = this.userId; // add currentUserId to terms
    const {selector, options} = Trips.parameters.get(terms);

    Counts.publish(this, terms.listId, Trips.find(selector, options), {noReady: true});

    options.fields = Trips.publishedFields.list;

    const trips = Trips.find(selector, options);

    // note: doesn't work yet :(
    // CursorCounts.set(terms, trips.count(), this.connection.id);

    const users = Tracker.nonreactive(function () {
      return getTripsListUsers(trips);
    });

    return Users.canDo(currentUser, "trips.view.approved.all") ? [trips, users] : [];

  });

});

/**
 * @summary Publish a single trip, along with all relevant users
 * @param {Object} terms
 */
Meteor.publish('trips.single', function (terms) {

  check(terms, Match.OneOf({_id: String}, {_id: String, slug: Match.Any}));

  const currentUser = this.userId && Users.findOne(this.userId);
  const options = {fields: Trips.publishedFields.single};
  const trips = Trips.find(terms._id, options);
  const trip = trips.fetch()[0];

  if (trip) {
    const users = getSingleTripUsers(trip);
    return Users.canView(currentUser, trip) ? [trips, users] : [];
  } else {
    console.log(`// trips.single: no trip found for _id “${terms._id}”`); // eslint-disable-line
    return [];
  }

});
