const LocationRepo = require("../repositories/LocationRepo");

module.exports = {

    getAll: async function () {
        try {
            return await LocationRepo.getAll();
        } catch (error) {
            throw error;
        }
    },

    create: async function (user, immeuble, loyer, caution, dateStart) {
        try {
            return await LocationRepo.create({ user, immeuble, loyer, caution, dateStart });
        } catch (error) {
            throw error;
        }
    },

    update: async function (id, data) {
        try {
            return await LocationRepo.update(id, data);
        } catch (error) {
            throw error;
        }
    },

    delete: async function (id) {
        try {
            return await LocationRepo.delete(id);
        } catch (error) {
            throw error;
        }
    },

    findByCriteria: async function (criteria) {
        try {
            return await LocationRepo.findByCriteria(criteria);
        } catch (error) {
            throw error;
        }
    },

    findById: async function (id) {
        try {
            return await LocationRepo.findById(id);
        } catch (error) {
            throw error;
        }
    },



}