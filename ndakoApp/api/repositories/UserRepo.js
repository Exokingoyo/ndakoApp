
module.exports = {

    getAll: async function () {
        try {
            return await User.find();
        } catch (error) {
            throw error;
        }
    },
    create: async function (data) {
        try {
            return await User.create(data).fetch();
        } catch (error) {
            throw error;
        }
    },

    update: async function (id, data) {
        try {
            return await User.updateOne(id).set(data);
        } catch (error) {
            throw error;
        }
    },

    delete: async function (id) {
        try {
            return await User.destroy({ id: id }).fetch();
        } catch (error) {
            throw error;
        }
    },

    findByCriteria: async function (criteria = {}) {
        try {
            return await User.find(criteria);
        } catch (error) {
            throw error;
        }
    },

    findById: async function (id) {
        try {
            return await User.findOne({ id: id });
        } catch (error) {
            throw error;
        }
    },

    findByEmail: async function (email) {
        try {
            return await User.findOne({ email: email });
        } catch (error) {
            throw error;
        }
    },



}