
const DashboardService = require("../services/DashboardService");

module.exports = {

    getStats: async function (req, res) {
        try {
            const stats = await DashboardService.getOwnerStats(req.session.user.id);
            return res.ok(stats);
        } catch (error) {
            return res.serverError(error);
        }
    }

};
