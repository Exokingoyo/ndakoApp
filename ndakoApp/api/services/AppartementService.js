const Sails = require("sails/lib/app/Sails");
const AppartementRepo = require("../repositories/AppartementRepo");
const ImmeubleRepo = require("../repositories/ImmeubleRepo");
const sailsHookGrunt = require("sails-hook-grunt");

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
                immeuble: data.immeubleId,
                ...data
            });
        } catch (error) {
            throw error;
        }
    },

    update: async function (id, data) {
        try {
            const immeuble = await ImmeubleRepo.findById(data.immeubleId)

            if (!immeuble) {
                throw ({ message: 'l\'immeuble n\'exite pas.' });
            }
            if (immeuble.status !== 'active') {
                throw ({ message: 'l\'immeuble n\'est pas active.' });
            }
            const appartement = await this.findById(id);

            if (!appartement) {
                throw ({ message: 'l\'appartement n\'exite pas ' });
            }

            return await AppartementRepo.update(id, {
                ...data,
                immeuble: data.immeubleId,
            });
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

    findByCriteria: async function (page, limit, userId, immeubleId, name, loyerStart, loyerEnd, etage, chambreMin, ChambreMax, bathroomsMin, bathroomsMax, surface_areaMin, surface_areaMax, is_vacant, description, status) {
        try {
            return await AppartementRepo.findByCriteria(page, limit, userId, immeubleId, name, loyerStart, loyerEnd, etage, chambreMin, ChambreMax, bathroomsMin, bathroomsMax, surface_areaMin, surface_areaMax, is_vacant, description, status);
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

    findByImmeuble: async function (immeubleId) {
        try {
            return await AppartementRepo.findByImmeuble(immeubleId);
        } catch (error) {
            throw error;
        }
    },



}