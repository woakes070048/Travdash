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


Telescope.registerComponent("TripsNewButton",       require('./trips/TripsNewButton.jsx'));
Telescope.registerComponent("TripsNewForm",         require('./trips/TripsNewForm.jsx'));