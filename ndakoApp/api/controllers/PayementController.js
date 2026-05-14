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
      const { location, amount, motif, paymentMethod, date, carnet, description } = req.body;
      const userId = req.user.id;

      const payement = await PayementService.create({
        user: userId,
        location,
        amount,
        motif,
        paymentMethod,
        date,
        carnet,
        description,
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
   * @description :: Créer un paiement directement depuis un carnet
   * POST /api/v1/payement/carnet/:carnetId
   */
  createFromCarnet: async (req, res) => {
    try {
      const carnetId = req.params.carnetId;
      const { amount, paymentMethod, description } = req.body;
      const userId = req.user.id;

      const payement = await PayementService.createFromCarnet(
        carnetId,
        amount,
        paymentMethod,
        userId,
        description
      );

      return res.ok({
        status: 'success',
        message: 'Paiement créé et carnet mis à jour avec succès.',
        payement,
      });
    } catch (error) {
      sails.log.error('Erreur création paiement carnet:', error);

      if (error.status) {
        return res.status(error.status).json({ status: 'error', message: error.message });
      }
      return res.serverError({ status: 'error', message: error.message || 'Erreur serveur.' });
    }
  },

  /**
   * @description :: Obtenir l'historique des paiements d'un carnet
   * GET /api/v1/payement/carnet/:carnetId
   */
  getPaymentHistory: async (req, res) => {
    try {
      const carnetId = req.params.carnetId;

      const history = await PayementService.getPaymentHistory(carnetId);

      return res.ok({
        status: 'success',
        message: 'Historique des paiements récupéré.',
        history,
      });
    } catch (error) {
      sails.log.error('Erreur récupération historique paiements:', error);

      if (error.status) {
        return res.status(error.status).json({ status: 'error', message: error.message });
      }
      return res.serverError({ status: 'error', message: error.message || 'Erreur serveur.' });
    }
  },

  /**
   * @description :: Réconcilier les paiements d'un carnet
   * POST /api/v1/payement/reconcile/:carnetId
   */
  reconcileCarnet: async (req, res) => {
    try {
      const carnetId = req.params.carnetId;

      const result = await PayementService.reconcileCarnetPayments(carnetId);

      return res.ok({
        status: 'success',
        message: 'Paiements du carnet réconciliés.',
        carnet: result,
      });
    } catch (error) {
      sails.log.error('Erreur réconciliation paiements:', error);

      if (error.status) {
        return res.status(error.status).json({ status: 'error', message: error.message });
      }
      return res.serverError({ status: 'error', message: error.message || 'Erreur serveur.' });
    }
  },

  /**
   * @description :: Traiter le remboursement d'un paiement
   * POST /api/v1/payement/:id/refund
   */
  refund: async (req, res) => {
    try {
      const payementId = req.params.id;
      const { amount, reason } = req.body;

      const refunded = await PayementService.refundPayment(payementId, amount, reason);

      return res.ok({
        status: 'success',
        message: 'Remboursement traité avec succès.',
        payement: refunded,
      });
    } catch (error) {
      sails.log.error('Erreur remboursement paiement:', error);

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
