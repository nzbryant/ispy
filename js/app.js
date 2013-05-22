App = Ember.Application.create();

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