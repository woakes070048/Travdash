import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { ListContainer /* , DocumentContainer */ } from "meteor/utilities:react-list-container";
import Trips from "meteor/travdash:trips";

class TripsHome extends Component {

  getDefaultView() {
    return {view: 'top'};
  }

  render() {

    const params = {...this.getDefaultView(), ...this.props.location.query, listId: "trips.list.main"};
    const {selector, options} = Trips.parameters.get(params);

    return (
      <ListContainer
        collection={Trips}
        publication="trips.list"
        selector={selector}
        options={options}
        terms={params}
        joins={Trips.getJoins()}
        component={Telescope.components.TripsList}
        cacheSubscription={true}
        listId={params.listId}
        limit={Telescope.settings.get("tripsPerPage", 10)}
      />
    )
  }
}

module.exports = TripsHome;