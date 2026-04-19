
module.exports = {

    create: async function (data) {
        try {
            return await Notification.create(data).fetch();
        } catch (error) {
            throw error;
        }
    },

    findByUser: async function (userId) {
        try {
            return await Notification.find({ user: userId }).sort('createdAt DESC');
        } catch (error) {
            throw error;
        }
    },

    markAsRead: async function (id) {
        try {
            return await Notification.updateOne(id).set({ is_read: true });
        } catch (error) {
            throw error;
        }
    },

    markAllAsRead: async function (userId) {
        try {
            return await Notification.update({ user: userId }).set({ is_read: true }).fetch();
        } catch (error) {
            throw error;
        }
    },

    countUnread: async function (userId) {
        try {
            return await Notification.count({ user: userId, is_read: false });
        } catch (error) {
            throw error;
        }
    }

};
