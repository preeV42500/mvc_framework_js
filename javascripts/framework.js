function ModelConstructor(options) {
  var id_count = 0;
  function Model() { // create constructor function for model instance
    id_count++;
    this.attributes = {}; // object that will represent properties of model
    this.id = id_count;
    this.attributes.id = id_count;
  }

  Model.prototype = { // add set and get methods to model's prototype
    set: function(key, value) {
      this.attributes[key] = value;
    },
    get: function(key) {
      return this.attributes[key];
    }
  };

  _.extend(Model.prototype, options); // extend model's prototype with passed in options object

  return Model;
}
