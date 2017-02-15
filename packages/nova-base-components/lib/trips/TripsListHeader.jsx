import Telescope from 'meteor/nova:lib';
import React from 'react';
import { ListContainer } from "meteor/utilities:react-list-container";
import Categories from "meteor/nova:categories";

const TripsListHeader = () => {

  return (
    <div>
      <div className="trips-list-header">
        <div className="trips-list-header-categories">
          <ListContainer
            collection={Categories}
            limit={0}
            resultsPropName="categories"
            component={Telescope.components.CategoriesList}
            listId="categories"
          />
        </div>
        <Telescope.components.PostsViews />
      </div>
    </div>
  )
}

TripsListHeader.displayName = "TripsListHeader";

module.exports = TripsListHeader;
export default TripsListHeader;
