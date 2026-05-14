const Payement = require("../models/Payement");

module.exports = {

    getAll: async function () {
        try {
            return await Payement.find().populate('user').populate('location').populate('carnet');
        } catch (error) {
            throw error;
        }
    },

    create: async function (data) {
        try {
            return await Payement.create(data).fetch();
        } catch (error) {
            throw error;
        }
    },

    update: async function (id, data) {
        try {
            return await Payement.updateOne(id).set(data);
        } catch (error) {
            throw error;
        }
    },

    delete: async function (id) {
        try {
            return await Payement.destroy({ id: id }).fetch();
        } catch (error) {
            throw error;
        }
    },

    findByCriteria: async function (criteria = {}) {
        try {
            return await Payement.find(criteria).populate('user').populate('location').populate('carnet');
        } catch (error) {
            throw error;
        }
    },

    findById: async function (id) {
        try {
            return await Payement.findOne(id).populate('user').populate('location').populate('carnet');
        } catch (error) {
            throw error;
        }
    },

    /**
     * Récupérer tous les paiements associés à un carnet
     * @param {String} carnetId - ID du carnet
     */
    findByCarnet: async function (carnetId) {
        try {
            if (!carnetId) {
                throw new Error('Carnet ID is required');
            }
            return await Payement.find({ carnet: carnetId })
                .populate('user')
                .populate('location')
                .populate('carnet')
                .sort('createdAt DESC');
        } catch (error) {
            throw error;
        }
    },

    /**
     * Récupérer les paiements d'un carnet pour un utilisateur spécifique
     * @param {String} carnetId - ID du carnet
     * @param {String} userId - ID de l'utilisateur
     */
    findByCarnetAndUser: async function (carnetId, userId) {
        try {
            if (!carnetId || !userId) {
                throw new Error('Carnet ID and User ID are required');
            }
            return await Payement.find({ carnet: carnetId, user: userId })
                .populate('user')
                .populate('location')
                .populate('carnet')
                .sort('createdAt DESC');
        } catch (error) {
            throw error;
        }
    },

    /**
     * Récupérer les paiements complétés d'un carnet
     * @param {String} carnetId - ID du carnet
     */
    findCompletedByCarnet: async function (carnetId) {
        try {
            if (!carnetId) {
                throw new Error('Carnet ID is required');
            }
            return await Payement.find({ carnet: carnetId, status: 'completed' })
                .populate('user')
                .populate('location')
                .populate('carnet')
                .sort('createdAt DESC');
        } catch (error) {
            throw error;
        }
    },

};