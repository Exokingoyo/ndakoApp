/**
 * Review.js
 *
 * @description :: A model representing a review from a tenant.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    rating: {
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      description: 'Note de 1 à 5'
    },

    comment: {
      type: 'string',
      required: true,
      maxLength: 500
    },

    user: {
      model: 'user',
      required: true,
      description: 'Le locataire qui laisse l\'avis'
    },

    immeuble: {
      model: 'immeuble',
      required: true,
      description: 'L\'immeuble concerné par l\'avis'
    },

  },

};
