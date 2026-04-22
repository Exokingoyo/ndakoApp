const AppartementRepo = require("../repositories/AppartementRepo");
const ImmeubleRepo = require("../repositories/ImmeubleRepo");

module.exports = {

    getAll: async function () {
        try {
            return await AppartementRepo.getAll();
        } catch (error) {
            throw error;
        }
    },

    create: async function (data) {
        try {

            if (!data.loyer) {
                throw ({ message: 'Le loyer de l\'appartement est requis.' });
            }
            if (!data.name) {
                throw ({ message: 'Le nom de l\'appartement est requis.' });
            }
            if (!data.immeubleId) {
                throw ({ message: 'L\'ID de l\'immeuble est requis.' });
            }

            const immeuble = await ImmeubleRepo.findById(data.immeubleId)

            if (!immeuble) {
                throw ({ message: 'l\'immeuble n\'exite pas.' });
            }
            if (immeuble.status !== 'active') {
                throw ({ message: 'l\'immeuble n\'est pas active.' });
            }

            return await AppartementRepo.create({
                name: data.name,
                etage: data.etage,
                loyer: data.loyer,
                surface_area: data.surface_area,
                chambre: data.chambre,
                bathrooms: data.bathrooms,
                immeuble: data.immeubleId,
                description: data.description,
            });
        } catch (error) {
            throw error;
        }
    },

    update: async function (id, data) {
        try {
            return await AppartementRepo.update(id, data);
        } catch (error) {
            throw error;
        }
    },

    delete: async function (id) {
        try {
            return await AppartementRepo.delete(id);
        } catch (error) {
            throw error;
        }
    },

    findByCriteria: async function (criteria) {
        try {
            return await AppartementRepo.findByCriteria(criteria);
        } catch (error) {
            throw error;
        }
    },

    findById: async function (id) {
        try {
            return await AppartementRepo.findById(id);
        } catch (error) {
            throw error;
        }
    },



}