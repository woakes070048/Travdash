import Telescope from 'meteor/nova:lib';
import React from 'react';
import { DocumentContainer } from "meteor/utilities:react-list-container";
import Trips from "meteor/travdash:trips";

const TripsSingle = (props, context) => {
  return (
    <DocumentContainer 
      collection={Trips} 
      publication="trips.single" 
      selector={{_id: props.params._id}}
      terms={props.params}
      joins={Trips.getJoins()}
      component={Telescope.components.TripsPage}
    />
  )
};

TripsSingle.displayName = "TripsSingle";

module.exports = TripsSingle;