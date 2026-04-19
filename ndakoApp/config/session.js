/**
 * Session Configuration
 * (sails.config.session)
 *
 * Use the settings below to configure session integration in your app.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For all available options, see:
 * https://sailsjs.com/config/session
 */

module.exports.session = {

  /***************************************************************************
  *                                                                          *
  * Session secret is automatically generated when your new app is created   *
  * Replace at your own risk in production-- you will invalidate the cookies *
  * of your users, forcing them to log in again.                             *
  *                                                                          *
  ***************************************************************************/
  secret: '680f27611ed255726b1d3768dc864832',


  /***************************************************************************
  *                                                                          *
  * Customize when built-in session support will be skipped.                 *
  *                                                                          *
  * (Useful for performance tuning; particularly to avoid wasting cycles on  *
  * session management when responding to simple requests for static assets, *
  * like images or stylesheets.)                                             *
  *                                                                          *
  * https://sailsjs.com/config/session                                       *
  *                                                                          *
  ***************************************************************************/
  // isSessionDisabled: function (req){
  //   return !!req.path.match(req._sails.LOOKS_LIKE_ASSET_RX);
  // },

  // Durée de vie de la session très longue (7 jours)
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 jours en millisecondes
  },

  // Désactiver la réinitialisation de la session
  rolling: true,

  // Garder la session active même sans activité
  resave: true,
  saveUninitialized: true,

  // Optionnel : configuration Redis si vous l'utilisez
  adapter: '@sailshq/connect-redis',
  url: process.env.REDIS_URL || 'redis://localhost:6379'

};
