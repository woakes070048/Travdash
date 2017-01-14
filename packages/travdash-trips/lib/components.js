/*
This file centralizes all our custom component overrides. 
*/

import Telescope from 'meteor/nova:lib';

import CustomLogo from "./components/CustomLogo.jsx";
import CustomHeader from "./components/CustomHeader.jsx";
import CustomNewsletter from "./components/CustomNewsletter.jsx";
import CustomPostsItem from "./components/CustomPostsItem.jsx";

Telescope.components.Logo = CustomLogo;
Telescope.components.Header = CustomHeader;
Telescope.components.Newsletter = CustomNewsletter;
Telescope.components.PostsItem = CustomPostsItem;


Telescope.registerComponent("TripsCommenters",      require('./trips/TripsCommenters.jsx'));
Telescope.registerComponent("TripsEditForm",        require('./trips/TripsEditForm.jsx'));
Telescope.registerComponent("TripsHome",            require('./trips/TripsHome.jsx'));
Telescope.registerComponent("TripsItem",            require('./trips/TripsItem.jsx'));
Telescope.registerComponent("TripsList",            require('./trips/TripsList.jsx'));
Telescope.registerComponent("TripsListHeader",      require('./trips/TripsListHeader.jsx'));
Telescope.registerComponent("TripsLoading",         require('./trips/TripsLoading.jsx'));
Telescope.registerComponent("TripsLoadMore",        require('./trips/TripsLoadMore.jsx'));
Telescope.registerComponent("TripsNewButton",       require('./trips/TripsNewButton.jsx'));
Telescope.registerComponent("TripsNewForm",         require('./trips/TripsNewForm.jsx'));
Telescope.registerComponent("TripsNoMore",          require('./trips/TripsNoMore.jsx'));
Telescope.registerComponent("TripsNoResults",       require('./trips/TripsNoResults.jsx'));
Telescope.registerComponent("TripsSingle",          require('./trips/TripsSingle.jsx'));
Telescope.registerComponent("TripsStats",           require('./trips/TripsStats.jsx'));
Telescope.registerComponent("TripsThumbnail",       require('./trips/TripsThumbnail.jsx'));