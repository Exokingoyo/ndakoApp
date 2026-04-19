
const MessageRepo = require("../repositories/MessageRepo");
const NotificationService = require("./NotificationService");

module.exports = {

    sendMessage: async function (senderId, receiverId, text) {
        try {
            const message = await MessageRepo.create({
                sender: senderId,
                receiver: receiverId,
                text: text
            });

            // Notify the receiver
            await NotificationService.notify(
                receiverId, 
                'Vous avez reçu un nouveau message.', 
                'info'
            );

            return message;
        } catch (error) {
            throw error;
        }
    },

    getConversation: async function (user1Id, user2Id) {
        try {
            return await MessageRepo.findConversation(user1Id, user2Id);
        } catch (error) {
            throw error;
        }
    },

    getUserChats: async function (userId) {
        try {
            // Simplified logic: returns all messages involving the user
            // In a real app, you'd logic to group by other participant
            return await MessageRepo.findLastMessages(userId);
        } catch (error) {
            throw error;
        }
    }

};
