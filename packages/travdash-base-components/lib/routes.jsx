/*
A new custom route for our custom page. 
Browse to http://localhost:3000/my-custom-route to see it.
*/

import Telescope from 'meteor/nova:lib';
import MyCustomPage from './components/MyCustomPage.jsx';
import TripsHome from './trips/TripsHome.jsx';

Telescope.routes.add([
	{name: "myCustomRoute",  path: "/my-custom-route", component: MyCustomPage},
	{name: "trips.list",     path: "/trips", 					 component: TripsHome}
]);