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
      columnType: 'decimal(10,2)',
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
      isIn: ['pending', 'completed', 'failed', 'refunded'],
      defaultsTo: 'pending',
      description: 'Statut du paiement'
    },

    user: {
      model: 'user',
      required: true,
      description: 'Utilisateur effectuant le payement'
    },

    carnet: {
      model: 'carnet',
      description: 'Le carnet auquel le payement est rattaché'
    },

    location: {
      model: 'location',
      required: true,
      description: 'Le contrat que l\'utilisateur paye'
    },

    reference: {
      type: 'string',
      unique: true,
      allowNull: true,
      description: 'Numéro de reçu/confirmation unique'
    },

    description: {
      type: 'string',
      columnType: 'text',
      allowNull: true,
      description: 'Notes ou détails supplémentaires du paiement'
    },

    refundedAmount: {
      type: 'number',
      columnType: 'decimal(10,2)',
      defaultsTo: 0,
      description: 'Montant remboursé (si applicable)'
    },

    refundReason: {
      type: 'string',
      allowNull: true,
      description: 'Raison du remboursement'
    },

    refundDate: {
      type: 'string',
      allowNull: true,
      description: 'Date du remboursement'
    },

  },

};

