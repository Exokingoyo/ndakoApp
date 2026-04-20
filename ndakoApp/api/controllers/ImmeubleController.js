/**
 * ImmeubleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const ImmeubleService = require("../services/ImmeubleService");

module.exports = {

    /**
    * @description :: Créer un nouveau immeuble
    */
    create: async (req, res) => {
        try {
            const { name, address, city, province, country, type, description, status, has_parking, has_pool, has_garden, water_available, electricity_available } = req.body

            // au cas ou l'user nest pas dans la session nous le cherchons sur le query
            // const user = req.session.user?.id ? req.query.user.id : null;
            const user = req.session.user?.id;

            const immeuble = await ImmeubleService.create({ user, name, address, city, province, country, type, description, status, has_parking, has_pool, has_garden, water_available, electricity_available });

            return res.ok({
                status: 'success',
                message: 'L\'immeuble a ete cree succes',
                immeuble: immeuble
            });
        } catch (error) {
            sails.log.error('Erreur generale:', error);
            return res.serverError({
                status: 'error',
                message: error.message || 'Une erreur est survenue lors de la creation de l\'immeuble.'
            });
        }
    },

    /**
    * @description :: Mettre a jour un immeuble
    */
    update: async (req, res) => {
        try {
            const { immeubleId, name, address, city, province, country, type, description, status, has_parking, has_pool, has_garden, water_available, electricity_available } = req.body

            const immeuble = await ImmeubleService.update(immeubleId, { name, address, city, province, country, type, description });

            return res.ok({
                status: 'success',
                message: 'L\'immeuble a ete mis a jour succes',
                immeuble: immeuble
            });
        } catch (error) {
            sails.log.error('Erreur generale:', error);
            return res.serverError({
                status: 'error',
                message: error.message || 'Une erreur est survenue lors de la mise a jour de l\'immeuble.'
            });
        }
    },

    /**
    * @description :: Recuperer un immeuble par son ID
    */
    getOneImmeuble: async (req, res) => {
        try {
            const immeubleId = req.body.id || req.params.id; // Utilisation de req.params.id
            const immeuble = await ImmeubleService.findById(immeubleId);

            if (!immeuble) {
                return res.notFound({ message: 'Immeuble non trouvé' });
            }
            return res.status(201).json({
                status: 'success',
                message: 'Immeuble recuperer avec succes',
                data: immeuble
            });
        } catch (error) {
            sails.log.error('Erreur getOne:', error);
            return res.serverError(error);
        }
    },

    /**
    * @description :: Recuperer les immeubles d'une entite  
    */
    getMyImmeubles: async (req, res) => {
        try {
            const { page = 1, limit = 10, name, address, city, province, country, type, description, status, has_parking, has_pool, has_garden, water_available, electricity_available } = req.query

            // au cas ou l'user nest pas dans la session nous le cherchons sur le query
            // const user = req.session.user?.id ? req.query.user.id : null;
            const user = req.session.user?.id;

            // Validation des parametres
            if (!user) {
                throw new Error('ID de l\'user requis');
            }

            const immeubles = await ImmeubleService.findByCriteria(page, limit, user, name, address, city, province, country, type, description, status, has_parking, has_pool, has_garden, water_available, electricity_available);

            return res.status(201).json({
                status: 'success',
                message: 'Immeubles recuperer avec succes',
                data: immeubles
            });

        } catch (error) {
            sails.log.error('Erreur generale:', error);
            return res.serverError({
                status: 'error',
                message: error.message || 'Une erreur est survenue lors de la recuperartion des immeubles.'
            });
        }
    },

    /**
    * @description :: Recuperer tout les immeubles  
    */
    getAllImmeubles: async (req, res) => {
        try {
            const { page = 1, limit = 10, name, address, city, province, country, type, description, status, has_parking, has_pool, has_garden, water_available, electricity_available } = req.query

            const immeubles = await ImmeubleService.findByCriteria(page, limit, name, address, city, province, country, type, description, status, has_parking, has_pool, has_garden, water_available, electricity_available);

            return res.status(201).json({
                status: 'success',
                message: 'Immeubles recuperer avec succes',
                data: immeubles
            });

        } catch (error) {
            sails.log.error('Erreur generale:', error);
            return res.serverError({
                status: 'error',
                message: error.message || 'Une erreur est survenue lors de la recuperartion des immeubles.'
            });
        }
    },

};



