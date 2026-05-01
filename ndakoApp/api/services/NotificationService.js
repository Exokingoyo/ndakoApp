
const NotificationRepo = require("../repositories/NotificationRepo");

/**
 * NotificationService.js
 * 
 * @description :: Couche métier des notifications
 * Gère la logique applicative: création, gestion, nettoyage des notifications
 */

module.exports = {

    /**
     * Crée et envoie une notification à un utilisateur
     * Fonction centrale: utilisée par tous les modules (Incident, Location, Payment, etc.)
     * @param {String} userId - ID du destinataire
     * @param {String} content - Texte de la notification
     * @param {String} type - Type (info, warning, success, danger) - défaut: 'info'
     * @param {String} sourceType - Type de source (incident, location, payment, etc.) - optionnel
     * @param {String} sourceId - ID de la ressource source - optionnel
     * @param {String} actionUrl - URL pour l'action (ex: /incident/123) - optionnel
     * @returns {Object} La notification créée
     */
    notify: async function (userId, content, type = 'info', sourceType = null, sourceId = null, actionUrl = null) {
        try {
            return await NotificationRepo.create({
                user: userId,
                content: content,
                type: type,
                sourceType: sourceType,
                sourceId: sourceId,
                actionUrl: actionUrl
            });
        } catch (error) {
            sails.log.error('Notification error:', error);
            throw error;
        }
    },

    /**
     * Envoie des notifications en masse à plusieurs utilisateurs
     * Utile pour les alertes système ou les notifications d'un immeuble
     * @param {Array} userIds - Liste des IDs des utilisateurs
     * @param {String} content - Texte de la notification
     * @param {String} type - Type de notification
     * @param {Object} metadata - {sourceType, sourceId, actionUrl}
     * @returns {Array} Les notifications créées
     */
    notifyMultiple: async function (userIds, content, type = 'info', metadata = {}) {
        try {
            const notifications = [];
            for (const userId of userIds) {
                const notif = await NotificationRepo.create({
                    user: userId,
                    content: content,
                    type: type,
                    sourceType: metadata.sourceType || null,
                    sourceId: metadata.sourceId || null,
                    actionUrl: metadata.actionUrl || null
                });
                notifications.push(notif);
            }
            return notifications;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Retourne le nombre de notifications non lues d'un utilisateur
     * @param {String} userId - ID de l'utilisateur
     * @returns {Number} Nombre de notifications non lues
     */
    getUnreadCount: async function (userId) {
        try {
            return await NotificationRepo.countUnread(userId);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Retourne le nombre total de notifications d'un utilisateur
     * @param {String} userId - ID de l'utilisateur
     * @returns {Number} Nombre total de notifications
     */
    getTotalCount: async function (userId) {
        try {
            return await NotificationRepo.countTotal(userId);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Récupère toutes les notifications d'un utilisateur
     * @param {String} userId - ID de l'utilisateur
     * @returns {Array} Liste de toutes les notifications
     */
    getUserNotifications: async function (userId) {
        try {
            return await NotificationRepo.findByUser(userId);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Récupère les notifications récentes d'un utilisateur
     * Utile pour les notifications "nouveau"
     * @param {String} userId - ID de l'utilisateur
     * @param {Number} hours - Nombre d'heures à regarder en arrière (défaut: 24)
     * @returns {Array} Notifications récentes
     */
    getRecentNotifications: async function (userId, hours = 24) {
        try {
            return await NotificationRepo.findRecent(userId, hours);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Récupère les notifications par type (pour filtrer le UI)
     * @param {String} userId - ID de l'utilisateur
     * @param {String} type - Type de notification (info, warning, success, danger)
     * @returns {Array} Notifications du type demandé
     */
    getNotificationsByType: async function (userId, type) {
        try {
            return await NotificationRepo.findByType(userId, type);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Récupère les notifications d'une source spécifique
     * Ex: toutes les notifications liées aux incidents
     * @param {String} userId - ID de l'utilisateur
     * @param {String} sourceType - Type de source (incident, location, payment, etc.)
     * @returns {Array} Notifications de cette source
     */
    getNotificationsBySource: async function (userId, sourceType) {
        try {
            return await NotificationRepo.findBySource(userId, sourceType);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Marque une notification comme lue
     * @param {String} notificationId - ID de la notification
     * @returns {Object} La notification mise à jour
     */
    markAsRead: async function (notificationId) {
        try {
            return await NotificationRepo.markAsRead(notificationId);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Marque toutes les notifications d'un utilisateur comme lues
     * Utile pour le bouton "Marquer tout comme lu"
     * @param {String} userId - ID de l'utilisateur
     * @returns {Array} Les notifications mises à jour
     */
    markAllAsRead: async function (userId) {
        try {
            return await NotificationRepo.markAllAsRead(userId);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Supprime une notification spécifique
     * @param {String} notificationId - ID de la notification
     * @returns {Boolean} Succès ou non
     */
    deleteNotification: async function (notificationId) {
        try {
            return await NotificationRepo.deleteOne(notificationId);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Supprime toutes les notifications d'un utilisateur
     * Utile lors de la suppression du compte
     * @param {String} userId - ID de l'utilisateur
     * @returns {Number} Nombre de notifications supprimées
     */
    deleteAllUserNotifications: async function (userId) {
        try {
            return await NotificationRepo.deleteAllByUser(userId);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Supprime les notifications anciennes et lues
     * Tâche de maintenance pour nettoyer la BDD
     * Peut être appelée en cron job
     * @param {Number} days - Nombre de jours d'ancienneté (défaut: 30)
     * @returns {Number} Nombre de notifications supprimées
     */
    cleanupOldNotifications: async function (days = 30) {
        try {
            const count = await NotificationRepo.deleteOldNotifications(days);
            sails.log.info(`Cleaned up ${count} old notifications`);
            return count;
        } catch (error) {
            sails.log.error('Error cleaning old notifications:', error);
            throw error;
        }
    },

    /**
     * Obtient un résumé des notifications d'un utilisateur
     * Utile pour le dashboard
     * @param {String} userId - ID de l'utilisateur
     * @returns {Object} {total, unread, byType: {...}, bySource: {...}}
     */
    getNotificationSummary: async function (userId) {
        try {
            const notifications = await NotificationRepo.findByUser(userId);
            const total = notifications.length;
            const unread = await NotificationRepo.countUnread(userId);

            // Grouper par type
            const byType = {};
            notifications.forEach(notif => {
                if (!byType[notif.type]) byType[notif.type] = 0;
                byType[notif.type]++;
            });

            // Grouper par source
            const bySource = {};
            notifications.forEach(notif => {
                if (notif.sourceType) {
                    if (!bySource[notif.sourceType]) bySource[notif.sourceType] = 0;
                    bySource[notif.sourceType]++;
                }
            });

            return {
                total,
                unread,
                byType,
                bySource,
                recent: notifications.slice(0, 10) // 10 dernières
            };
        } catch (error) {
            throw error;
        }
    }

};
