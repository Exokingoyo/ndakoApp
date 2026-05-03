/**
 * Notification.js
 *
 * @description :: Model for tracking system/user notifications.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    content: {
      type: 'string',
      required: true,
      maxLength: 500
    },

    type: {
      type: 'string',
      isIn: ['info', 'warning', 'success', 'danger'],
      defaultsTo: 'info'
    },

    is_read: {
      type: 'boolean',
      defaultsTo: false
    },

    user: {
      model: 'user',
      required: true,
      description: 'Celui qui reçoit la notification'
    },

    // Métadonnées pour tracer la source de la notification
    // Permet de relier une notification à son contexte métier (incident, location, etc.)
    sourceType: {
      type: 'string',
      isIn: ['incident', 'location', 'payment', 'review', 'message', 'system', 'carnet'],
      description: 'Type de source: incident, location, paiement, etc.'
    },

    // ID de la ressource qui a générée la notification
    // Ex: ID de l\'incident, de la location, du paiement
    sourceId: {
      type: 'string',
      description: 'ID de la ressource concernée (incident ID, location ID, etc.)'
    },

    // URL d\'action pour rediriger l\'utilisateur vers la ressource
    // Ex: /incident/123, /location/456
    actionUrl: {
      type: 'string',
      description: 'Lien pour accéder à la ressource depuis la notification'
    }

  },

};
