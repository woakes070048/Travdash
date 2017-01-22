import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import { ModalTrigger } from "meteor/nova:core";

const PostsNewLink = (props, context) => {

  const size = context.currentUser ? "large" : "small";
  const link = <a className="nav-link"><FormattedMessage id="posts.new_post"/></a>;
  return (
    <ModalTrigger size={size} title={context.intl.formatMessage({id: "posts.new_post"})} component={link}>
      <Telescope.components.PostsNewForm/>
    </ModalTrigger>
  )
}

PostsNewLink.displayName = "PostsNewLink";

PostsNewLink.contextTypes = {
  currentUser: React.PropTypes.object,
  messages: React.PropTypes.object,
  intl: intlShape
}

module.exports = PostsNewLink;
export default PostsNewLink;
