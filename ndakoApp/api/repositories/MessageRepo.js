
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

};
