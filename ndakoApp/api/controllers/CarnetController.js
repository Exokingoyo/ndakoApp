/**
 * CarnetController
 *
 * Gestion des carnets de paiement
 */

const CarnetService = require("../services/CarnetService");

module.exports = {

    update: async function (req, res) {
        try {
            const id = req.params.id || req.body.carnetId;
            const data = req.body;

            const updated = await CarnetService.update(id, data);

            return res.ok({ status: 'success', message: 'Carnet mis à jour', carnet: updated });
        } catch (error) {
            sails.log.error('Erreur update carnet:', error);
            return res.serverError({ status: 'error', message: error.message || error });
        }
    },

    delete: async function (req, res) {
        try {
            const id = req.params.id || req.body.carnetId;
            const deleted = await CarnetService.delete(id);
            return res.ok({ status: 'success', message: 'Carnet supprimé', deleted });
        } catch (error) {
            sails.log.error('Erreur suppression carnet:', error);
            return res.serverError(error);
        }
    },

    getByLocation: async function (req, res) {
        try {
            const { locationId } = req.query;
            const carnets = await CarnetService.findByLocation(locationId);
            return res.ok({ status: 'success', message: 'Carnets récupérés', carnets });
        } catch (error) {
            return res.serverError(error);
        }
    },

    getByUser: async function (req, res) {
        try {
            const { userId } = req.query;
            const carnets = await CarnetService.findByUser(userId);
            return res.ok({ status: 'success', message: 'Carnets récupérés', carnets });
        } catch (error) {
            return res.serverError(error);
        }
    },

    getAll: async function (req, res) {
        try {
            const { page = 1, limit = 10, bailleurId, locateurId, status, year, mois } = req.query;
            const result = await CarnetService.findByCriteria(parseInt(page), parseInt(limit), bailleurId, locateurId, status, year, mois);
            return res.ok({ status: 'success', message: 'Carnets récupérés', result });
        } catch (error) {
            return res.serverError(error);
        }
    },

    findById: async function (req, res) {
        try {
            const id = req.params.id;
            const carnet = await CarnetService.findById(id);
            if (!carnet) return res.notFound({ message: 'Carnet non trouvé.' });
            return res.ok({ status: 'success', carnet });
        } catch (error) {
            return res.serverError(error);
        }
    },

    // Génère/ajoute N carnets pour une location
    addCarnet: async function (req, res) {
        try {
            const { locationId, mois = 1 } = req.body;

            const creations = await CarnetService.addCarnet(locationId, parseInt(mois));

            return res.ok({ status: 'success', message: 'Carnets générés', carnets: creations });
        } catch (error) {
            sails.log.error('Erreur addCarnet:', error);
            return res.serverError({ status: 'error', message: error.message || error });
        }
    },

    // Enregistre un paiement pour un carnet (paiement partiel ou total)
    // POST /api/v1/carnets/:id/payment  body: { amount, paymentDate }
    addPayment: async function (req, res) {
        try {
            const carnetId = req.params.id || req.body.carnetId;
            const { montant, paymentDate } = req.body;

            const updated = await CarnetService.addPayment(carnetId, Number(montant), paymentDate);
            return res.ok({ status: 'success', message: 'Paiement enregistré', carnet: updated });
        } catch (error) {
            sails.log.error('Erreur addPayment:', error);
            return res.serverError({ status: 'error', message: error.message || error });
        }
    },

    // Marque un carnet comme payé
    // POST /api/v1/carnets/:id/mark-paid body: { paidDate }
    markAsPaid: async function (req, res) {
        try {
            const id = req.params.id || req.body.carnetId;
            const { paidDate } = req.body;
            if (!id) return res.badRequest({ message: 'Carnet id requis.' });

            const updated = await CarnetService.markAsPaid(id, paidDate);
            return res.ok({ status: 'success', message: 'Carnet marqué comme payé', carnet: updated });
        } catch (error) {
            sails.log.error('Erreur markAsPaid:', error);
            return res.serverError({ status: 'error', message: error.message || error });
        }
    },

    // Génère 12 carnets à partir d'une date (wrapper)
    // POST /api/v1/carnets/generate body: { dateStart, locationId, montant }
    generateCarnets: async function (req, res) {
        try {
            const payload = req.body;
            const creations = await CarnetService.generateCarnetsWrapper(payload);
            return res.ok({ status: 'success', message: 'Carnets générés (12)', carnets: creations });
        } catch (error) {
            sails.log.error('Erreur generateCarnets:', error);
            return res.serverError({ status: 'error', message: error.message || error });
        }
    },

    // Récupère les carnets en retard
    // GET /api/v1/carnets/overdue
    getOverdue: async function (req, res) {
        try {
            const overdue = await CarnetService.findOverdueCarnets();
            return res.ok({ status: 'success', carnets: overdue });
        } catch (error) {
            sails.log.error('Erreur getOverdue:', error);
            return res.serverError({ status: 'error', message: error.message || error });
        }
    },

    // Récupère le prochain carnet dû pour une location
    // GET /api/v1/carnets/:locationId/next
    getNextDue: async function (req, res) {
        try {
            const locationId = req.params.locationId || req.query.locationId;
            const next = await CarnetService.getNextDueForLocation(locationId);
            return res.ok({ status: 'success', next });
        } catch (error) {
            sails.log.error('Erreur getNextDue:', error);
            return res.serverError({ status: 'error', message: error.message || error });
        }
    }

};
