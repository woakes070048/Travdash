import React from 'react';
import { FormattedMessage } from 'react-intl';

const TripsLoadMore = ({loadMore, count, totalCount}) => {
  return (
    <a className="trips-load-more" onClick={loadMore}>
      <span><FormattedMessage id="trips.load_more"/></span>
      &nbsp;
      {totalCount ? <span className="load-more-count">{`(${count}/${totalCount})`}</span> : null}
    </a>
  )
}

TripsLoadMore.displayName = "TripsLoadMore";

module.exports = TripsLoadMore;