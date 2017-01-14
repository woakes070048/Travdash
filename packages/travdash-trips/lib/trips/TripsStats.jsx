import Telescope from 'meteor/nova:lib';
import React from 'react';

const TripsStats = ({trip}) => {

  return (
    <div className="trips-stats">
      {trip.score ? <span className="trips-stats-item" title="Score"><Telescope.components.Icon name="score"/> {Math.floor(trip.score*10000)/10000} <span className="sr-only">Score</span></span> : ""}
      <span className="trips-stats-item" title="Upvotes"><Telescope.components.Icon name="upvote"/> {trip.upvotes} <span className="sr-only">Upvotes</span></span>
      <span className="trips-stats-item" title="Clicks"><Telescope.components.Icon name="clicks"/> {trip.clickCount} <span className="sr-only">Clicks</span></span>
      <span className="trips-stats-item" title="Views"><Telescope.components.Icon name="views"/> {trip.viewCount} <span className="sr-only">Views</span></span>
    </div>
  )
}

TripsStats.displayName = "TripsStats";

module.exports = TripsStats;
export default TripsStats;