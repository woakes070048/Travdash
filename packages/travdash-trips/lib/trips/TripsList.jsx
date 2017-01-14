import Telescope from 'meteor/nova:lib';
import React from 'react';

const TripsList = ({results, currentUser, hasMore, ready, count, totalCount, loadMore, showHeader = true}) => {

  console.log(results);

  if (!!results.length) {
    return (
      <div className="trips-list">
        {showHeader ? <Telescope.components.TripsListHeader /> : null}
        <div className="trips-list-content">
          {results.map(trip => <Telescope.components.TripsItem trip={trip} key={trip._id}/>)}
        </div>
        {hasMore ? (ready ? <Telescope.components.TripsLoadMore loadMore={loadMore} count={count} totalCount={totalCount} /> : <Telescope.components.TripsLoading/>) : <Telescope.components.TripsNoMore/>}
      </div>
    )
  } else if (!ready) {
    return (
      <div className="trips-list">
        {showHeader ? <Telescope.components.TripsListHeader /> : null}
        <div className="trips-list-content">
          <Telescope.components.TripsLoading/>
        </div>
      </div>
    )
  } else {
    return (
      <div className="trips-list">
        {showHeader ? <Telescope.components.TripsListHeader /> : null}
        <div className="trips-list-content">
          <Telescope.components.TripsNoResults/>
        </div>
      </div>
    )  
  }
  
};

TripsList.displayName = "TripsList";

module.exports = TripsList;