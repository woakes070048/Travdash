import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import { Button } from 'react-bootstrap';
import { ModalTrigger } from "meteor/nova:core";

const TripsNewButton = (props, context) => {

  const size = context.currentUser ? "large" : "small";
  const button = <Button className="trips-new-button" bsStyle="primary"><FormattedMessage id="trips.new_trip"/></Button>;
  return (
    <ModalTrigger size={size} title={context.intl.formatMessage({id: "trips.new_trip"})} component={button}>
      <Telescope.components.TripsNewForm/>
    </ModalTrigger>
  )
}

TripsNewButton.displayName = "TripsNewButton";

TripsNewButton.contextTypes = {
  currentUser: React.PropTypes.object,
  messages: React.PropTypes.object,
  intl: intlShape
}

module.exports = TripsNewButton;
export default TripsNewButton;