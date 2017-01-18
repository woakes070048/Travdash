import Telescope from 'meteor/nova:lib';
import React from 'react';
//import { Messages } from "meteor/nova:core";

const Header = (props, {currentUser}) => {

  const logoUrl = Telescope.settings.get("logoUrl");
  const siteTitle = Telescope.settings.get("title", "Travdash");
  const tagline = Telescope.settings.get("tagline");

  return (
    <nav className="navbar navbar-fixed-top navbar-dark bg-primary app-navbar">

      <div className="container">

        <div className="navbar-header">
          <Telescope.components.Logo logoUrl={logoUrl} siteTitle={siteTitle} />
          {tagline ? <h2 className="tagline">{tagline}</h2> : "" }
        </div>

        <div className="collapse navbar-toggleable-sm">

          <ul className="nav navbar-nav float-right mr-0 hidden-sm-down">
            <li className="nav-item nav-user">
              {currentUser ? <Telescope.components.UsersMenu/> : <Telescope.components.UsersAccountMenu/>}
            </li>
            <li className="nav-item nav-new-trip">
              <Telescope.components.TripsNewButton/>
            </li>
            <li className="nav-item nav-new-post">
              <Telescope.components.PostsNewButton/>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  )
}

Header.displayName = "Header";

Header.contextTypes = {
  currentUser: React.PropTypes.object,
};

module.exports = Header;
