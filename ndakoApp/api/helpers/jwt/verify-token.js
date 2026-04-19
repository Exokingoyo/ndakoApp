const jwt = require('jsonwebtoken');

module.exports = {
  friendlyName: 'Verify JWT token',

  description: 'Verify a JWT token and return the decoded payload.',

  inputs: {
    token: {
      type: 'string',
      required: true,
      description: 'The JWT token to verify'
    }
  },

  exits: {
    success: {
      description: 'Token was verified successfully.'
    },
    invalid: {
      description: 'Token is invalid or has expired.'
    }
  },

  fn: async function(inputs) {
    try {
      // Get the JWT secret from config
      const secret = sails.config.jwt.secret;
      
      if (!secret) {
        throw new Error('JWT secret is not configured');
      }

      // Log pour debug
      console.log('Vérification du token avec la clé secrète:', {
        tokenLength: inputs.token.length,
        secretLength: secret.length
      });

      // Options de vérification
      const options = {
        algorithms: [sails.config.jwt.algorithm || 'HS256'],
        issuer: sails.config.jwt.issuer,
        audience: sails.config.jwt.audience
      };

      // Verify the token
      const decoded = jwt.verify(inputs.token, secret, options);
      
      console.log('Token décodé avec succès:', {
        userId: decoded.id,
        email: decoded.email,
        role: decoded.role,
        exp: new Date(decoded.exp * 1000).toISOString()
      });

      return decoded;
    } catch (error) {
      console.error('Erreur de vérification du token:', {
        name: error.name,
        message: error.message,
        expiredAt: error.expiredAt ? new Date(error.expiredAt).toISOString() : undefined
      });

      // Amélioration de la gestion des erreurs
      switch (error.name) {
        case 'TokenExpiredError':
          throw new Error(`Token expired at ${new Date(error.expiredAt).toISOString()}`);
        case 'JsonWebTokenError':
          throw new Error('Invalid token signature');
        case 'NotBeforeError':
          throw new Error('Token not yet active');
        default:
          throw new Error(error.message);
      }
    }
  }
};
