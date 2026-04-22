/**
 * AppartementController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const ImmeubleRepo = require("../repositories/ImmeubleRepo");
const AppartementService = require("../services/AppartementService");
const NotificationService = require("../services/NotificationService");

module.exports = {

    /**
     * @description :: Créer un nouvel appartement dans un immeuble
     */
    create: async function (req, res) {
        try {
            const { immeubleId, name, loyer, etage, chambre, bathrooms, surface_area, description } = req.body;

            const newAppartement = await AppartementService.create({
                immeubleId,
                name,
                loyer,
                etage,
                chambre,
                bathrooms,
                surface_area,
                description,
            });

            return res.ok({
                status: 'success',
                message: 'Appartement créé avec succès ',
                appartement: newAppartement
            });
        } catch (error) {
            sails.log.error('Erreur creation appartement:', error);
            return res.serverError(error);
        }
    },

    /**
     * @description :: Mettre à jour un appartement 
     */
    update: async (req, res) => {
        try {
            const { immeubleId, name, loyer, etage, chambre, bathrooms, surface_area, is_vacant, description, status } = req.body;

            const appartementId = req.params.id || req.body.appartementId

            const appartement = await AppartementService.update(appartementId, { immeubleId, name, loyer, etage, chambre, bathrooms, surface_area, is_vacant, description, status });

            return res.ok({
                status: 'success',
                message: 'L\'appartement a ete mis a jour succes',
                appartement: appartement
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
     * @description :: Valider un appartement (déclenche une notification)
     */
    validate: async function (req, res) {
        try {
            const id = req.params.id;

            const updatedAppartement = await Appartement.updateOne(id).set({
                status: 'active'
            }).populate('immeuble');

            if (!updatedAppartement) {
                return res.notFound({ message: 'Appartement non trouvé.' });
            }

            // Notifier le propriétaire (bailleur) de l'immeuble
            const ownerId = updatedAppartement.immeuble.user;
            await NotificationService.notify(
                ownerId,
                `Votre appartement "${updatedAppartement.name}" dans l'immeuble "${updatedAppartement.immeuble.name}" a été validé.`,
                'success'
            );

            return res.ok({
                status: 'success',
                message: 'Appartement validé et propriétaire notifié.',
                appartement: updatedAppartement
            });
        } catch (error) {
            sails.log.error('Erreur validation appartement:', error);
            return res.serverError(error);
        }
    },

    /**
     * @description :: Récupérer les appartements d'un immeuble
     */
    getByImmeuble: async function (req, res) {
        try {
            const { immeubleId } = req.query;
            const appartements = await AppartementService.findByImmeuble(immeubleId);
            return res.ok({
                status: 'success',
                message: 'Les Appartement ont ete cree succes',
                appartements: appartements
            });
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * @description :: Récupérer tout les appartements 
     */
    getAllAppartements: async function (req, res) {
        try {
            const { page = 1, limit = 10, userId, immeubleId, name, loyerStart, loyerEnd, etage, chambreMin, ChambreMax, bathroomsMin, bathroomsMax, surface_areaMin, surface_areaMax, is_vacant, description, status } = req.query;

            const appartements = await AppartementService.findByCriteria(page, limit, userId, immeubleId, name, loyerStart, loyerEnd, etage, chambreMin, ChambreMax, bathroomsMin, bathroomsMax, surface_areaMin, surface_areaMax, is_vacant, description, status);
            return res.ok({
                status: 'success',
                message: 'Les Appartements ont ete recuperer succes',
                appartements: appartements
            });
        } catch (error) {
            return res.serverError(error);
        }
    },

    

};
