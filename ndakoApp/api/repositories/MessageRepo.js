
module.exports = {

    create: async function (data) {
        try {
            return await Message.create(data).fetch();
        } catch (error) {
            throw error;
        }
    },

    findConversation: async function (user1Id, user2Id) {
        try {
            return await Message.find({
                or: [
                    { sender: user1Id, receiver: user2Id },
                    { sender: user2Id, receiver: user1Id }
                ]
            }).sort('createdAt ASC');
        } catch (error) {
            throw error;
        }
    },

    findLastMessages: async function (userId) {
        try {
            // This is a simplified version to get unique conversations with last message
            // In a real DB, you'd use a group by or distinct on
            const messages = await Message.find({
                or: [
                    { sender: userId },
                    { receiver: userId }
                ]
            }).sort('createdAt DESC');
            
            return messages;
        } catch (error) {
            throw error;
        }
    },

    markAsRead: async function (messageId) {
        try {
            return await Message.updateOne(messageId).set({ read_at: new Date().toISOString() });
        } catch (error) {
            throw error;
        }
    }

        ,
        update: async function (id, data) {
            try {
                return await Message.updateOne(id).set(data);
            } catch (error) {
                throw error;
            }
        },

        delete: async function (id) {
            try {
                return await Message.destroy({ id: id }).fetch();
            } catch (error) {
                throw error;
            }
        },

        countUnreadForUser: async function (userId) {
            try {
                return await Message.count({ receiver: userId, read_at: null });
            } catch (error) {
                throw error;
            }
        },

        // marque comme lu tous les messages envoyés par otherUser à user
        markConversationRead: async function (userId, otherUserId) {
            try {
                return await Message.update({ sender: otherUserId, receiver: userId, read_at: null }).set({ read_at: new Date().toISOString() }).fetch();
            } catch (error) {
                throw error;
            }
        },

        findConversationPaginated: async function (user1Id, user2Id, page = 1, limit = 50) {
            try {
                const whereClause = {
                    or: [
                        { sender: user1Id, receiver: user2Id },
                        { sender: user2Id, receiver: user1Id }
                    ]
                };

                const total = await Message.count(whereClause);
                const messages = await Message.find({ where: whereClause, skip: (page - 1) * limit, limit, sort: 'createdAt DESC' });

                return { messages, total, page, totalPages: Math.ceil(total / limit) };
            } catch (error) {
                throw error;
            }
        }

};
