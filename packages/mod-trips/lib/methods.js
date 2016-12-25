import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import Events from 'meteor/nova:events';
import { Messages } from 'meteor/nova:core';
import Trips from './collection.js'

/**
 *
 * Post Methods
 *
 */

Trips.methods = {};
/**
 * @summary Insert a trip in the database (note: optional trip properties not listed here)
 * @param {Object} trip - the trip being inserted
 * @param {string} trip.userId - the id of the user the trip belongs to
 * @param {string} trip.title - the trip's title
 */
Trips.methods.new = function (trip) {

  const currentUser = Users.findOne(trip.userId);

  trip = Telescope.callbacks.run("trips.new.sync", trip, currentUser);

  trip._id = Trips.insert(trip);

  // note: query for trip to get fresh document with collection-hooks effects applied
  Telescope.callbacks.runAsync("trips.new.async", Trips.findOne(trip._id));

  return trip;
};

/**
 * @summary Edit a trip in the database
 * @param {string} tripId – the ID of the trip being edited
 * @param {Object} modifier – the modifier object
 * @param {Object} trip - the current trip object
 */
Trips.methods.edit = function (tripId, modifier, trip) {

  if (typeof trip === "undefined") {
    trip = Trips.findOne(tripId);
  }

  modifier = Telescope.callbacks.run("trips.edit.sync", modifier, trip);

  Trips.update(tripId, modifier);

  Telescope.callbacks.runAsync("trips.edit.async", Trips.findOne(tripId), trip);

  return Trips.findOne(tripId);
};

/**
 * @summary Increase the number of clicks on a trip
 * @param {string} tripId – the ID of the trip being edited
 * @param {string} ip – the IP of the current user
 */
Trips.methods.increaseClicks = (tripId, ip) => {

  var clickEvent = {
    name: 'click',
    properties: {
      tripId: tripId,
      ip: ip
    }
  };

  // make sure this IP hasn't previously clicked on this trip
  var existingClickEvent = Events.findOne({name: 'click', 'properties.tripId': tripId, 'properties.ip': ip});

  if(!existingClickEvent){
    Events.log(clickEvent);
    Trips.update(tripId, { $inc: { clickCount: 1 }});
  }
};

// ------------------------------------------------------------------------------------------- //
// ----------------------------------------- Methods ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //

var tripViews = [];

Meteor.methods({

  /**
   * @summary Meteor method for submitting a trip from the client
   * NOTE: the current user and the trip author user might sometimes be two different users!
   * Required properties: title
   * @memberof Trips
   * @isMethod true
   * @param {Object} trip - the trip being inserted
   */
  'trips.new': function(trip){

    Trips.simpleSchema().namedContext("trips.new").validate(trip);

    trip = Telescope.callbacks.run("trips.new.method", trip, Meteor.user());

    if (Meteor.isServer && this.connection) {
      trip.userIP = this.connection.clientAddress;
      trip.userAgent = this.connection.httpHeaders["user-agent"];
    }

    return Trips.methods.new(trip);
  },

  /**
   * @summary Meteor method for editing a trip from the client
   * @memberof Trips
   * @isMethod true
   * @param {Object} tripId - the id of the trip being updated
   * @param {Object} modifier - the update modifier
   */
  'trips.edit': function (tripId, modifier) {

    Trips.simpleSchema().namedContext("trips.edit").validate(modifier, {modifier: true});
    check(tripId, String);

    const trip = Trips.findOne(tripId);

    modifier = Telescope.callbacks.run("trips.edit.method", modifier, trip, Meteor.user());

    return Trips.methods.edit(tripId, modifier, trip);

  },

  /**
   * @summary Meteor method for approving a trip
   * @memberof Trips
   * @isMethod true
   * @param {String} tripId - the id of the trip to approve
   */
  'trips.approve': function(tripId){

    check(tripId, String);

    const trip = Trips.findOne(tripId);
    const now = new Date();

    if (Users.canDo(Meteor.user(), "trips.new.approved")) {

      const set = {status: Trips.config.STATUS_APPROVED};

      if (!trip.postedAt) {
        set.postedAt = now;
      }

      Trips.update(trip._id, {$set: set});

      Telescope.callbacks.runAsync("trips.approve.async", trip);

    } else {
      Messages.flash('You need to be an admin to do that.', "error");
    }
  },

  /**
   * @summary Meteor method for rejecting a trip
   * @memberof Trips
   * @isMethod true
   * @param {String} tripId - the id of the trip to reject
   */
  'trips.reject': function(tripId){

    check(tripId, String);

    const trip = Trips.findOne(tripId);

    if(Users.isAdmin(Meteor.user())){

      Trips.update(trip._id, {$set: {status: Trips.config.STATUS_REJECTED}});

      Telescope.callbacks.runAsync("tripRejectAsync", trip);

    }else{
      Messages.flash('You need to be an admin to do that.', "error");
    }
  },

  /**
   * @summary Meteor method for increasing the number of views on a trip
   * @memberof Trips
   * @isMethod true
   * @param {String} tripId - the id of the trip
   */
  'trips.increaseViews': function(tripId, sessionId){

    check(tripId, String);
    check(sessionId, Match.Any);

    // only let users increment a trip's view counter once per session
    var view = {_id: tripId, userId: this.userId, sessionId: sessionId};

    if (_.where(tripViews, view).length === 0) {
      tripViews.push(view);
      Trips.update(tripId, { $inc: { viewCount: 1 }});
    }
  },

  /**
   * @summary Meteor method for deleting a trip
   * @memberof Trips
   * @isMethod true
   * @param {String} tripId - the id of the trip
   */
  'trips.remove': function(tripId) {

    check(tripId, String);

    // remove trip comments
    // if(!this.isSimulation) {
    //   Comments.remove({trip: tripId});
    // }
    // NOTE: actually, keep comments after all

    var trip = Trips.findOne({_id: tripId});

    if (!Meteor.userId() || !Users.canEdit(Meteor.user(), trip)){
      throw new Meteor.Error(606, 'You need permission to edit or delete a trip');
    }

    // decrement trip count
    Users.update({_id: trip.userId}, {$inc: {"telescope.tripCount": -1}});

    // delete trip
    Trips.remove(tripId);

    Telescope.callbacks.runAsync("trips.remove.async", trip);

  },

  /**
   * @summary Check for other trips with the same URL
   * @memberof Trips
   * @isMethod true
   * @param {String} url - the URL to check
   */
  'trips.checkForDuplicates': function (url) {
    Trips.checkForSameUrl(url);
  },

  /**
   * @summary Upvote a trip
   * @memberof Trips
   * @isMethod true
   * @param {String} tripId - the id of the trip
   */
  'trips.upvote': function (tripId) {
    check(tripId, String);
    return Telescope.operateOnItem.call(this, Trips, tripId, Meteor.user(), "upvote");
  },

  /**
   * @summary Downvote a trip
   * @memberof Trips
   * @isMethod true
   * @param {String} tripId - the id of the trip
   */
  'trips.downvote': function (tripId) {
    check(tripId, String);
    return Telescope.operateOnItem.call(this, Trips, tripId, Meteor.user(), "downvote");
  },


  /**
   * @summary Cancel an upvote on a trip
   * @memberof Trips
   * @isMethod true
   * @param {String} tripId - the id of the trip
   */
  'trips.cancelUpvote': function (tripId) {
    check(tripId, String);
    return Telescope.operateOnItem.call(this, Trips, tripId, Meteor.user(), "cancelUpvote");
  },

  /**
   * @summary Cancel a downvote on a trip
   * @memberof Trips
   * @isMethod true
   * @param {String} tripId - the id of the trip
   */
  'trips.cancelDownvote': function (tripId) {
    check(tripId, String);
    return Telescope.operateOnItem.call(this, Trips, tripId, Meteor.user(), "cancelDownvote");
  }

});
