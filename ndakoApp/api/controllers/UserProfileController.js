/**
 * UserProfileController.js
 *
 * @description :: Contrôleur pour la gestion des profils utilisateurs.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const UserProfileService = require('../services/UserProfileService');

module.exports = {

  /**
   * @description :: Récupérer le profil de l'utilisateur connecté
   * GET /api/v1/profile
   */
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      const profile = await UserProfileService.getProfile(userId);

      if (!profile) {
        return res.status(200).json({
          status: 'success',
          message: 'Aucun profil trouvé. Vous pouvez en créer un via PUT /api/v1/profile.',
          profile: null,
        });
      }

      return res.ok({
        status: 'success',
        profile,
      });
    } catch (error) {
      sails.log.error('Erreur récupération profil:', error);

      if (error.status) {
        return res.status(error.status).json({ status: 'error', message: error.message });
      }
      return res.serverError({ status: 'error', message: error.message || 'Erreur serveur.' });
    }
  },

  /**
   * @description :: Créer ou mettre à jour le profil de l'utilisateur connecté
   * PUT /api/v1/profile
   */
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { avatar_url, address, city, province, country, preferences } = req.body;

      const profile = await UserProfileService.upsertProfile(userId, {
        avatar_url,
        address,
        city,
        province,
        country,
        preferences,
      });

      return res.ok({
        status: 'success',
        message: 'Profil mis à jour avec succès.',
        profile,
      });
    } catch (error) {
      sails.log.error('Erreur mise à jour profil:', error);

      if (error.status) {
        return res.status(error.status).json({ status: 'error', message: error.message });
      }
      return res.serverError({ status: 'error', message: error.message || 'Erreur serveur.' });
    }
  },

};
