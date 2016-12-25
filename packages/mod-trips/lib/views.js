import Users from 'meteor/nova:users';
import Trips from './collection.js'

/**
 * @summary Post views are filters used for subscribing to and viewing trips
 * @namespace Trips.views
 */
Trips.views = {};

/**
 * @summary Add a trip view
 * @param {string} viewName - The name of the view
 * @param {function} [viewFunction] - The function used to calculate query terms. Takes terms and baseParameters arguments
 */
Trips.views.add = function (viewName, viewFunction) {
  Trips.views[viewName] = viewFunction;
};

/**
 * @summary Base parameters that will be common to all other view unless specific properties are overwritten
 */
Trips.views.baseParameters = {
  selector: {
    status: Trips.config.STATUS_APPROVED,
    isFuture: {$ne: true} // match both false and undefined
  }
};

/**
 * @summary Top view
 */
Trips.views.add("top", function (terms) {
  return {
    ...Trips.views.baseParameters,
    options: {sort: {sticky: -1, score: -1}}
  };
});

/**
 * @summary New view
 */
Trips.views.add("new", function (terms) {
  return {
    ...Trips.views.baseParameters,
    options: {sort: {sticky: -1, postedAt: -1}}
  };
});

/**
 * @summary Best view
 */
Trips.views.add("best", function (terms) {
  return {
    ...Trips.views.baseParameters,
    options: {sort: {sticky: -1, baseScore: -1}}
  };
});

/**
 * @summary Pending view
 */
Trips.views.add("pending", function (terms) {
  return {
    selector: {
      status: Trips.config.STATUS_PENDING
    },
    options: {sort: {createdAt: -1}}
  };
});

/**
 * @summary Rejected view
 */
Trips.views.add("rejected", function (terms) {
  return {
    selector: {
      status: Trips.config.STATUS_REJECTED
    },
    options: {sort: {createdAt: -1}}
  };
});

/**
 * @summary Scheduled view
 */
Trips.views.add("scheduled", function (terms) {
  return {
    selector: {
      status: Trips.config.STATUS_APPROVED,
      isFuture: true
    },
    options: {sort: {postedAt: -1}}
  };
});

/**
 * @summary User trips view
 */
Trips.views.add("userTrips", function (terms) {
  return {
    selector: {
      userId: terms.userId,
      status: Trips.config.STATUS_APPROVED,
      isFuture: {$ne: true}
    },
    options: {
      limit: 5,
      sort: {
        postedAt: -1
      }
    }
  };
});

/**
 * @summary User upvoted trips view
 */
Trips.views.add("userUpvotedTrips", function (terms) {
  var user = Users.findOne(terms.userId);
  var tripsIds = _.pluck(user.telescope.upvotedTrips, "itemId");
  return {
    selector: {_id: {$in: tripsIds}, userId: {$ne: terms.userId}}, // exclude own trips
    options: {limit: 5, sort: {postedAt: -1}}
  };
});

/**
 * @summary User downvoted trips view
 */
Trips.views.add("userDownvotedTrips", function (terms) {
  var user = Users.findOne(terms.userId);
  var tripsIds = _.pluck(user.telescope.downvotedTrips, "itemId");
  // TODO: sort based on votedAt timestamp and not postedAt, if possible
  return {
    selector: {_id: {$in: tripsIds}},
    options: {limit: 5, sort: {postedAt: -1}}
  };
});


Trips.views.add("test", function (terms) {
  return {
    selector: {
      title: {$regex: "newsletter", $options: 'i'}
    },
    options: {sort: {sticky: -1, baseScore: -1}}
  };
});
