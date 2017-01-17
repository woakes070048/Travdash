import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import Users from 'meteor/nova:users';
import { Link } from 'react-router';

const UsersProfileCard = ({user}) => {

  const cardHeaderStyle = {
    backgroundImg: 'url()'
  };

  return (

    <div className="card card-profile mb-4">
      <div className="card-header" style={cardHeaderStyle}></div>
      <div className="card-block text-center">
        <Link className="card-profile-img" to={Users.getEditUrl(user)}>
          <Telescope.components.UsersAvatar size="large" user={user} link={false} />
        </Link>
        <h6 className="card-title">
          <Link to={Users.getEditUrl(user)}>{Users.getDisplayName(user)}</Link>
        </h6>
        <p className="mb-4">{user.telescope.bio}</p>
      </div>
    </div>
  )
}

UsersProfileCard.propTypes = {
  user: React.PropTypes.object.isRequired,
}

UsersProfileCard.displayName = "UsersProfileCard";

module.exports = UsersProfileCard;
