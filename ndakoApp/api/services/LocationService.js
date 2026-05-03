const LocationRepo = require("../repositories/LocationRepo");
const AppartementRepo = require("../repositories/AppartementRepo");
const UserRepo = require("../repositories/UserRepo");
const ImmeubleRepo = require("../repositories/ImmeubleRepo");
const NotificationService = require("./NotificationService");
const CarnetService = require("./CarnetService");

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

            if (!data.typeLocation) {
                throw ({ message: 'Le type de contrat est requis. ' });
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

            let tableau = appartement.typeLocation;
            let chaine = data.typeLocation;

            if (!tableau.includes(chaine)) {
                throw ({ message: 'Pour cette appartement le type de contrat  disponible est : ' + tableau.join(', ') + '.' });
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
                typeLocation: data.typeLocation,
                priceMonthly: appartement.loyer,
                priceDaily: Math.ceil(appartement.loyer / 30),
                priceHourly: Math.ceil(appartement.loyer / 720),
                locateur: data.userId,
                bailleur: appartement.immeuble.user,
                appartement: data.appartementId,
                dateStart: data.dateStart || new Date(),
            };

            // mettre un syst. de validation au moyen d'un payement avant la creation de location

            const location = await LocationRepo.create(locationData);

            await AppartementRepo.update(data.appartementId, { is_vacant: false });

            // Notifie le locataire que sa location est créée
            await NotificationService.notify(
                data.userId,
                `Nouveau contrat de location créé : ${appartement.name} à l'immeuble ${appartement.immeuble.name}`,
                'success',     // Type: success (création positive)
                'location',    // Source type
                location.id,   // Source ID
                `/location/${location.id}` // URL d'action
            );

            // Notifie le propriétaire qu'une location a été créée sur son bien
            if (appartement.immeuble.user) {
                const proprio = await UserRepo.findById(appartement.immeuble.user);
                const locataireName = `${proprio.name || ''} ${proprio.first_name || ''}`.trim();


                await NotificationService.notify(
                    proprio.id,
                    `Nouveau contrat : ${appartement.name} est loué ! Locataire : ${locataireName}. Détails de contact : ${proprio.phone} / ${proprio.email}`,
                    'info',      // Type: info (information)
                    'location',  // Source type
                    location.id, // Source ID
                    `/location/${location.id}` // URL d'action
                );
            }

            switch (data.typeLocation) {
                case 'mensuel':
                    await CarnetService.generateCarnets({ dateStart: location.dateStart, locationId: location.id, montant: location.priceMonthly });
                    break;
                case 'journalier':
                    await CarnetService.create({ dateStart: location.dateStart, locationId: location.id, montant: location.priceDaily });
                    break;
                case 'horaire':
                    await CarnetService.create({ dateStart: location.dateStart, locationId: location.id, montant: location.priceHourly });
                    break;
                default:
                    throw ({ message: 'Type de location invalide.' });
                    break;
            }

            return location;
        } catch (error) {
            throw error;
        }
    },

    update: async function (id, data) {
        try {

            const existingLocation = await LocationRepo.findById(id);

            if (!existingLocation) throw ({ message: 'La location n\'existe pas.' });

            if (!data.appartementId) throw ({ message: 'L\'appartement est requis.' });

            const appartement = await AppartementRepo.findById(data.appartementId);

            if (!appartement) throw ({ message: 'l\'appartement n\'exite pas.' });

            if (!data.userId) throw ({ message: 'L\'utilisateur est requis.' });

            const user = await UserRepo.findById(data.userId);

            if (!user) throw ({ message: 'l\'utilisateur n\'exite pas.' });

            if (user.status !== 'active') throw ({ message: 'l\'utilisateur n\'est pas active.' });

            if (user.is_active !== true) throw ({ message: 'l\'utilisateur n\'est pas actif.' });

            // if (user.role !== 'locataire') {
            //     throw ({ message: 'l\'utilisateur doit être un locataire.' });
            // }

            let tableau = appartement.typeLocation;
            let chaine = data.typeLocation;

            if (!tableau.includes(chaine)) {
                throw ({ message: 'Pour cette appartement le type de contrat  disponible est : ' + tableau.join(', ') + '.' });
            }

            const locationData = {
                caution: data.caution || locationId.caution,
                typeLocation: data.typeLocation,
                priceMonthly: appartement.loyer,
                priceDaily: appartement.loyer / 30,
                priceHourly: appartement.loyer / 720,
                user: data.userId,
                appartement: data.appartementId,
                dateStart: data.dateStart,
                dateEnd: data.dateEnd,
                status: data.status
            };


            // Notifie le locataire que son contrat a ete mis a jour

            await NotificationService.notify(
                data.userId,
                `Votre contrat de location pour ${appartement.name} a l'immeuble ${appartement.immeuble.name} a été mis à jour.`,
                'info',     // Type: success (création positive)
                'location',    // Source type
                updatedLocation.id, // Source ID
                `/location/${updatedLocation.id}` // URL d'action
            );

            // Notifie le proprietaire que le contrat a ete modifie
            if (appartement.immeuble.user) {
                const proprio = await UserRepo.findById(appartement.immeuble.user);

                const locataireName = `${proprio.name || ''} ${proprio.first_name || ''}`.trim();

                await NotificationService.notify(
                    proprio.id,
                    `Le contrat de location de ${locataireName || 'ce locataire'} pour l'appartement ${appartement.name} a été mis à jour.`,
                    'info',      // Type: info (information)
                    'location',  // Source type
                    updatedLocation.id, // Source ID
                    `/location/${updatedLocation.id}` // URL d'action
                );
            }


            return await LocationRepo.update(id, locationData);
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

    findByCriteria: async function (user, status, loyerMin, loyerMax, cautionMin, cautionMax, dateStart, dateEnd, page, limit, typeLocation) {
        try {
            return await LocationRepo.findByCriteria(user, status, loyerMin, loyerMax, cautionMin, cautionMax, dateStart, dateEnd, page, limit, typeLocation);
        } catch (error) {
            throw error;
        }
    },

    getMylocation: async function (user, status, loyerMin, loyerMax, cautionMin, cautionMax, dateStart, dateEnd, page, limit, typeLocation) {
        try {
            const userVerifier = await UserRepo.findById(user);

            if (!userVerifier) throw ({ message: 'l\'utilisateur n\'exite pas.' });

            if (userVerifier.status !== 'active') throw ({ message: 'l\'utilisateur n\'est pas active.' });

            if (userVerifier.is_active !== true) throw ({ message: 'l\'utilisateur n\'est pas actif.' });

            return await LocationRepo.findByCriteria(user, status, loyerMin, loyerMax, cautionMin, cautionMax, dateStart, dateEnd, page, limit, typeLocation);

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

    changeStatus: async function (id, status) {
        try {
            const location = await LocationRepo.findById(id);
            if (!location) throw ({ message: 'La location n\'existe pas.' });

            if (!['inactive'].includes(status)) throw ({ message: 'Status invalide.' });

            const updatedLocation = await LocationRepo.update(id, { status });
            await AppartementRepo.update(location.appartement.id, { is_vacant: true });

            await NotificationService.notify(
                location.user.id,
                `Le statut de votre contrat de location pour ${location.appartement.name} est maintenant : ${status}.`,
                'warning',
                'location',
                updatedLocation.id,
                `/location/${updatedLocation.id}`
            );

            const appartement = await AppartementRepo.findById(location.appartement.id);

            if (appartement && appartement.immeuble && appartement.immeuble.user) {
                const proprio = await UserRepo.findById(appartement.immeuble.user);

                if (proprio) {
                    const locataireName = `${location.user.name || ''} ${location.user.first_name || ''}`.trim();

                    await NotificationService.notify(
                        proprio.id,
                        `Le statut du contrat de location de ${locataireName || 'ce locataire'} pour l'appartement ${location.appartement.name} est maintenant : ${status}.`,
                        'warning',
                        'location',
                        updatedLocation.id,
                        `/location/${updatedLocation.id}`
                    );
                }
            }

            return updatedLocation;

        } catch (error) {
            throw error;
        }
    },



}
