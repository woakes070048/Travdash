import Trips from './collection.js';
import PublicationsUtils from 'meteor/utilities:smart-publications';

Trips.publishedFields = {};

/**
 * @summary Specify which fields should be published by the trips.list publication
 * @array Trips.publishedFields.list
 */
Trips.publishedFields.list = PublicationsUtils.arrayToFields([
  "_id",
  "createdAt",
  "postedAt",
  "url",
  "title",
  "slug",
  "excerpt",
  "viewCount",
  "lastCommentedAt",
  "clickCount",
  "baseScore",
  "score",
  "status",
  "sticky",
  "author",
  "userId",
  "isFuture"
]);

/**
 * @summary Specify which fields should be published by the posts.single publication
 * @array Trips.publishedFields.single
 */
Meteor.startup(() => {
  Trips.publishedFields.single = PublicationsUtils.arrayToFields(Trips.getPublishedFields());
});