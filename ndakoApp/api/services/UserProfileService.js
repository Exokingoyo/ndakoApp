/**
 * UserProfileService.js
 *
 * @description :: Logique métier pour la gestion des profils utilisateurs.
 */

const UserProfileRepo = require('../repositories/UserProfileRepo');

module.exports = {

  /**
   * Récupérer le profil d'un utilisateur (crée un profil vide si inexistant)
   */
  getProfile: async function (userId) {
    try {
      if (!userId) {
        throw { status: 400, message: 'ID utilisateur requis.' };
      }

      let profile = await UserProfileRepo.findByUserId(userId);

      return profile || null;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Créer ou mettre à jour le profil d'un utilisateur (upsert)
   */
  upsertProfile: async function (userId, data) {
    try {
      if (!userId) {
        throw { status: 400, message: 'ID utilisateur requis.' };
      }

      const existing = await UserProfileRepo.findByUserId(userId);

      if (existing) {
        const updated = await UserProfileRepo.update(userId, data);
        return updated;
      } else {
        const created = await UserProfileRepo.create({ ...data, user: userId });
        return created;
      }
    } catch (error) {
      throw error;
    }
  },

};
