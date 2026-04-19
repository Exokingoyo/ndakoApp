/**
 * Payement.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    date: {
      type: 'string',
      required: true,
      description: 'Date du payement'
    },

    amount: {
      type: 'number',
      required: true,
      description: 'Montant payé'
    },

    motif: {
      type: 'string',
      isIn: ['loyer', 'electricity', 'eau', 'connexion', 'autres'],
      required: true,
      description: 'Motif du payement'
    },

    paymentMethod: {
      type: 'string',
      isIn: ['cash', 'card', 'insurance', 'mobile_money'],
      required: true,
      description: 'Méthode de paiement utilisée'
    },

    status: {
      type: 'string',
      isIn: ['pending', 'completed', 'failed'],
      defaultsTo: 'pending',
      description: 'Statut du paiement'
    },

    user: {
      model: 'user',
      required: true,
      description: 'Utilisateur effectuant le payement'
    },

    location: {
      model: 'location',
      required: true,
      description: 'Le contrat que l\'utiliqateur paye'
    },


  },

};

