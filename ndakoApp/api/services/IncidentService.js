
const IncidentRepo = require("../repositories/IncidentRepo");
const NotificationService = require("./NotificationService");
const ImmeubleRepo = require("../repositories/ImmeubleRepo");

module.exports = {

    reportIncident: async function (incidentData) {
        try {
            const incident = await IncidentRepo.create(incidentData);
            
            // Get building owner to notify them
            const building = await ImmeubleRepo.findById(incidentData.immeuble);
            if (building && building.user) {
                await NotificationService.notify(
                    building.user.id,
                    `Nouvel incident signalé : ${incident.title} à ${building.name}`,
                    'warning'
                );
            }

            return incident;
        } catch (error) {
            throw error;
        }
    },

    updateStatus: async function (incidentId, status, userId) {
        try {
            const incident = await IncidentRepo.findById(incidentId);
            if (!incident) throw { status: 404, message: 'Incident non trouvé' };

            const updatedIncident = await IncidentRepo.update(incidentId, { status });

            // Notify the tenant who reported it
            await NotificationService.notify(
                incident.user.id,
                `Le statut de votre incident "${incident.title}" est maintenant : ${status}`,
                'info'
            );

            return updatedIncident;
        } catch (error) {
            throw error;
        }
    }

};
