/**
 * JWT Configuration
 * (sails.config.jwt)
 */

module.exports.jwt = {
  // Clé secrète pour le développement (à changer en production)
  secret: 'wJX8YkvEGWsRq9L5KzUmN7aPdC3HfM2t',

  // Token expiration time
  expiresIn: '24h',

  // Token issuer
  issuer: 'NdakoApp',

  // Token audience
  audience: 'NdakoApp-users',

  // Token algorithm
  algorithm: 'HS256',

  // Options supplémentaires
  options: {
    // Temps de tolérance pour l'expiration (en secondes)
    clockTolerance: 30,
    
    // Temps maximum autorisé entre l'émission du token et sa première utilisation
    maxAge: '24h'
  }
};
