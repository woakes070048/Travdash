import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import NovaForm from "meteor/nova:forms";
import { withRouter } from 'react-router';
import Trips from "meteor/travdash:trips";

const TripsNewForm = (props, context) => {

  const router = props.router;

  return (
    <Telescope.components.CanDo
      action="trips.new"
      noPermissionMessage="users.cannot_post"
      displayNoPermissionMessage={true}
    >
      <div className="trips-new-form">
        <NovaForm 
          collection={Trips} 
          methodName="trips.new"
          successCallback={(trip)=>{
            context.messages.flash(context.intl.formatMessage({id: "trips.created_message"}), "success");
            router.push({pathname: Trips.getPageUrl(trip)});
          }}
        />
      </div>
    </Telescope.components.CanDo>
  )
}

TripsNewForm.contextTypes = {
  currentUser: React.PropTypes.object,
  messages: React.PropTypes.object,
  intl: intlShape
};

TripsNewForm.displayName = "TripsNewForm";

module.exports = withRouter(TripsNewForm);
export default withRouter(TripsNewForm);