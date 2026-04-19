const Payement = require("../models/Payement");

module.exports = {

    getAll: async function () {
        try {
            return await Payement.find().populate('user').populate('location');
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
            return await Payement.find(criteria).populate('user').populate('location');
        } catch (error) {
            throw error;
        }
    },

    findById: async function (id) {
        try {
            return await Payement.findOne(id).populate('user').populate('location');
        } catch (error) {
            throw error;
        }
    },



}