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
            const { user, name, address, city, province, country, type, description } = req.body

            // finir les config de la session
            // const user = req.session.user.id || req.body.user

            const immeuble = await ImmeubleService.create({ user, name, address, city, province, country, type, description });

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
            const { name, address, city, province, country, type, description } = req.body
            // const id = req.params.id || req.query.id
            
            sails.log.debug('ID de l\'immeuble à mettre à jour:', req.params.id);
            return
            const immeuble = await ImmeubleService.update(id, { name, address, city, province, country, type, description });

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
    * @description :: Recuperer les immeubles d'une entite  
    */
    getMyImmeubles: async (req, res) => {
        try {
            const { page = 1, limit = 10, user, name, address, city, province, country, type, description, status } = req.query
            // req.query.user = req.session.user || req.query.user

            const immeubles = await ImmeubleService.findByCriteria(page, limit, user, name, address, city, province, country, type, description, status);
            return res.status(200).json(immeubles);

        } catch (error) {
            sails.log.error('Erreur generale:', error);
            return res.serverError({
                status: 'error',
                message: error.message || 'Une erreur est survenue lors de la mise a jour de l\'immeuble.'
            });
        }
    },


};



