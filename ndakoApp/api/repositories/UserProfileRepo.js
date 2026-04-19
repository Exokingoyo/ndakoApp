/**
 * UserProfileRepo.js
 *
 * @description :: Accès aux données pour le modèle UserProfile.
 */

module.exports = {

  findByUserId: async function (userId) {
    try {
      return await UserProfile.findOne({ user: userId }).populate('user');
    } catch (error) {
      throw error;
    }
  },

  create: async function (data) {
    try {
      return await UserProfile.create(data).fetch();
    } catch (error) {
      throw error;
    }
  },

  update: async function (userId, data) {
    try {
      return await UserProfile.updateOne({ user: userId }).set(data);
    } catch (error) {
      throw error;
    }
  },

  findById: async function (id) {
    try {
      return await UserProfile.findOne({ id }).populate('user');
    } catch (error) {
      throw error;
    }
  },

};
