import Telescope from 'meteor/nova:lib';
import NovaForm from "meteor/nova:forms";
import { DocumentContainer } from "meteor/utilities:react-list-container";
import Trips from "meteor/travdash:trips";
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
// import { Messages } from "meteor/nova:core";
// import Actions from "../actions.js";
// import Users from 'meteor/nova:users';

class TripsEditForm extends Component{

  constructor() {
    super();
    this.deleteTrip = this.deleteTrip.bind(this);
  }

  deleteTrip() {

    const trip = this.props.trip;
    const deleteTripConfirm = this.context.intl.formatMessage({id: "trips.delete_confirm"}, {title: trip.title});
    const deleteTripSuccess = this.context.intl.formatMessage({id: "trips.delete_success"}, {title: trip.title});

    if (window.confirm(deleteTripConfirm)) {
      this.context.actions.call('trips.remove', trip._id, (error, result) => {
        this.context.messages.flash(deleteTripSuccess, "success");
        this.context.events.track("trip deleted", {'_id': trip._id});
      });
    }
  }

  renderAdminArea() {
    return (
      <Telescope.components.CanDo action="trips.edit.all">
        <div className="trips-edit-form-admin">
          <div className="trips-edit-form-id">ID: {this.props.trip._id}</div>
        </div>
      </Telescope.components.CanDo>
    )
  }

  render() {


    return (
      <div className="trips-edit-form">
        {this.renderAdminArea()}
        <DocumentContainer
          collection={Trips}
          publication="trips.single"
          selector={{_id: this.props.trip._id}}
          terms={{_id: this.props.trip._id}}
          joins={Trips.getJoins()}
          component={NovaForm}
          componentProps={{
            // note: the document prop will be passed from DocumentContainer
            collection: Trips,
            currentUser: this.context.currentUser,
            methodName: "trips.edit",
            successCallback: (trip) => {
              this.context.messages.flash(this.context.intl.formatMessage({id: "trips.edit_success"}, {title: trip.title}), 'success')
            }
          }}
        />
        <hr/>
        <a onClick={this.deleteTrip} className="delete-trip-link"><FormattedMessage id="trips.delete"/></a>
      </div>
    )
  }
}

TripsEditForm.propTypes = {
  trip: React.PropTypes.object.isRequired
}

TripsEditForm.contextTypes = {
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  messages: React.PropTypes.object,
  intl: intlShape
}

module.exports = TripsEditForm;
export default TripsEditForm;
