import Telescope from 'meteor/nova:lib';
import { ModalTrigger } from "meteor/nova:core";
import Trips from "meteor/travdash:trips";
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { Link } from 'react-router';
// import { Button } from 'react-bootstrap';
// import moment from 'moment';
// import Users from 'meteor/nova:users';

class TripsItem extends Component {

  renderCategories() {
    return this.props.trip.categoriesArray ? <Telescope.components.TripsCategories trip={this.props.trip} /> : "";
  }

  renderCommenters() {
    return this.props.trip.commentersArray ? <Telescope.components.TripsCommenters trip={this.props.trip}/> : "";
  }

  renderActions() {
    return (
      <div className="trip-actions">
        <Telescope.components.CanDo
          action="trips.edit.all"
          document={this.props.trip}
        >
          <ModalTrigger title="Edit Trip" component={<a className="trips-action-edit"><FormattedMessage id="forms.edit"/></a>}>
            <Telescope.components.TripsEditForm trip={this.props.trip}/>
          </ModalTrigger>
        </Telescope.components.CanDo>
      </div>
    )
  }

  render() {

    const trip = this.props.trip;
    
    let tripClass = "trips-item";
    if (trip.sticky) tripClass += " trips-sticky";

    return (
      <div className={tripClass}>

        <div className="trips-item-vote">
          {/*<Telescope.components.Vote trip={trip} />*/}
        </div>

        {trip.thumbnailUrl ? <Telescope.components.TripsThumbnail trip={trip}/> : null}

        <div className="trips-item-content">

          <h3 className="trips-item-title">
            <Link to={Trips.getLink(trip)} className="trips-item-title-link" target={Trips.getLinkTarget(trip)}>
              {trip.name}
            </Link>
            {this.renderCategories()}
          </h3>

          <div className="trips-item-meta">
            {trip.user? <div><FormattedMessage id="trips.hostedBy"/> <Telescope.components.UsersName user={trip.user}/></div> : null}
            <div className="trips-item-date">{trip.postedAt ? <FormattedDate value={trip.postedAt}/> : <FormattedMessage id="trips.dateNotDefined"/>}</div>
            {this.renderActions()}
          </div>

        </div>

        {this.renderCommenters()}


      </div>
    )
  }
}

TripsItem.propTypes = {
  trip: React.PropTypes.object.isRequired
}

TripsItem.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = TripsItem;
export default TripsItem;
