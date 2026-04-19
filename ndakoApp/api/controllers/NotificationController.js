
const NotificationService = require("../services/NotificationService");

module.exports = {

    getMyNotifications: async function (req, res) {
        try {
            const notifications = await NotificationService.getUserNotifications(req.session.user.id);
            const unreadCount = await NotificationService.getUnreadCount(req.session.user.id);
            return res.ok({ notifications, unreadCount });
        } catch (error) {
            return res.serverError(error);
        }
    },

    markAsRead: async function (req, res) {
        try {
            await NotificationService.markAsRead(req.params.id);
            return res.ok({ message: 'Notif marquée comme lue' });
        } catch (error) {
            return res.serverError(error);
        }
    }

};
