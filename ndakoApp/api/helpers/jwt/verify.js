const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

module.exports = {
  friendlyName: 'Verify JWT',
  description: 'Verify a JWT token',
  inputs: {
    token: {
      type: 'string',
      required: true
    }
  },
  fn: async function({ token }) {
    return jwt.verify(token, SECRET_KEY);
  }
};
