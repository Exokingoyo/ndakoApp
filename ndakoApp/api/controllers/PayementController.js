/**
 * PayementController.js
 *
 * @description :: Contrôleur pour la gestion des paiements.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const PayementService = require('../services/PayementService');

module.exports = {

  /**
   * @description :: Créer un nouveau paiement
   * POST /api/v1/payement
   */
  create: async (req, res) => {
    try {
      const { location, amount, motif, paymentMethod, date } = req.body;
      const userId = req.user.id;

      const payement = await PayementService.create({
        user: userId,
        location,
        amount,
        motif,
        paymentMethod,
        date,
      });

      return res.ok({
        status: 'success',
        message: 'Paiement créé avec succès.',
        payement,
      });
    } catch (error) {
      sails.log.error('Erreur création paiement:', error);

      if (error.status) {
        return res.status(error.status).json({ status: 'error', message: error.message });
      }
      return res.serverError({ status: 'error', message: error.message || 'Erreur serveur.' });
    }
  },

  /**
   * @description :: Mettre à jour le statut d'un paiement
   * PUT /api/v1/payement/:id
   */
  update: async (req, res) => {
    try {
      const id = req.params.id || req.query.id;
      const { status, paymentMethod } = req.body;

      const payement = await PayementService.update(id, { status, paymentMethod });

      return res.ok({
        status: 'success',
        message: 'Paiement mis à jour avec succès.',
        payement,
      });
    } catch (error) {
      sails.log.error('Erreur mise à jour paiement:', error);

      if (error.status) {
        return res.status(error.status).json({ status: 'error', message: error.message });
      }
      return res.serverError({ status: 'error', message: error.message || 'Erreur serveur.' });
    }
  },

  /**
   * @description :: Récupérer les paiements de l'utilisateur connecté
   * GET /api/v1/payement
   */
  getMyPayements: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, motif, status, paymentMethod, location } = req.query;

      const result = await PayementService.findByUser(page, limit, userId, {
        motif,
        status,
        paymentMethod,
        location,
      });

      return res.status(200).json({
        status: 'success',
        ...result,
      });
    } catch (error) {
      sails.log.error('Erreur récupération paiements:', error);

      if (error.status) {
        return res.status(error.status).json({ status: 'error', message: error.message });
      }
      return res.serverError({ status: 'error', message: error.message || 'Erreur serveur.' });
    }
  },

};
