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