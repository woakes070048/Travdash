import React from 'react';
import { FormattedMessage } from "react-intl";

const TripsNoResults = props => <p className="trips-no-results"><FormattedMessage id="trips.no_results"/></p>;

TripsNoResults.displayName = "TripsNoResults";

module.exports = TripsNoResults;