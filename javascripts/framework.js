function ModelConstructor(options) {
  var id_count = 0;
  function Model(attrs) { // create constructor function for model instance
    id_count++;
    this.attributes = attrs || {}; // object that will represent properties of model
    this.id = id_count;
    this.attributes.id = id_count;

    if (options && options.change && _.isFunction(options.change)) {
      this.__events.push(options.change); // add change function to internal array
    }
  }

  Model.prototype = { // add set and get methods to model's prototype
    __events: [], // internal array to store any callbacks passed in on change property of options object
    set: function(key, value) {
      this.attributes[key] = value;
      this.triggerChange();
    },
    get: function(key) {
      return this.attributes[key];
    },
    triggerChange: function() { // calls all the change events stored in internal array
      this.__events.forEach(function(event) {
        event();
      });
    },
    addCallback: function(callback) { // method to add change events after model is instantiated
      this.__events.push(callback);
    },
    remove: function(key) { // method to remove any properties on the model
      delete this.attributes[key];
      this.triggerChange();
    }
  };

  _.extend(Model.prototype, options); // extend model's prototype with passed in options object

  return Model;
}
