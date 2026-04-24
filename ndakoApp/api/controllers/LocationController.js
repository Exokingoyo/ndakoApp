/**
 * LocationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const LocationService = require("../services/LocationService");

module.exports = {

    /**
    * @description :: Créer un nouveau location (contrat)
    */
    create: async (req, res) => {
        try {
            const { userId, appartementId, caution, dateStart } = req.body

            const location = await LocationService.create({ userId, appartementId, caution, dateStart });

            return res.ok({
                status: 'success',
                message: 'Location à été cree avec succes',
                location: location
            });
        } catch (error) {
            sails.log.error('Erreur generale:', error);
            return res.serverError({
                status: 'error',
                message: error.message || 'Une erreur est survenue lors de la creation de location.'
            });
        }
    },

    /**
    * @description :: Mettre a jour un location
    */
    update: async (req, res) => {
        try {
            const { userId, appartementId, locationId, caution, dateStart, dateEnd, status } = req.body

            const location = await LocationService.update(locationId, { userId, appartementId, caution, dateStart, dateEnd, status });

            return res.ok({
                status: 'success',
                message: 'Location a ete mis a jour succes',
                location: location
            });
        } catch (error) {
            sails.log.error('Erreur generale:', error);
            return res.serverError({
                status: 'error',
                message: error.message || 'Une erreur est survenue lors de la mise a jour de l\'location.'
            });
        }
    },

    /**
    * @description :: Recuperer les locations d'une entite  
    */
    getMylocations: async (req, res) => {
        try {
            const { page = 1, limit = 10, user, name, address, city, province, country, type, description, status } = req.query
            // req.query.user = req.session.user || req.query.user

            const locations = await LocationService.findByCriteria(page, limit, user, name, address, city, province, country, type, description, status);
            return res.status(200).json(locations);

        } catch (error) {
            sails.log.error('Erreur generale:', error);
            return res.serverError({
                status: 'error',
                message: error.message || 'Une erreur est survenue lors de la mise a jour de l\'location.'
            });
        }
    },
};

