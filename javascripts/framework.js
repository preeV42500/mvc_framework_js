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

function CollectionConstructor(options) {
  function Collection(modelConstructor) {
    this.model = modelConstructor;
    this.models = [];
  }

  Collection.prototype = {
    reset: function() {
      this.models = [];
    },
    add: function(model) {
      var oldModel = _(this.models).findWhere({ id : model.id });
      var newModel;

      if (oldModel) { return oldModel; } // if an old model with the same id exists, return it

      newModel = new this.model(model); // create a new model using the model constructor
      this.models.push(newModel); // add the model to the collection of models

      return newModel;
    },
    remove: function(arg) {
      arg = _.isObject(arg) ? arg.id : arg; // if the argument is an object, retrieve its id

      var model = _(this.models).findWhere({ id : arg }); // find the model from the collection by id

      if (!model) { return; }

      this.models = this.models.filter(function(existing_m) { // reset the models array to an array without the model to remove
        return existing_m.id !== model.id;
      });
    },
    set: function(models) {
      this.reset(); // reset collection
      models.forEach(this.add.bind(this)); // instantiate models from the objects and add to the collection
    },
    get: function(id) {
      return _(this.models).findWhere({ id: id }); // find a model in the collection by id
    }
  };

  _.extend(Collection.prototype, options);

  return Collection;
}

function ViewConstructor(options) {
  function View(model) {
    this.model = model;
    this.model.view = this; // pointer on model pointing back to view object
    this.$el = $("<" + this.tag_name + "/>", this.attributes); // create parent html element for view
    this.render();
  }

  View.prototype = {
    tag_name: "div", // represents parent html element to use for the view
    attributes: {},
    template: function() { },
    render: function() {
      this.$el.html(this.template(this.model.attributes)); // render attributes property of model that's been passed in
    },
    remove: function() {
      this.$el.remove();
    }
  };

  _.extend(View.prototype, options);

  return View;
}
