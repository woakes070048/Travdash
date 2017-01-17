import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { ListContainer } from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import { Link } from 'react-router';

const UsersProfile = ({user}, {currentUser}) => {

  const twitterName = Users.getTwitterName(user);
  const terms = {view:"userPosts", userId: user._id};
  const {selector, options} = Posts.parameters.get(terms);

  return (
    <div className="page users-profile">

      <Telescope.components.HeadTags url={Users.getProfileUrl(user, true)} title={Users.getDisplayName(user)} description={user.telescope.bio} />

      <Telescope.components.UsersProfileCard user={currentUser} />

      <Telescope.components.UsersProfileSummary user={currentUser} />

      <h3><FormattedMessage id="users.posts"/></h3>
      <ListContainer
        collection={Posts}
        publication="posts.list"
        terms={terms}
        selector={selector}
        options={options}
        joins={Posts.getJoins()}
        cacheSubscription={false}
        component={Telescope.components.PostsList}
        componentProps={{showHeader: false}}
        listId="posts.list.user"
      />
    </div>
  )
}

UsersProfile.propTypes = {
  user: React.PropTypes.object.isRequired,
}

UsersProfile.contextTypes = {
  currentUser: React.PropTypes.object
}

UsersProfile.displayName = "UsersProfile";

module.exports = UsersProfile;
