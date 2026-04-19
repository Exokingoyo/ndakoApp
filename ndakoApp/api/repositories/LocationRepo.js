
module.exports = {

    getAll: async function () {
        try {
            return await Location.find().populate('user').populate('immeuble');
        } catch (error) {
            throw error;
        }
    },

    create: async function (data) {
        try {
            return await Location.create(data).fetch();
        } catch (error) {
            throw error;
        }
    },

    update: async function (id, data) {
        try {
            return await Location.updateOne(id).set(data);
        } catch (error) {
            throw error;
        }
    },

    delete: async function (id) {
        try {
            return await Location.destroy({ id: id }).fetch();
        } catch (error) {
            throw error;
        }
    },

    findByCriteria: async function (criteria = {}) {
        try {
            return await Location.find(criteria).populate('user').populate('immeuble');
        } catch (error) {
            throw error;
        }
    },

    findById: async function (id) {
        try {
            return await Location.findOne(id).populate('user').populate('immeuble');
        } catch (error) {
            throw error;
        }
    },



}