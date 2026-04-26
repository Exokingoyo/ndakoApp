/**
 * LocationController
 *
 * Actions pour gérer les locations (contrats de location).
 * Chaque action renvoie un JSON avec un statut et un message, et suit
 * la logique métier définie dans `LocationService`.
 */

const LocationRepo = require("../repositories/LocationRepo");
const LocationService = require("../services/LocationService");

module.exports = {

    /**
     * Create a new location (contrat).
     * Body expected: { userId, appartementId, caution, dateStart }
     * Returns: nouvel objet location
     */
    create: async (req, res) => {
        try {
            const { userId, appartementId, caution, dateStart } = req.body;

            const location = await LocationService.create({ userId, appartementId, caution, dateStart });

            return res.status(201).json({
                status: 'success',
                message: 'Location créée avec succès.',
                location
            });
        } catch (error) {
            sails.log.error('LocationController.create erreur :', error);
            return res.serverError({
                status: 'error',
                message: error.message || 'Erreur lors de la création de la location.'
            });
        }
    },

    /**
     * Mettre à jour une location existante.
     * Body expected: { locationId, userId, appartementId, caution, dateStart, dateEnd, status }
     * Returns: location mise à jour
     */
    update: async (req, res) => {
        try {
            const { locationId, userId, appartementId, caution, dateStart, dateEnd, status } = req.body;

            if (!locationId) return res.badRequest({ status: 'error', message: 'L\'identifiant de la location est requis.' });

            const location = await LocationService.update(locationId, { userId, appartementId, caution, dateStart, dateEnd, status });

            return res.ok({
                status: 'success',
                message: 'Location mise à jour avec succès.',
                location
            });
        } catch (error) {
            sails.log.error('LocationController.update erreur :', error);
            return res.serverError({
                status: 'error',
                message: error.message || 'Erreur lors de la mise à jour de la location.'
            });
        }
    },

    /**
     * Récupérer toutes les locations (sans filtre).
     * Utile pour l'administration.
     */
    getAll: async (req, res) => {
        try {
            const locations = await LocationService.getAll();
            return res.ok({
                status: 'success',
                message: 'Locations récupérées avec succès.',
                locations
            });
        } catch (error) {
            sails.log.error('LocationController.getAll erreur :', error);
            return res.serverError({ status: 'error', message: error.message || 'Erreur lors de la récupération des locations.' });
        }
    },

    /**
     * Récupérer une location par son identifiant.
     * Route param: `id`
     */
    getById: async (req, res) => {
        try {
            const id = req.params.id || req.body.id;
            if (!id) return res.badRequest({ status: 'error', message: 'L\'identifiant est requis.' });

            const location = await LocationService.findById(id);
            if (!location) return res.notFound({ status: 'error', message: 'Location introuvable.' });

            return res.ok({
                status: 'success',
                message: 'Location récupérée avec succès.',
                location
            });
        } catch (error) {
            sails.log.error('LocationController.getById erreur :', error);
            return res.serverError({ status: 'error', message: error.message || 'Erreur lors de la récupération de la location.' });
        }
    },

    /**
     * Supprimer une location.
     * Route param: `id`
     */
    delete: async (req, res) => {
        try {
            const id = req.params.id || req.body.id;
            if (!id) return res.badRequest({ status: 'error', message: 'L\'identifiant est requis.' });

            await LocationService.delete(id);
            return res.ok({
                status: 'success',
                message: 'Location supprimée avec succès.'
            });
        } catch (error) {
            sails.log.error('LocationController.delete erreur :', error);
            return res.serverError({ status: 'error', message: error.message || 'Erreur lors de la suppression de la location.' });
        }
    },

    /**
     * Rechercher / lister les locations par critères avec pagination.
     * Query params supportés: page, limit, user, appartement, status, dateStart, dateEnd
     * Exemple: `?page=1&limit=20&user=123&status=active`
     */
    find: async (req, res) => {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;

            const { user, status, loyerMin, loyerMax, cautionMin, cautionMax, dateStart, dateEnd } = req.query;

            const locations = await LocationService.findByCriteria(user, status, loyerMin, loyerMax, cautionMin, cautionMax, dateStart, dateEnd, page, limit);
            return res.ok({
                status: 'success',
                message: 'Locations récupérées avec succès.',
                locations
            });
        } catch (error) {
            sails.log.error('LocationController.find erreur :', error);
            return res.serverError({ status: 'error', message: error.message || 'Erreur lors de la recherche des locations.' });
        }
    },

    /**
     * Mettre à jour uniquement le statut d'une location (ex: active, terminated, cancelled)
     * Body expected: { locationId, status }
     */
    changeStatus: async (req, res) => {
        try {
            const { locationId, status } = req.body;

            if (!locationId || !status) return res.badRequest({ status: 'error', message: 'locationId et status sont requis.' });

            const location = await LocationService.changeStatus(locationId, status);
            return res.ok({
                status: 'success',
                message: 'Statut mis à jour.',
                location
            });
        } catch (error) {
            sails.log.error('LocationController.changeStatus erreur :', error);
            return res.serverError({ status: 'error', message: error.message || 'Erreur lors de la mise à jour du statut.' });
        }
    }
};

