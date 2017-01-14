import React from "react";
import { FormattedMessage } from "react-intl";

const TripsNoMore = props => <p className="trips-no-more"><FormattedMessage id="trips.no_more"/></p>;

TripsNoMore.displayName = "TripsNoMore";

module.exports = TripsNoMore;