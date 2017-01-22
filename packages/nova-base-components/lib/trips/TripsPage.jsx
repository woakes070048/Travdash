import Telescope from 'meteor/nova:lib';
import React from 'react';
import Trips from "meteor/travdash:trips";

const TripsPage = ({document, currentUser}) => {

  const trip = document;
  const htmlBody = {__html: trip.htmlBody};

  return (
    <div className="trips-page">

      <Telescope.components.HeadTags url={Trips.getLink(trip)} title={trip.title} image={trip.thumbnailUrl} />

      <Telescope.components.TripsItem trip={trip}/>

      {trip.htmlBody ? <div className="trips-page-body" dangerouslySetInnerHTML={htmlBody}></div> : null}

      {/*<SocialShare url={ Trips.getLink(post) } title={ trip.title }/>*/}

      <Telescope.components.TripsCommentsThread document={trip} />

    </div>
  )
};

TripsPage.displayName = "TripsPage";

module.exports = TripsPage;
export default TripsPage;
