const LocationRepo = require("../repositories/LocationRepo");
const AppartementRepo = require("../repositories/AppartementRepo");
const UserRepo = require("../repositories/UserRepo");
const ImmeubleRepo = require("../repositories/ImmeubleRepo");

module.exports = {

    getAll: async function () {
        try {
            return await LocationRepo.getAll();
        } catch (error) {
            throw error;
        }
    },

    create: async function (data) {
        try {

            if (!data.appartementId) {
                throw ({ message: 'L\'appartement est requis.' });
            }

            const appartement = await AppartementRepo.findById(data.appartementId);

            if (!appartement) {
                throw ({ message: 'l\'appartement n\'exite pas.' });
            }
            if (appartement.status !== 'active') {
                throw ({ message: 'l\'appartement n\'est pas active.' });
            }
            if (appartement.is_vacant !== true) {
                throw ({ message: 'l\'appartement n\'est pas disponible.' });
            }

            if (!data.userId) {
                throw ({ message: 'L\'utilisateur est requis.' });
            }
            const user = await UserRepo.findById(data.userId);

            if (!user) {
                throw ({ message: 'l\'utilisateur n\'exite pas.' });
            }
            if (user.status !== 'active') {
                throw ({ message: 'l\'utilisateur n\'est pas active.' });
            }
            if (user.is_active !== true) {
                throw ({ message: 'l\'utilisateur n\'est pas actif.' });
            }
            // if (user.role !== 'locataire') {
            //     throw ({ message: 'l\'utilisateur doit être un locataire.' });
            // }

            if (!data.caution) {
                throw ({ message: 'La caution de l\'appartement est requise.' });
            }

            const locationData = {
                caution: data.caution,
                loyer: appartement.loyer,
                user: data.userId,
                appartement: data.appartementId,
                dateStart: data.dateStart || new Date(),
            };

            // mettre un syst. de validation au moyen d'un payement avant la creation de location

            const location = await LocationRepo.create(locationData);
            
            await AppartementRepo.update(data.appartementId, { is_vacant: false });
            return location;
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