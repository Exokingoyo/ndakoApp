/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/
//  Authentification
  'POST /api/v1/auth': { controller: 'AuthController', action: 'signup' },
  'POST  /api/v1/auth/login': { controller: 'AuthController', action: 'login' },
  'POST  /api/v1/auth/change-password': { controller: 'AuthController', action: 'changePassword' },
  'POST /api/v1/auth/logout': { controller: 'AuthController', action: 'logout' },

  // Immeuble 
  'POST /api/v1/immeuble': { controller: 'ImmeubleController', action: 'create' },
  'PUT /api/v1/immeuble/:id': { controller: 'ImmeubleController', action: 'update' },
  'GET /api/v1/immeuble': { controller: 'ImmeubleController', action: 'getMyImmeubles' },


  // Location
  'POST /api/v1/location': { controller: 'LocationController', action: 'create' },
  'PUT /api/v1/location': { controller: 'LocationController', action: 'update' },
  'GET /api/v1/location': { controller: 'LocationController', action: 'getMylocation' },


  // Rechercher
  'GET /api/v1/search': { controller: 'SearchController', action: 'search' },

  // Avis (Reviews)
  'POST /api/v1/review': { controller: 'ReviewController', action: 'create' },
  'GET /api/v1/review/:id': { controller: 'ReviewController', action: 'getByImmeuble' },

  // Incidents
  'POST /api/v1/incident': { controller: 'IncidentController', action: 'report' },
  'PUT /api/v1/incident/:id': { controller: 'IncidentController', action: 'updateStatus' },
  'GET /api/v1/incident': { controller: 'IncidentController', action: 'getMyIncidents' },

  // Messagerie
  'POST /api/v1/message': { controller: 'MessageController', action: 'send' },
  'GET /api/v1/message/:receiverId': { controller: 'MessageController', action: 'getConversation' },

  // Notifications
  'GET /api/v1/notification': { controller: 'NotificationController', action: 'getMyNotifications' },
  'PUT /api/v1/notification/:id': { controller: 'NotificationController', action: 'markAsRead' },

  // Dashboard
  'GET /api/v1/dashboard': { controller: 'DashboardController', action: 'getStats' },


};
