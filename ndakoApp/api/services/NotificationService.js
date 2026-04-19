
const NotificationRepo = require("../repositories/NotificationRepo");

module.exports = {

    notify: async function (userId, content, type = 'info') {
        try {
            return await NotificationRepo.create({
                user: userId,
                content: content,
                type: type
            });
        } catch (error) {
            sails.log.error('Notification error:', error);
            throw error;
        }
    },

    getUnreadCount: async function (userId) {
        try {
            return await NotificationRepo.countUnread(userId);
        } catch (error) {
            throw error;
        }
    },

    getUserNotifications: async function (userId) {
        try {
            return await NotificationRepo.findByUser(userId);
        } catch (error) {
            throw error;
        }
    },

    markAsRead: async function (notificationId) {
        try {
            return await NotificationRepo.markAsRead(notificationId);
        } catch (error) {
            throw error;
        }
    }

};
