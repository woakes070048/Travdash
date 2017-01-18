import Users from 'meteor/nova:users';

const anonymousActions = [
  "trips.view.approved.own",
  "trips.view.approved.all"
];
Users.groups.anonymous.can(anonymousActions);

const defaultActions = [
  "trips.view.approved.own",
  "trips.view.approved.all",
  "trips.view.pending.own",
  "trips.view.rejected.own",
  "trips.view.spam.own",
  "trips.view.deleted.own",
  "trips.new", 
  "trips.edit.own", 
  "trips.remove.own", 
  "trips.upvote", 
  "trips.cancelUpvote", 
  "trips.downvote",
  "trips.cancelDownvote"
];
Users.groups.default.can(defaultActions);

const adminActions = [
  "trips.view.pending.all",
  "trips.view.rejected.all",
  "trips.view.spam.all",
  "trips.view.deleted.all",
  "trips.new.approved",
  "trips.edit.all",
  "trips.remove.all"
];
Users.groups.admins.can(adminActions);
