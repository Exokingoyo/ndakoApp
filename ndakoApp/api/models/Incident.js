/**
 * Incident.js
 *
 * @description :: A model representing a maintenance issue or incident.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    title: {
      type: 'string',
      required: true,
      maxLength: 100
    },

    description: {
      type: 'string',
      required: true,
      maxLength: 1000
    },

    category: {
      type: 'string',
      isIn: ['plumbing', 'electricity', 'structural', 'other'],
      defaultsTo: 'other'
    },

    status: {
      type: 'string',
      isIn: ['open', 'in_progress', 'resolved', 'closed'],
      defaultsTo: 'open'
    },

    user: {
      model: 'user',
      required: true,
      description: 'Celui qui signale l\'incident'
    },

    immeuble: {
      model: 'immeuble',
      required: true,
      description: 'Où l\'incident a eu lieu'
    },

    location: {
      model: 'location',
      description: 'Optionnel: Le contrat de location concerné'
    },

  },

};
