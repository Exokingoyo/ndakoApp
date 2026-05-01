/**
 * Carnet.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    dateStart: {
      type: 'string',
      required: true,
      description: 'date du debut du carnet'
    },

    dateEnd: {
      type: 'string',
      required: true,
      description: 'date du fin du carnet'
    },

    montant: {
      type: 'number',
      defaultsTo: 0,
      description: 'Montant du payé'
    },

    loyer: {
      type: 'number',
      required: true,
      description: 'Montant du loyer '
    },

    datePayement: {
      type: 'string',
      allowNull: true,
      description: 'date du payement du loyer'
    },

    dateECheance: {
      type: 'string',
      required: true,
      description: 'Date d\'echeance de payement pour le rappel en cas de depassement de cette date le service cron effectue un rapel de non payement et change le statut en non payé '
    },

    reste: {
      type: 'number',
      description: 'Reste a payé pour totaliser la somme total du loyer '
    },

    status: {
      type: 'string',
      isIn: ['unpaid', 'partial', 'paid', 'late'],
      defaultsTo: 'unpaid',
      description: 'Status du payement '
    },

    proprietaire: {
      model: 'user',
      required: true,
      description: 'Le bailleur '
    },

    locateur: {
      model: 'user',
      required: true,
      description: 'Le locateur '
    },

    location: {
      model: 'location',
      required: true,
      description: 'Le contrat qui conserne le carnet'
    },

  },

};

