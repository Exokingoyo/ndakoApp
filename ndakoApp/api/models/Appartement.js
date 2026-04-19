/**
 * Appartement.js
 *
 * @description :: A model definition represents a apartment unit inside a building (Immeuble).
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true,
      maxLength: 50,
      description: 'Nom ou numéro de l\'appartement (ex: Porte 4, A1)'
    },

    etage: {
      type: 'number',
      defaultsTo: 0,
      description: 'Étage de l\'appartement'
    },

    loyer: {
      type: 'number',
      required: true,
      description: 'Prix du loyer mensuel'
    },

    surface_area: {
      type: 'number',
      description: 'Surface en mètres carrés'
    },

    chambre: {
      type: 'number',
      defaultsTo: 1,
      description: 'Nombre de chambres'
    },

    bathrooms: {
      type: 'number',
      defaultsTo: 1,
      description: 'Nombre de salles de bain'
    },

    is_vacant: {
      type: 'boolean',
      defaultsTo: true,
      description: 'Si l\'appartement est actuellement libre'
    },

    description: {
      type: 'string',
      description: 'Description spécifique de l\'unité'
    },

    immeuble: {
      model: 'immeuble',
      required: true,
      description: 'L\'immeuble auquel appartient cet appartement'
    },

    locations: {
      collection: 'location',
      via: 'appartement'
    },

  },

};
