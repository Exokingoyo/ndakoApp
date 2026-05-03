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
  'PUT /api/v1/immeuble': { controller: 'ImmeubleController', action: 'update' },
  'GET /api/v1/immeubles': { controller: 'ImmeubleController', action: 'getAllImmeubles' },
  'GET /api/v1/me/immeubles': { controller: 'ImmeubleController', action: 'getMyImmeubles' },


  // Location
  'POST /api/v1/locations': { controller: 'LocationController', action: 'create' },
  'PUT /api/v1/locations': { controller: 'LocationController', action: 'update' },
  'GET /api/v1/locations/me': { controller: 'LocationController', action: 'getMylocation' },
  'GET /api/v1/locations/:id': { controller: 'LocationController', action: 'getById' },
  'GET /api/v1/locations': { controller: 'LocationController', action: 'find' },
  'PUT /api/v1/locations/:id/status': { controller: 'LocationController', action: 'changeStatus' },

  // Appartements
  'POST /api/v1/appartement': { controller: 'AppartementController', action: 'create' },
  'PUT /api/v1/appartement': { controller: 'AppartementController', action: 'update' },
  'GET /api/v1/appartements': { controller: 'AppartementController', action: 'getAllAppartements' },
  'GET /api/v1/me/appartements': { controller: 'AppartementController', action: 'getMyAppartements' },
  'GET /api/v1/appartements/:immeubleId': { controller: 'AppartementController', action: 'getByImmeuble' },

  // Carnet

  // création d'un carnet unique
  'POST /api/v1/carnets': { controller: 'CarnetController', action: 'create' },
  // ajouter N carnets (mois) pour une location
  'POST /api/v1/carnets/add': { controller: 'CarnetController', action: 'addCarnet' },
  // ajouter un paiement à un carnet
  'POST /api/v1/carnets/:carnetId/payment': { controller: 'CarnetController', action: 'addPayment' },
  // marquer un carnet comme payé
  'POST /api/v1/carnets/:carnetId/mark-paid': { controller: 'CarnetController', action: 'markAsPaid' },
  // récupérer les carnets pour l'utilisateur connecté (paging)
  'GET /api/v1/carnets/me': { controller: 'CarnetController', action: 'getAll' },
  // récupérer les carnets par location
  'GET /api/v1/carnets/:locationId': { controller: 'CarnetController', action: 'getByLocation' },
  // carnets en retard
  'GET /api/v1/carnets/overdue': { controller: 'CarnetController', action: 'getOverdue' },
  // prochain carnet dû pour une location
  'GET /api/v1/carnets/:locationId/next': { controller: 'CarnetController', action: 'getNextDue' },


  // Rechercher
  'GET /api/v1/search': { controller: 'SearchController', action: 'search' },

  // Avis (Reviews)
  'POST /api/v1/review': { controller: 'ReviewController', action: 'create' },
  'GET /api/v1/review/:id': { controller: 'ReviewController', action: 'getByImmeuble' },

  // Incidents
  'POST /api/v1/incident': { controller: 'IncidentController', action: 'report' },
  'PATCH /api/v1/incident/:id/status': { controller: 'IncidentController', action: 'updateStatus' },
  'GET /api/v1/incident/my-incidents': { controller: 'IncidentController', action: 'getMyIncidents' },
  // 'PATCH /api/v1/incident/:id/assign': { controller: 'IncidentController', action: 'assign' },
  // 'POST /api/v1/incident/:id/comment': { controller: 'IncidentController', action: 'comment' },
  'PATCH /api/v1/incident/:id/escalate': { controller: 'IncidentController', action: 'escalate' },
  'GET /api/v1/incident/stats': { controller: 'IncidentController', action: 'stats' },
  'GET /api/v1/incident/:immeubleId': { controller: 'IncidentController', action: 'byImmeuble' },
  'GET /api/v1/incident/priority/high': { controller: 'IncidentController', action: 'highPriority' },
  'GET /api/v1/incident/active': { controller: 'IncidentController', action: 'active' },

  // Messagerie
  'POST /api/v1/message': { controller: 'MessageController', action: 'send' },
  'GET /api/v1/message/:receiverId': { controller: 'MessageController', action: 'getConversation' },
  // Messagerie - endpoints détaillés
  'GET /api/v1/message/:receiverId/paginated': { controller: 'MessageController', action: 'getConversationPaginated' },
  'GET /api/v1/messages': { controller: 'MessageController', action: 'getConversations' },
  'POST /api/v1/message/mark-read': { controller: 'MessageController', action: 'markConversationRead' },
  'PUT /api/v1/message/:id': { controller: 'MessageController', action: 'edit' },
  'DELETE /api/v1/message/:id': { controller: 'MessageController', action: 'remove' },
  'GET /api/v1/message/unread-count': { controller: 'MessageController', action: 'unreadCount' },

  // Notifications
  'GET /api/v1/notification': { controller: 'NotificationController', action: 'getMyNotifications' },
  'PUT /api/v1/notification/:id': { controller: 'NotificationController', action: 'markAsRead' },
  'PUT /api/v1/notification/mark-all': { controller: 'NotificationController', action: 'markAllAsRead' },
  'GET /api/v1/notification/unread-count': { controller: 'NotificationController', action: 'getUnreadCount' },
  'GET /api/v1/notification/total-count': { controller: 'NotificationController', action: 'getTotalCount' },
  'GET /api/v1/notification/recent': { controller: 'NotificationController', action: 'getRecentNotifications' },
  'GET /api/v1/notification/by-type/:type': { controller: 'NotificationController', action: 'getByType' },
  'GET /api/v1/notification/by-source/:sourceType': { controller: 'NotificationController', action: 'getBySource' },
  'GET /api/v1/notification/summary': { controller: 'NotificationController', action: 'getSummary' },
  'DELETE /api/v1/notification/:id': { controller: 'NotificationController', action: 'deleteNotification' },
  'DELETE /api/v1/notification/delete-all': { controller: 'NotificationController', action: 'deleteAllNotifications' },

  // Dashboard
  'GET /api/v1/dashboard': { controller: 'DashboardController', action: 'getStats' },


};
