
const MessageRepo = require("../repositories/MessageRepo");
const NotificationService = require("./NotificationService");

module.exports = {

    sendMessage: async function (senderId, receiverId, text) {
        try {
            const message = await MessageRepo.create({ sender: senderId, receiver: receiverId, text: text });

            // Notify the receiver
            await NotificationService.notify(receiverId, 'Vous avez reçu un nouveau message.', 'info');

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

    // paginated conversation and mark messages received by user1 as read
    getConversationPaginated: async function (user1Id, user2Id, page = 1, limit = 50) {
        try {
            const result = await MessageRepo.findConversationPaginated(user1Id, user2Id, page, limit);
            // marquer comme lu les messages destinés à user1
            await MessageRepo.markConversationRead(user1Id, user2Id);
            return result;
        } catch (error) {
            throw error;
        }
    },

    // Récupère un résumé des conversations pour l'utilisateur (dernier message par interlocuteur + compteur non lus)
    getUserConversations: async function (userId) {
        try {
            const messages = await MessageRepo.findLastMessages(userId);
            // réduire en conversations uniques en prenant le premier message rencontré (trié desc)
            const map = new Map();
            for (const m of messages) {
                const other = (m.sender === userId) ? m.receiver : m.sender;
                if (!map.has(String(other))) {
                    map.set(String(other), { otherId: other, lastMessage: m });
                }
            }

            // compter les non lus pour l'utilisateur
            const totalUnread = await MessageRepo.countUnreadForUser(userId);

            const convos = Array.from(map.values()).map(c => ({ otherId: c.otherId, lastMessage: c.lastMessage }));
            return { conversations: convos, totalUnread };
        } catch (error) {
            throw error;
        }
    },

    markConversationRead: async function (userId, otherUserId) {
        try {
            return await MessageRepo.markConversationRead(userId, otherUserId);
        } catch (error) {
            throw error;
        }
    },

    editMessage: async function (messageId, userId, newText) {
        try {
            if (!newText || newText.trim().length === 0) throw ({ message: 'Texte vide.' });
            const m = await Message.findOne(messageId);
            if (!m) throw ({ message: 'Message introuvable.' });
            if (m.sender !== userId) throw ({ message: 'Permission refusée.' });
            return await MessageRepo.update(messageId, { text: newText });
        } catch (error) {
            throw error;
        }
    },

    deleteMessage: async function (messageId, userId) {
        try {
            const m = await Message.findOne(messageId);
            if (!m) throw ({ message: 'Message introuvable.' });
            // seul l'envoyeur peut supprimer
            if (m.sender !== userId) throw ({ message: 'Permission refusée.' });
            return await MessageRepo.delete(messageId);
        } catch (error) {
            throw error;
        }
    },

    getUnreadCount: async function (userId) {
        try {
            return await MessageRepo.countUnreadForUser(userId);
        } catch (error) {
            throw error;
        }
    }
};
