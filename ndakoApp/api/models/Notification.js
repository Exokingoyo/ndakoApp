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

  },

};
