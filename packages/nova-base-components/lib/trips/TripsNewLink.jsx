import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import { ModalTrigger } from "meteor/nova:core";

const TripsNewLink = (props, context) => {

  const size = context.currentUser ? "large" : "small";
  const link = <a className="nav-link" href="#"><FormattedMessage id="trips.new_trip"/></a>;
  return (
    <ModalTrigger size={size} title={context.intl.formatMessage({id: "trips.new_trip"})} component={link}>
      <Telescope.components.TripsNewForm/>
    </ModalTrigger>
  )
}

TripsNewLink.displayName = "TripsNewLink";

TripsNewLink.contextTypes = {
  currentUser: React.PropTypes.object,
  messages: React.PropTypes.object,
  intl: intlShape
}

module.exports = TripsNewLink;
export default TripsNewLink;
