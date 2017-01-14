import React from 'react';
import Trips from "meteor/mod-trips";

const TripsThumbnail = ({trip}) => {
  return (
    <a className="trips-thumbnail" href={Trips.getLink(trip)} target={Trips.getLinkTarget(trip)}>
      <span><img src={Trips.getThumbnailUrl(trip)} /></span>
    </a>
  )
}

TripsThumbnail.displayName = "TripsThumbnail";

module.exports = TripsThumbnail;
export default TripsThumbnail;