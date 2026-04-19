const ImmeubleRepo = require("../repositories/ImmeubleRepo");

module.exports = {

    getAll: async function () {
        try {
            return await ImmeubleRepo.getAll();
        } catch (error) {
            throw error;
        }
    },
    create: async function (data) {
        try {
            return await ImmeubleRepo.create(data);
        } catch (error) {
            throw error;
        }
    },

    update: async function (id, data) {
        try {
            const immeuble = await this.findById(id);
            if (!immeuble) return res.badRequest('Missing id parameter')

            return await ImmeubleRepo.update(immeuble.id, data);
        } catch (error) {
            throw error;
        }
    },

    delete: async function (id) {
        try {
            return await ImmeubleRepo.delete(id);
        } catch (error) {
            throw error;
        }
    },

    findByCriteria: async function (page, limit, user, name, address, city, province, country, type, description, status) {
        try {
            // forcer la conversion en int 
            page = parseInt(page)
            limit = parseInt(limit)

            // Validation des parametres
            if (!user) {
                throw new Error('ID de l\'user requis');
            }
            
            return await ImmeubleRepo.findByCriteria(page, limit, user, name, address, city, province, country, type, description, status);
        } catch (error) {
            throw error;
        }
    },

    findById: async function (id) {
        try {
            return await ImmeubleRepo.findById(id);
        } catch (error) {
            throw error;
        }
    },



}