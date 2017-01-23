import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FlashContainer } from "meteor/nova:core";

class Layout extends Component {

  render() {

    return (
      <div className="with-top-navbar" id="wrapper">

        <Telescope.components.HeadTags />

        <Telescope.components.UsersProfileCheck {...this.props} />

        <Telescope.components.Header {...this.props}/>

        <div className="container pt-4">

          <FlashContainer component={Telescope.components.FlashMessages}/>

          {this.props.children}

        </div>

        <Telescope.components.Footer {...this.props}/>

      </div>
    )

  }
}

Layout.displayName = "Layout";

module.exports = Layout;
