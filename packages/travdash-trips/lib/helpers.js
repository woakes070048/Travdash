import Telescope from 'meteor/nova:lib';
import moment from 'moment';
import Trips from './collection.js';
import Users from 'meteor/nova:users';

Trips.helpers({getCollection: () => Trips});
Trips.helpers({getCollectionName: () => "trips"});

//////////////////
// Link Helpers //
//////////////////

/**
 * @summary Return a trip's link if it has one, else return its trip page URL
 * @param {Object} trip
 */
Trips.getLink = function (trip, isAbsolute = false, isRedirected = true) {
  const url = isRedirected ? Telescope.utils.getOutgoingUrl(trip.url) : trip.url;
  return !!trip.url ? url : this.getPageUrl(trip, isAbsolute);
};
Trips.helpers({getLink: function (isAbsolute) {return Trips.getLink(this, isAbsolute);}});

/**
 * @summary Depending on the settings, return either a trips's URL link (if it has one) or its page URL.
 * @param {Object} trip
 */
Trips.getShareableLink = function (trip) {
  return Telescope.settings.get("outsideLinksPointTo", "link") === "link" ? Trips.getLink(trip) : Trips.getPageUrl(trip, true);
};
Trips.helpers({getShareableLink: function () {return Trips.getShareableLink(this);}});

/**
 * @summary Whether a trip's link should open in a new tab or not
 * @param {Object} trip
 */
Trips.getLinkTarget = function (trip) {
  return !!trip.url ? "_blank" : "";
};
Trips.helpers({getLinkTarget: function () {return Trips.getLinkTarget(this);}});

/**
 * @summary Get URL of a trip page.
 * @param {Object} trip
 */
Trips.getPageUrl = function(trip, isAbsolute = false){
  const prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";
  return `${prefix}/trips/${trip._id}/${trip.slug}`;
};
Trips.helpers({getPageUrl: function (isAbsolute) {return Trips.getPageUrl(this, isAbsolute);}});

///////////////////
// Other Helpers //
///////////////////

/**
 * @summary Get a trip author's name
 * @param {Object} trip
 */
Trips.getAuthorName = function (trip) {
  var user = Users.findOne(trip.userId);
  if (user) {
    return user.getDisplayName();
  } else {
    return trip.author;
  }
};
Trips.helpers({getAuthorName: function () {return Trips.getAuthorName(this);}});

/**
 * @summary Get default status for new trips.
 * @param {Object} user
 */
Trips.getDefaultStatus = function (user) {
  const canPostApproved = typeof user === 'undefined' ? false : Users.canDo(user, "trips.new.approved");
  if (!Telescope.settings.get('requireTripsApproval', false) || canPostApproved) {
    // if user can trip straight to "approved", or else trip approval is not required
    return Trips.config.STATUS_APPROVED;
  } else {
    return Trips.config.STATUS_PENDING;
  }
};

/**
 * @summary Check if a trip is approved
 * @param {Object} trip
 */
Trips.isApproved = function (trip) {
  return trip.status === Trips.config.STATUS_APPROVED;
};
Trips.helpers({isApproved: function () {return Trips.isApproved(this);}});

/**
 * @summary Check if a trip is pending
 * @param {Object} trip
 */
Trips.isPending = function (trip) {
  return trip.status === Trips.config.STATUS_PENDING;
};
Trips.helpers({isPending: function () {return Trips.isPending(this);}});


/**
 * @summary Check to see if trip URL is unique.
 * We need the current user so we know who to upvote the existing trip as.
 * @param {String} url
 */
Trips.checkForSameUrl = function (url) {

  // check that there are no previous trips with the same link in the past 6 months
  var sixMonthsAgo = moment().subtract(6, 'months').toDate();
  var tripWithSameLink = Trips.findOne({url: url, postedAt: {$gte: sixMonthsAgo}});

  if (typeof tripWithSameLink !== 'undefined') {
    throw new Meteor.Error('603', 'trips.link_already_triped', tripWithSameLink._id);
  }
};

/**
 * @summary When on a trip page, return the current trip
 */
Trips.current = function () {
  return Trips.findOne("foo");
};

/**
 * @summary Check to see if a trip is a link to a video
 * @param {Object} trip
 */
Trips.isVideo = function (trip) {
  return trip.media && trip.media.type === "video";
};
Trips.helpers({isVideo: function () {return Trips.isVideo(this);}});

/**
 * @summary Get the complete thumbnail url whether it is hosted on Embedly or on an external website, or locally in the app.
 * @param {Object} trip
 */
Trips.getThumbnailUrl = (trip) => {
  const thumbnailUrl = trip.thumbnailUrl;
  if (!!thumbnailUrl) {
    return thumbnailUrl.indexOf('//') > -1 ? Telescope.utils.addHttp(thumbnailUrl) : Telescope.utils.getSiteUrl().slice(0,-1) + thumbnailUrl;
  }
};
Trips.helpers({ getThumbnailUrl() { return Trips.getThumbnailUrl(this); } });

/**
 * @summary Get URL for sharing on Twitter.
 * @param {Object} trip
 */
Trips.getTwitterShareUrl = trip => {
  const via = Telescope.settings.get("twitterAccount", null) ? `&via=${Telescope.settings.get("twitterAccount")}` : "";
  return `https://twitter.com/intent/tweet?text=${ encodeURIComponent(trip.name) }%20${ encodeURIComponent(Trips.getLink(trip, true)) }${via}`;
};
Trips.helpers({ getTwitterShareUrl() { return Trips.getTwitterShareUrl(this); } });

/**
 * @summary Get URL for sharing on Facebook.
 * @param {Object} trip
 */
Trips.getFacebookShareUrl = trip => {
  return `https://www.facebook.com/sharer/sharer.php?u=${ encodeURIComponent(Trips.getLink(trip, true)) }`;
};
Trips.helpers({ getFacebookShareUrl() { return Trips.getFacebookShareUrl(this); } });

/**
 * @summary Get URL for sharing by Email.
 * @param {Object} trip
 */
Trips.getEmailShareUrl = trip => {
  const subject = `Interesting link: ${trip.name}`;
  const body = `I thought you might find this interesting:

${trip.name}
${Trips.getLink(trip, true, false)}

(found via ${Telescope.settings.get("siteUrl")})
  `;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
Trips.helpers({ getEmailShareUrl() { return Trips.getEmailShareUrl(this); } });
