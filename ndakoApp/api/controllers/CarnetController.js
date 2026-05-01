/**
 * CarnetController
 *
 * Gestion des carnets de paiement
 */

const CarnetService = require("../services/CarnetService");

module.exports = {

    create: async function (req, res) {
        try {
            const { mois, year, montant, loyer, datePayement, dateECheance, reste, status, proprietaireId, locateurId, locationId } = req.body;

            const carnet = await CarnetService.create({ mois, year, montant, loyer, datePayement, dateECheance, reste, status, proprietaireId, locateurId, locationId });

            return res.ok({ status: 'success', message: 'Carnet créé', carnet });
        } catch (error) {
            sails.log.error('Erreur creation carnet:', error);
            return res.serverError(error);
        }
    },

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
            const { page = 1, limit = 10, proprietaire, locateur, status, year, mois } = req.query;
            const result = await CarnetService.findByCriteria(parseInt(page), parseInt(limit), proprietaire, locateur, status, year, mois);
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
    }

};
