App = Ember.Application.create();

App.SIMPERIUM_APP_ID = 'fall-diamonds-154';
App.SIMPERIUM_TOKEN = 'dbf08dc43fb8482ea1101e8f086f29ec';

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
  
  commit: function(id) {
    var object = this.find(id);
    if (!this.get('hydratedObjects').contains(object)) {
      this.get('hydratedObjects').addObject(object);
    }
    this.get('bucket').update(id);
  },
  
  createRecord: function(properties) {
    var id = moment().valueOf().toString()
    properties.id = id;
    var object = this.find(id);
    object.setProperties(properties);
    return object;
  },
  
  _createBucket: function() {
    var bucket = App.simperium.bucket(this.get('name')),
      self = this;
      
    bucket.on('notify', function(id, properties) {
      self._hydrateObject(id, properties);
    });
    
    bucket.on('local', function(id) {
      var object = self.find(id);
      return object.forWire();
    });
    
    bucket.start();
    
    this.set('bucket', bucket);
  },
  
  _objectFor: function(id) {
    var idMap = this.get('idMap');
    
    return idMap[id];
  },
  
  _hydrateObject: function(id, properties) {
    var object = this._objectFor(id);
    object.setProperties(this.deserialize(properties));
    this.get('hydratedObjects').addObject(object);
  },
  
  deserialize: function(object, properties) {
    return {};
  }
});

App.initializer({
  name: 'simperium',
  initialize: function() {
    App.simperium = new Simperium(App.SIMPERIUM_APP_ID, {
      token: App.SIMPERIUM_TOKEN
    });
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