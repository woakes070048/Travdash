import Telescope from 'meteor/nova:lib';
import Trips from './collection.js';
import Users from 'meteor/nova:users';

Trips.getNotificationProperties = function (data) {
  const post = data.post;
  const postAuthor = Users.findOne(trip.userId);
  const properties = {
    postAuthorName : Trips.getAuthorName(trip),
    postTitle : Telescope.utils.cleanUp(trip.name),
    profileUrl: Users.getProfileUrl(tripAuthor, true),
    postUrl: Trips.getPageUrl(trip, true),
    thumbnailUrl: trip.thumbnailUrl,
    linkUrl: !!trip.url ? Telescope.utils.getOutgoingUrl(trip.url) : Trips.getPageUrl(trip, true)
  };

  if(trip.url)
    properties.url = trip.url;

  if(trip.htmlBody)
    properties.htmlBody = trip.htmlBody;

  return properties;
};
