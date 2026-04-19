/**
 * UserProfile.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    avatar_url: {
      type: 'string',
      maxLength: 255
    },

    address: {
      type: 'string',
      required: true
    },

    city: {
      type: 'string',
      maxLength: 100
    },

    province: {
      type: 'string',
      maxLength: 100
    },

    country: {
      type: 'string',
      maxLength: 100,
      defaultsTo: 'RDC'
    },

    preferences: {
      type: 'json'
    },

    user: {
      model: 'user',
      required: true,
      unique: true
    },
  }

};

