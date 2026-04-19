
module.exports = {

    create: async function (data) {
        try {
            return await Incident.create(data).fetch();
        } catch (error) {
            throw error;
        }
    },

    update: async function (id, data) {
        try {
            return await Incident.updateOne(id).set(data);
        } catch (error) {
            throw error;
        }
    },

    findByUser: async function (userId) {
        try {
            return await Incident.find({ user: userId }).populate('immeuble').sort('createdAt DESC');
        } catch (error) {
            throw error;
        }
    },

    findByImmeuble: async function (immeubleId) {
        try {
            return await Incident.find({ immeuble: immeubleId }).populate('user').sort('createdAt DESC');
        } catch (error) {
            throw error;
        }
    },

    findById: async function (id) {
        try {
            return await Incident.findOne(id).populate('user').populate('immeuble');
        } catch (error) {
            throw error;
        }
    }

};
