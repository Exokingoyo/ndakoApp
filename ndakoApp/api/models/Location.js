/**
 * Location.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    loyer: {
      type: 'number',
      required: true,
      description: 'prix du loyer'
    },

    dateStart: {
      type: 'string',
      required: true,
      description: 'Date du debut de la location'
    },

    dateEnd: {
      type: 'string',
      description: 'Date de la fin de la location '
    },

    caution: {
      type: 'number',
      required: true,
      description: 'caution du loyer'
    },

    status: {
      type: 'string',
      isIn: ['active', 'inactive'],
      defaultsTo: 'active',
      description: 'Status du contrat'
    },

    user: {
      model: 'user',
      required: true,
      description: 'Utilisateur Locateur'
    },

    immeuble: {
      model: 'immeuble',
      required: true,
    },

    payements: {
      collection: 'payement',
      via: 'location',
    },

  },

};

