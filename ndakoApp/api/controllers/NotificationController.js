
const NotificationService = require("../services/NotificationService");

/**
 * NotificationController.js
 * 
 * @description :: Contrôleur HTTP pour les notifications
 * Expose les endpoints REST pour gérer les notifications
 */

module.exports = {

    /**
     * GET /api/v1/notification
     * Récupère toutes les notifications de l'utilisateur connecté avec le compte non lus
     * Retourne: {notifications: [...], unreadCount: X}
     */
    getMyNotifications: async function (req, res) {
        try {
            const notifications = await NotificationService.getUserNotifications(req.session.user.id);
            const unreadCount = await NotificationService.getUnreadCount(req.session.user.id);
            return res.ok({ notifications, unreadCount });
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * PUT /api/v1/notification/:id
     * Marque une notification comme lue
     * Paramètres: id (URL)
     */
    markAsRead: async function (req, res) {
        try {
            await NotificationService.markAsRead(req.params.id);
            return res.ok({ message: 'Notif marquée comme lue' });
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * PUT /api/v1/notification/mark-all
     * Marque toutes les notifications comme lues
     * Utile pour le bouton "Marquer tout comme lu"
     */
    markAllAsRead: async function (req, res) {
        try {
            const updated = await NotificationService.markAllAsRead(req.session.user.id);
            return res.ok({ 
                message: 'Toutes les notifs marquées comme lues',
                count: updated.length 
            });
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * GET /api/v1/notification/unread-count
     * Retourne le nombre de notifications non lues
     * Utile pour afficher un badge sur l'icône de notification
     */
    getUnreadCount: async function (req, res) {
        try {
            const count = await NotificationService.getUnreadCount(req.session.user.id);
            return res.ok({ unreadCount: count });
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * GET /api/v1/notification/total-count
     * Retourne le nombre total de notifications (lues + non lues)
     */
    getTotalCount: async function (req, res) {
        try {
            const count = await NotificationService.getTotalCount(req.session.user.id);
            return res.ok({ totalCount: count });
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * GET /api/v1/notification/recent
     * Retourne les notifications récentes (dernières 24h par défaut)
     * Query param: hours (optionnel) - ex: /notification/recent?hours=48
     */
    getRecentNotifications: async function (req, res) {
        try {
            const hours = req.query.hours || 24;
            const notifications = await NotificationService.getRecentNotifications(req.session.user.id, hours);
            return res.ok({ notifications, hours });
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * GET /api/v1/notification/by-type/:type
     * Retourne les notifications filtrées par type
     * Types: info, warning, success, danger
     */
    getByType: async function (req, res) {
        try {
            const { type } = req.params;
            const validTypes = ['info', 'warning', 'success', 'danger'];
            
            if (!validTypes.includes(type)) {
                return res.badRequest({ message: 'Type invalide' });
            }

            const notifications = await NotificationService.getNotificationsByType(req.session.user.id, type);
            return res.ok({ notifications, type });
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * GET /api/v1/notification/by-source/:sourceType
     * Retourne les notifications filtrées par source
     * Sources: incident, location, payment, review, message, system
     */
    getBySource: async function (req, res) {
        try {
            const { sourceType } = req.params;
            const validSources = ['incident', 'location', 'payment', 'review', 'message', 'system'];
            
            if (!validSources.includes(sourceType)) {
                return res.badRequest({ message: 'Source invalide' });
            }

            const notifications = await NotificationService.getNotificationsBySource(req.session.user.id, sourceType);
            return res.ok({ notifications, sourceType });
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * DELETE /api/v1/notification/:id
     * Supprime une notification spécifique
     */
    deleteNotification: async function (req, res) {
        try {
            await NotificationService.deleteNotification(req.params.id);
            return res.ok({ message: 'Notification supprimée' });
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * DELETE /api/v1/notification/delete-all
     * Supprime toutes les notifications de l'utilisateur
     * Attention: opération irréversible!
     */
    deleteAllNotifications: async function (req, res) {
        try {
            const count = await NotificationService.deleteAllUserNotifications(req.session.user.id);
            return res.ok({ 
                message: 'Toutes les notifications supprimées',
                deletedCount: count 
            });
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * GET /api/v1/notification/summary
     * Retourne un résumé des notifications pour le dashboard
     * Inclut: total, unread, groupé par type et source
     */
    getSummary: async function (req, res) {
        try {
            const summary = await NotificationService.getNotificationSummary(req.session.user.id);
            return res.ok(summary);
        } catch (error) {
            return res.serverError(error);
        }
    }

};
