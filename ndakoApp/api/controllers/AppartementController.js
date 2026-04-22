/**
 * AppartementController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

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
                // status: status
            });

            return res.ok({
                status: 'success',
                message: 'Appartement créé avec succès, en attente de validation.',
                appartement: newAppartement
            });
        } catch (error) {
            sails.log.error('Erreur creation appartement:', error);
            return res.serverError(error);
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
            const immeubleId = req.params.immeubleId;
            const appartements = await Appartement.find({ immeuble: immeubleId });
            return res.ok(appartements);
        } catch (error) {
            return res.serverError(error);
        }
    }

};
