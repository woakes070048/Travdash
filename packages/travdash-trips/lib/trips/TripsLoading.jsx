import Telescope from 'meteor/nova:lib';
import React from 'react';

const TripsLoading = props => {
  const Loading = Telescope.components.Loading;
  return <div className="trips-load-more-loading"><Loading/></div>
}

TripsLoading.displayName = "TripsLoading";

module.exports = TripsLoading;