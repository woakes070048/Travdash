const TripsStub = {
  helpers: x => x
};

/* we need to handle two scenarios: when the package is called as a Meteor package, 
and when it's called as a NPM package */
const Trips = typeof Mongo !== "undefined" ? new Mongo.Collection("trips") : TripsStub;


export default Trips;