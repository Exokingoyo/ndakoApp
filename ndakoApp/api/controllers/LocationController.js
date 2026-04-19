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
            const { user, immeuble, loyer, caution, dateStart } = req.body

            // finir les config de la session
            // const user = req.session.user.id || req.body.user   
            //immeuble ne dois pas etre deja occuper 


            const location = await LocationService.create(user, immeuble, loyer, caution, dateStart);

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
            const { user, immeuble, loyer, caution, dateStart } = req.body
            const id = req.params.id || req.query.id

            sails.log("id",id,"data",{ user, immeuble, loyer, caution, dateStart })

            const location = await LocationService.update(id, { user, immeuble, loyer, caution, dateStart });

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

            const locations = await locationService.findByCriteria(page, limit, user, name, address, city, province, country, type, description, status);
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

