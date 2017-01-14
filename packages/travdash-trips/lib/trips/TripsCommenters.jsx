import Telescope from 'meteor/nova:lib';
import React from 'react';
import { Link } from 'react-router';
import Trips from "meteor/mod-trips";

const TripsCommenters = ({trip}) => {
  return (
    <div className="trips-commenters">
      <div className="trips-commenters-avatars">
        {_.take(trip.commentersArray, 4).map(user => <Telescope.components.UsersAvatar key={user._id} user={user}/>)}
      </div>
      <div className="trips-commenters-discuss">
        <Link to={Trips.getPageUrl(trip)}>
          <Telescope.components.Icon name="comment" />
          <span className="trips-commenters-comments-count">{trip.commentCount}</span>
          <span className="sr-only">Comments</span>
        </Link>
      </div>
    </div>
  )
}

TripsCommenters.displayName = "TripsCommenters";

module.exports = TripsCommenters;
export default TripsCommenters;