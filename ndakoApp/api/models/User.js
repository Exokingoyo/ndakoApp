/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */


module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true,
      maxLength: 30,
      description: 'Nom de l\'utilisateur '
    },

    first_name: {
      type: 'string',
      maxLength: 30,
      description: 'Prenom de l\'utilisateur '
    },

    last_name: {
      type: 'string',
      maxLength: 30,
      required: true,
      description: 'Postnom de l\'utilisateur '
    },

    birthday: {
      type: 'string',
      required: true,
      description: 'Date de naissance l\'utilisateur'
    },

    nationality: {
      type: 'string',
      required: true,
      maxLength: 40,
      description: 'Nationalité de l\'utilisateur'
    },

    role: {
      type: 'string',
      isIn: ['proprietaire', 'gerant', 'locateur'],
      defaultsTo: 'locateur',
      description: 'Role de l\'utilisateur'
    },

    phone: {
      type: 'string',
      required: true,
      maxLength: 20,
      description: 'Numero du telephone de l\'utilisateur'
    },

    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      description: 'Email de l\'utilisateur'
    },

    password: {
      type: 'string',
      required: true,
      protect: true,
      description: 'Mot de passe de l\'utilisateur'
    },

    emailVerified: {
      type: 'boolean',
      defaultsTo: false
    },

    last_login: {
      type: 'ref',
      columnType: 'timestamp'
    },

    status: {
      type: 'string',
      isIn: ['active', 'inactive', 'deleted', 'blocked'],
      defaultsTo: 'active',
      description: 'Status du compte de l\'utilisateur'
    },

    is_active: {
      type: 'boolean',
      defaultsTo: true
    },

    profile: {
      collection: 'userprofile',
      via: 'user'
    },

    Immeubles: {
      collection: 'immeuble',
      via: 'user',
      description: 'Si Utilisateur Bailleur'
    },

    locations: {
      collection: 'location',
      via: 'user',
      description: 'Si Utilisateur Locateur'
    },

    payements: {
      collection: 'payement',
      via: 'user'
    },

    reviews: {
      collection: 'review',
      via: 'user'
    },

    incidents: {
      collection: 'incident',
      via: 'user'
    },

    notifications: {
      collection: 'notification',
      via: 'user'
    },

    sent_messages: {
      collection: 'message',
      via: 'sender'
    },

    received_messages: {
      collection: 'message',
      via: 'receiver'
    },



  },

};

