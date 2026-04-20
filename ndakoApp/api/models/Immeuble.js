/**
 * Immeuble.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true,
      maxLength: 50,
      description: 'Pseudo de L\'immeuble'
    },

    address: {
      type: 'string',
      required: true,
      description: 'Adresse de L\'immeuble'
    },

    city: {
      type: 'string',
      required: true,
      maxLength: 100,
      description: 'Ville de L\'immeuble'
    },

    province: {
      type: 'string',
      required: true,
      maxLength: 100,
      description: 'Province de L\'immeuble'
    },

    country: {
      type: 'string',
      maxLength: 50,
      defaultsTo: 'RDC',
      description: 'Pays de L\'immeuble'
    },

    type: {
      type: 'string',
      isIn: ['residential', 'commercial', 'parking'],
      defaultsTo: 'residencial',
      description: 'Type de L\'immeuble'
    },

    description: {
      type: 'string',
      description: 'Description de L\'immeuble'
    },

    status: {
      type: 'string',
      isIn: ['active', 'inactive', 'deleted', 'blocked'],
      defaultsTo: 'active',
      description: 'Status de L\'immeuble'
    },

    // is_active: {
    //   type: 'boolean',
    //   defaultsTo: true
    // },

    image_urls: {
      type: 'json',
      defaultsTo: []
    },

    has_parking: {
      type: 'boolean',
      defaultsTo: false,
      description: 'Possédant un parking'
    },

    has_pool: {
      type: 'boolean',
      defaultsTo: false,
      description: 'Possédant une piscine'
    },

    has_garden: {
      type: 'boolean',
      defaultsTo: false,
      description: 'Possédant un jardin'
    },

    water_available: {
      type: 'boolean',
      defaultsTo: true,
      description: 'Disponibilité de l\'eau'
    },

    electricity_available: {
      type: 'boolean',
      defaultsTo: true,
      description: 'Disponibilité de l\'électricité'
    },

    // total_units: {
    //   type: 'number',
    //   defaultsTo: 1,
    //   description: 'Nombre total d\'unités/appartements'
    // },

    user: {
      model: 'user',
      required: true,
      description: 'Utilisateur Proprietaire (Bailleur)'
    },

    locations: {
      collection: 'location',
      via: 'immeuble'
    },

    appartements: {
      collection: 'appartement',
      via: 'immeuble'
    },

  },

};

