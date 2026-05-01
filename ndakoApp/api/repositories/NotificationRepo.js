
/**
 * NotificationRepo.js
 * 
 * @description :: Couche d'accès aux données pour les notifications
 * Gère toutes les requêtes BDD liées aux notifications
 */

module.exports = {

    /**
     * Crée une nouvelle notification
     * @param {Object} data - {user, content, type, sourceType, sourceId, actionUrl}
     * @returns {Object} La notification créée
     */
    create: async function (data) {
        try {
            return await Notification.create(data);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Récupère une notification par son ID
     * @param {String} id - ID de la notification
     * @returns {Object} La notification avec sa relation user
     */
    findById: async function (id) {
        try {
            return await Notification.findOne({ id }).populate('user');
        } catch (error) {
            throw error;
        }
    },

    /**
     * Récupère toutes les notifications d'un utilisateur, triées par date décroissante
     * @param {String} userId - ID de l'utilisateur
     * @returns {Array} Liste des notifications
     */
    findByUser: async function (userId) {
        try {
            return await Notification.find({ user: userId })
                .populate('user')
                .sort('createdAt DESC');
        } catch (error) {
            throw error;
        }
    },

    /**
     * Récupère les notifications récentes d'un utilisateur (dernières X heures)
     * Utile pour les alertes "nouveau"
     * @param {String} userId - ID de l'utilisateur
     * @param {Number} hours - Nombre d'heures (défaut: 24)
     * @returns {Array} Liste des notifications récentes
     */
    findRecent: async function (userId, hours = 24) {
        try {
            const sinceDate = new Date(Date.now() - hours * 60 * 60 * 1000);
            return await Notification.find({ user: userId, createdAt: { '>=': sinceDate } })
                .populate('user')
                .sort('createdAt DESC');
        } catch (error) {
            throw error;
        }
    },

    /**
     * Récupère les notifications d'un type spécifique pour un utilisateur
     * @param {String} userId - ID de l'utilisateur
     * @param {String} type - Type de notification (info, warning, success, danger)
     * @returns {Array} Notifications filtrées par type
     */
    findByType: async function (userId, type) {
        try {
            return await Notification.find({ user: userId, type })
                .populate('user')
                .sort('createdAt DESC');
        } catch (error) {
            throw error;
        }
    },

    /**
     * Récupère les notifications d'une source spécifique (incident, location, etc.)
     * @param {String} userId - ID de l'utilisateur
     * @param {String} sourceType - Type de source (incident, location, payment, etc.)
     * @returns {Array} Notifications de cette source
     */
    findBySource: async function (userId, sourceType) {
        try {
            return await Notification.find({ user: userId, sourceType })
                .populate('user')
                .sort('createdAt DESC');
        } catch (error) {
            throw error;
        }
    },

    /**
     * Marque une notification comme lue
     * @param {String} id - ID de la notification
     * @returns {Object} La notification mise à jour
     */
    markAsRead: async function (id) {
        try {
            return await Notification.updateOne(id).set({ is_read: true });
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
            return await Notification.update({ user: userId }).set({ is_read: true }).fetch();
        } catch (error) {
            throw error;
        }
    },

    /**
     * Compte les notifications non lues d'un utilisateur
     * @param {String} userId - ID de l'utilisateur
     * @returns {Number} Nombre de notifications non lues
     */
    countUnread: async function (userId) {
        try {
            return await Notification.count({ user: userId, is_read: false });
        } catch (error) {
            throw error;
        }
    },

    /**
     * Supprime une notification
     * @param {String} id - ID de la notification
     * @returns {Boolean} Succès ou non
     */
    deleteOne: async function (id) {
        try {
            await Notification.destroyOne({ id });
            return true;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Supprime toutes les notifications d'un utilisateur (nettoyage)
     * @param {String} userId - ID de l'utilisateur
     * @returns {Number} Nombre de notifications supprimées
     */
    deleteAllByUser: async function (userId) {
        try {
            return await Notification.destroy({ user: userId });
        } catch (error) {
            throw error;
        }
    },

    /**
     * Supprime les notifications anciennes (plus de X jours)
     * Utile pour nettoyer les notifications archivées
     * @param {Number} days - Nombre de jours (par défaut: 30)
     * @returns {Number} Nombre de notifications supprimées
     */
    deleteOldNotifications: async function (days = 30) {
        try {
            const beforeDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
            return await Notification.destroy({ 
                createdAt: { '<': beforeDate },
                is_read: true  // Supprimer seulement les notifications lues
            });
        } catch (error) {
            throw error;
        }
    },

    /**
     * Compte le total de notifications d'un utilisateur
     * @param {String} userId - ID de l'utilisateur
     * @returns {Number} Nombre total de notifications
     */
    countTotal: async function (userId) {
        try {
            return await Notification.count({ user: userId });
        } catch (error) {
            throw error;
        }
    }

};
