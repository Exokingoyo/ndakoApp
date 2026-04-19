const jwt = require('jsonwebtoken');

module.exports = {
  friendlyName: 'Sign JWT',
  description: 'Sign a new JWT token',
  inputs: {
    payload: {
      type: 'ref',
      required: true
    }
  },

  fn: async function({ payload }) {
    // Utiliser la même configuration que pour la vérification
    const secret = sails.config.jwt.secret;
    
    if (!secret) {
      console.error('JWT secret is not configured');
      throw new Error('JWT secret is not configured');
    }

    const options = {
      expiresIn: sails.config.jwt.expiresIn,
      issuer: sails.config.jwt.issuer,
      audience: sails.config.jwt.audience,
      algorithm: sails.config.jwt.algorithm
    };

    console.log('=== Génération du token JWT ===');
    console.log('Payload:', {
      id: payload.id,
      email: payload.email,
      role: payload.role
    });
    console.log('Options:', {
      expiresIn: options.expiresIn,
      issuer: options.issuer,
      audience: options.audience,
      algorithm: options.algorithm
    });
    console.log('Secret key length:', secret.length);
    console.log('Secret key first 4 chars:', secret.substring(0, 4));

    try {
      const token = jwt.sign(payload, secret, options);
      console.log('Token généré avec succès. Length:', token.length);
      return token;
    } catch (error) {
      console.error('Erreur lors de la génération du token:', {
        name: error.name,
        message: error.message
      });
      throw error;
    }
  }
};
