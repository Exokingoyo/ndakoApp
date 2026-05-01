/**
 * Location.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    priceMonthly: {
      type: 'number',
      required: true,
      description: 'prix du loyer mensuel'
    },

    priceDaily: {
      type: 'number',
      required: true,
      description: 'prix du loyer quotidien'
    },

    priceHourly: {
      type: 'number',
      required: true,
      description: 'prix du loyer horaire'
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

    locateur: {
      model: 'user',
      required: true,
      description: 'Utilisateur Locateur'
    },

    bailleur: {
      model: 'user',
      required: true,
      description: 'Utilisateur Bailleur'
    },

    // immeuble: {
    //   model: 'immeuble',
    //   required: true,
    // },

    typeLocation: {
      type: 'string',
      isIn: ['horaire', 'journalier', 'mensuel'],
      required: true
    },

    payements: {
      collection: 'payement',
      via: 'location',
    },

    appartement: {
      model: 'appartement',
      description: 'L\'unité spécifique louée',
      required: true,
    },

  },

};

