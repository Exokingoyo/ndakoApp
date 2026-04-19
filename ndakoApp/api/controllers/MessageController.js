
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
    }

};
