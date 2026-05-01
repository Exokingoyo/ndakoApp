/**
 * Incident.js
 *
 * @description :: A model representing a maintenance issue or incident.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const Appartement = require("./Appartement");

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

    appartement: {
      model: 'appartement',
      required: true,
      description: 'Où l\'incident a eu lieu'
    },

    location: {
      model: 'location',
      description: 'Optionnel: Le contrat de location concerné'
    },


    // Priorité métier pour trier/filtrer les incidents
    // low: peut attendre quelques jours
    // medium: traiter dans les 24-48h (par défaut)
    // high: urgent, demande une action immédiate
    priority: {
      type: 'string',
      isIn: ['low', 'medium', 'high'],
      defaultsTo: 'medium',
      description: 'Priorité de l\'incident'
    },

    // Liste de commentaires ou notes internes
    // Format: [{author: userId, text: "...", createdAt: date}, ...]
    // Permet la traçabilité complète du suivi
    comments: {
      type: 'json',
      defaultsTo: [],
      description: 'Commentaires et notes internes au sujet de l\'incident'
    }


  },

};
