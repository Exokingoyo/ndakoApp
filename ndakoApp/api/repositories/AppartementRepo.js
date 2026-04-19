
module.exports = {

    create: async function (data) {
        try {
            return await Appartement.create(data).fetch();
        } catch (error) {
            throw error;
        }
    },

    update: async function (id, data) {
        try {
            return await Appartement.updateOne(id).set(data);
        } catch (error) {
            throw error;
        }
    },

    delete: async function (id) {
        try {
            return await Appartement.destroy({ id: id }).fetch();
        } catch (error) {
            throw error;
        }
    },

    findById: async function (id) {
        try {
            return await Appartement.findOne(id).populate('immeuble');
        } catch (error) {
            throw error;
        }
    },

    findByImmeuble: async function (immeubleId) {
        try {
            return await Appartement.find({ immeuble: immeubleId }).sort('name ASC');
        } catch (error) {
            throw error;
        }
    },

    findVacantByImmeuble: async function (immeubleId) {
        try {
            return await Appartement.find({ immeuble: immeubleId, is_vacant: true }).sort('name ASC');
        } catch (error) {
            throw error;
        }
    }

};
