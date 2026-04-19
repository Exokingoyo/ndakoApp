
const IncidentService = require("../services/IncidentService");
const IncidentRepo = require("../repositories/IncidentRepo");

module.exports = {

    report: async function (req, res) {
        try {
            const userId = req.session.user.id;
            const incident = await IncidentService.reportIncident({
                ...req.body,
                user: userId
            });
            return res.ok(incident);
        } catch (error) {
            return res.serverError(error);
        }
    },

    updateStatus: async function (req, res) {
        try {
            const { status } = req.body;
            const updated = await IncidentService.updateStatus(req.params.id, status, req.session.user.id);
            return res.ok(updated);
        } catch (error) {
            return res.serverError(error);
        }
    },

    getMyIncidents: async function (req, res) {
        try {
            const incidents = await IncidentRepo.findByUser(req.session.user.id);
            return res.ok(incidents);
        } catch (error) {
            return res.serverError(error);
        }
    }

};
