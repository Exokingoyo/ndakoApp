/**
 * Message.js
 *
 * @description :: Model for internal messaging between users.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    text: {
      type: 'string',
      required: true,
      maxLength: 2000
    },

    sender: {
      model: 'user',
      required: true
    },

    receiver: {
      model: 'user',
      required: true
    },

    read_at: {
      type: 'string',
      description: 'Timestamp de lecture'
    },

  },

};
