const CarnetRepo = require("../repositories/CarnetRepo");
const LocationRepo = require("../repositories/LocationRepo");
const UserRepo = require("../repositories/UserRepo");
const NotificationService = require("./NotificationService");

module.exports = {

    create: async function (data) {
        try {

            if (!data.locationId) throw ({ message: 'La location est requise.' });

            const location = await LocationRepo.findById(data.locationId);
            if (!location) throw ({ message: 'La location n\'existe pas.' });

            const appartement = await AppartementRepo.findById(location.appartement);
            if (!appartement) throw ({ message: 'L\'appartement lié à la location n\'existe pas.' });

            const immeuble = await ImmeubleRepo.findById(appartement.immeuble);
            if (!immeuble) throw ({ message: 'L\'immeuble lié à l\'appartement n\'existe pas.' });


            // const proprietaire = await UserRepo.findById(data.proprietaireId);
            // if (!proprietaire) throw ({ message: 'Le propriétaire n\'existe pas.' });

            // const locateur = await UserRepo.findById(data.locateurId);
            // if (!locateur) throw ({ message: 'Le locateur n\'existe pas.' });

            const carnetData = {
                date_Start: new Date(),
                montant: data.montant || 0,
                loyer: appartement.loyer,
                date_payement: data.date_payement,
                date_echeance: data.date_echeance,
                reste: data.reste || 0,
                status: data.status || 'unpaid',
                proprietaire: immeuble.user,
                locateur: location.user,
                location: data.locationId
            };

            const carnet = await CarnetRepo.create(carnetData);

            // notification au propriétaire et au locateur
            await NotificationService.notify(
                carnetData.proprietaire,
                `Carnet créé pour ${location.appartement ? location.appartement.name : 'votre bien'} - ${data.mois}/${data.year}`,
                'info',
                'carnet',
                carnet.id,
                `/carnet/${carnet.id}`
            );

            await NotificationService.notify(
                carnetData.locateur,
                `Nouveau carnet disponible pour ${data.mois}/${data.year}`,
                'info',
                'carnet',
                carnet.id,
                `/carnet/${carnet.id}`
            );

            return carnet;
        } catch (error) {
            throw error;
        }
    },

    update: async function (id, data) {
        try {
            const existing = await CarnetRepo.findById(id);
            if (!existing) throw ({ message: 'Le carnet n\'existe pas.' });

            if (data.locationId) {
                const location = await LocationRepo.findById(data.locationId);
                if (!location) throw ({ message: 'La location n\'existe pas.' });
            }

            if (data.proprietaireId) {
                const proprietaire = await UserRepo.findById(data.proprietaireId);
                if (!proprietaire) throw ({ message: 'Le propriétaire n\'existe pas.' });
            }

            if (data.locateurId) {
                const locateur = await UserRepo.findById(data.locateurId);
                if (!locateur) throw ({ message: 'Le locateur n\'existe pas.' });
            }

            const updated = await CarnetRepo.update(id, {
                ...data,
                proprietaire: data.proprietaireId,
                locateur: data.locateurId,
                location: data.locationId
            });

            return updated;
        } catch (error) {
            throw error;
        }
    },

    delete: async function (id) {
        try {
            return await CarnetRepo.delete(id);
        } catch (error) {
            throw error;
        }
    },

    findByCriteria: async function (page, limit, proprietaire, locateur, status, year, mois) {
        try {
            return await CarnetRepo.findByCriteria(page, limit, proprietaire, locateur, status, year, mois);
        } catch (error) {
            throw error;
        }
    },

    findById: async function (id) {
        try {
            return await CarnetRepo.findById(id);
        } catch (error) {
            throw error;
        }
    },

    findByLocation: async function (locationId) {
        try {
            return await CarnetRepo.findByLocation(locationId);
        } catch (error) {
            throw error;
        }
    },

    findByUser: async function (userId) {
        try {
            return await CarnetRepo.findByUser(userId);
        } catch (error) {
            throw error;
        }
    }

};
