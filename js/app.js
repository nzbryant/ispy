App = Ember.Application.create();

App.Store = Ember.Object.extend({
  init: function() {
    this._super();
    this.set('idMap', {});
    this.set('hydratedObjects', []);
    this._createBucket();
  },
  
  all: function() {
    return this.get('hydratedObjects');
  },
  
  find: function(id) {
    return this._objectFor(id);
  },
  
  createRecord: function(properties) {
    var id = moment().valueOf().toString()
    properties.id = id;
    var object = this.find(id);
    object.setProperties(properties);
    return object;
  },
  
  _createBucket: function() {
    
  },
  
  _objectFor: function(id) {
    var idMap = this.get('idMap');
    
    return idMap[id];
  }
});

App.initializer({
  name: 'stores',
  initialize: function() {
    App.User.store = App.UserStore.create();
    App.Objective.store = App.ObjectiveStore.create();
  }
});

App.Router.map(function() {
  this.resource('objectives');
  this.resource('users');
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('objectives');
  }
});

App.Model = Ember.Object.extend({
  fields: [],
  
  forWire: function() {
    return this.getProperties(this.get('fields'));
  }
});

App.User = App.Model.extend({
  fields: ['id', 'name', 'email']
});

App.UserStore = App.Store.extend({
  name: 'users',
  model: App.User,
  deserialize: function(properties) {
    return {
      id: properties.id,
      name: properties.name,
      email: properties.email
    }
  }
});

App.Objective = App.Model.extend({
  fields: ['id', 'name', 'createdAt', 'description', 'location', 'coordinates', 'address']
});

App.ObjectiveStore = App.Store.extend({
  name: 'objectives',
  model: App.Objective,
  deserialize: function(properties) {
    return {
      name: properties.name,
      createdAt: Date.parse(properties.createdAt),
      description: properties.description,
      location: properties.location,
      coordinates: properties.coordinates,
      address: properties.address
    }
  }
});