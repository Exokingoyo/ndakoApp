
const MessageService = require("../services/MessageService");

module.exports = {

    send: async function (req, res) {
        try {
            const { receiverId, text } = req.body;
            const senderId = req.session.user.id;
            const message = await MessageService.sendMessage(senderId, receiverId, text);
            return res.ok(message);
        } catch (error) {
            return res.serverError(error);
        }
    },

    getConversation: async function (req, res) {
        try {
            const conversation = await MessageService.getConversation(req.session.user.id, req.params.receiverId);
            return res.ok(conversation);
        } catch (error) {
            return res.serverError(error);
        }
    },

    // paginated conversation
    getConversationPaginated: async function (req, res) {
        try {
            const userId = req.session.user.id;
            const otherId = req.params.receiverId || req.query.otherId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const result = await MessageService.getConversationPaginated(userId, otherId, page, limit);
            return res.ok(result);
        } catch (error) {
            return res.serverError(error);
        }
    },

    // liste des conversations (résumé)
    getConversations: async function (req, res) {
        try {
            const userId = req.session.user.id;
            const result = await MessageService.getUserConversations(userId);
            return res.ok(result);
        } catch (error) {
            return res.serverError(error);
        }
    },

    // mark conversation read
    markConversationRead: async function (req, res) {
        try {
            const userId = req.session.user.id;
            const otherId = req.body.otherId || req.params.otherId;
            const updated = await MessageService.markConversationRead(userId, otherId);
            return res.ok({ status: 'success', updated });
        } catch (error) { return res.serverError(error); }
    },

    edit: async function (req, res) {
        try {
            const userId = req.session.user.id;
            const { messageId, text } = req.body;
            const updated = await MessageService.editMessage(messageId, userId, text);
            return res.ok({ status: 'success', message: updated });
        } catch (error) { return res.serverError(error); }
    },

    remove: async function (req, res) {
        try {
            const userId = req.session.user.id;
            const id = req.params.id || req.body.messageId;
            const deleted = await MessageService.deleteMessage(id, userId);
            return res.ok({ status: 'success', deleted });
        } catch (error) { return res.serverError(error); }
    },

    unreadCount: async function (req, res) {
        try {
            const userId = req.session.user.id;
            const count = await MessageService.getUnreadCount(userId);
            return res.ok({ status: 'success', unread: count });
        } catch (error) { return res.serverError(error); }
    }

};
