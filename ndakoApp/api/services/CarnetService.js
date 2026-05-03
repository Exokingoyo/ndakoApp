const CarnetRepo = require("../repositories/CarnetRepo");
const LocationRepo = require("../repositories/LocationRepo");
const UserRepo = require("../repositories/UserRepo");
const AppartementRepo = require("../repositories/AppartementRepo");
const NotificationService = require("./NotificationService");

module.exports = {

    create: async function (data) {

    },

    update: async function (id, data) {
        try {
            const existing = await CarnetRepo.findById(id);
            if (!existing) throw ({ message: 'Le carnet n\'existe pas.' });

            const updated = await CarnetRepo.update(id, {
                ...data
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

    findByCriteria: async function (page, limit, bailleur, locateur, status, year, mois) {
        try {
            return await CarnetRepo.findByCriteria(page, limit, bailleur, locateur, status, year, mois);
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
    },

    /**
     * Récupère les carnets en retard (non payés ou partiels dont la date d'échéance est passée)
     * @returns {Promise<Array>} tableau de carnets
     */
    findOverdueCarnets: async function () {
        try {
            return await CarnetRepo.findOverdue();
        } catch (error) {
            throw error;
        }
    },

    /**
     * Récupère le prochain carnet dû pour une location donnée
     * @param {String} locationId
     * @returns {Promise<Object|null>} carnet ou null
     */
    getNextDueForLocation: async function (locationId) {
        try {
            if (!locationId) throw ({ message: 'La location est requise.' });
            return await CarnetRepo.findNextDue(locationId);
        } catch (error) {
            throw error;
        }
    },

    addCarnet: async function (locationId, mois = 1) {
        try {
            if (!locationId) throw ({ message: 'La location est requise pour générer les carnets.' });

            const location = await LocationRepo.findById(locationId);
            if (!location) throw ({ message: 'La location spécifiée n\'existe pas.' });
            if (location.status != "active") throw ({ message: 'La location spécifiée n\'est pas active.' });

            // Récupérer l'appartement pour le loyer par défaut
            const loyerParDefaut = location.priceMonthly;

            // récupérer les carnets existants pour déterminer la prochaine échéance
            const existing = await CarnetRepo.findByLocation(locationId) || [];

            let baseDate;
            if (existing.length > 0) {
                // trouver le carnet avec la dernière date d'échéance
                const latest = existing.reduce((a, b) => {
                    return (new Date(a.dateECheance) > new Date(b.dateECheance)) ? a : b;
                });
                baseDate = new Date(latest.dateECheance);
                // commencer au mois suivant
                baseDate.setMonth(baseDate.getMonth() + 1);
            } else {
                // si pas de carnet existant, prendre la date de début du contrat ou aujourd'hui
                baseDate = location.startDate ? new Date(location.startDate) : new Date();
            }

            if (isNaN(baseDate.getTime())) throw ({ message: 'dateStart invalide.' });

            const creationsPromises = [];

            // jour de référence pour conserver le même jour du mois
            const referenceDay = baseDate.getDate();

            const bailleurId = location.bailleur.id;
            const locateurId = location.locateur.id;

            let currentDate = new Date(baseDate);

            for (let i = 0; i < mois; i++) {
                // copie
                const tempDate = new Date(currentDate);
                const lastDayOfMonth = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate();
                tempDate.setDate(Math.min(referenceDay, lastDayOfMonth));

                const carnetData = {
                    dateStart: location.startDate || new Date().toISOString(),
                    montant: 0,
                    loyer: loyerParDefaut,
                    datePayement: null,
                    dateECheance: tempDate.toISOString(),
                    reste: loyerParDefaut,
                    status: 'unpaid',
                    bailleur: bailleurId,
                    locateur: locateurId,
                    location: locationId,
                    mois: tempDate.getMonth() + 1,
                    year: tempDate.getFullYear()
                };

                // éviter doublon pour même location/mois/année
                const exists = await CarnetRepo.findByLocationAndPeriod(locationId, carnetData.mois, carnetData.year);
                if (!exists) creationsPromises.push(CarnetRepo.create(carnetData));

                // avancer au mois suivant
                currentDate.setMonth(currentDate.getMonth() + 1);
            }

            // créationsPromises contient soit des Promises (si on a déjà appelé CarnetRepo.create) soit des objets
            // ici nous avons poussé directement la Promise de create quand besoin, donc on attend tout
            const creations = await Promise.all(creationsPromises);

            // notifications pour chaque carnet créé
            await Promise.all(creations.map(async (c) => {
                await NotificationService.notify(
                    bailleurId,
                    `Carnet créé pour ${location.appartement ? (location.appartement.name || '') : 'votre bien'} - ${c.mois || ''}/${c.year || ''}`,
                    'info',
                    'carnet',
                    c.id,
                    `/carnet/${c.id}`
                );

                await NotificationService.notify(
                    locateurId,
                    `Nouveau carnet disponible pour ${c.mois || ''}/${c.year || ''}`,
                    'info',
                    'carnet',
                    c.id,
                    `/carnet/${c.id}`
                );
            }));

            return creations;
        } catch (error) {
            throw error;
        }
    },

    // Génère 12 carnets mensuels à partir d'une date de départ pour une location donnée
    // - { dateStart, locationId, montant }
    // - `dateStart` : date de départ (string ou Date) utilisée pour calculer les échéances
    // - `locationId` : identifiant de la `Location` qui contient les références `bailleur` et `locateur`
    // - `montant` : optionnel, montant du loyer mensuel (si absent, utilise `appartement.loyer`)
    // Retourne un tableau des carnets créés.
    generateCarnets: async function ({ locationId, dateStart, montant }) {
        try {
            // validations
            if (!locationId) throw ({ message: 'La location est requise pour générer les carnets.' });

            const location = await LocationRepo.findById(locationId);
            if (!location) throw ({ message: 'La location spécifiée n\'existe pas.' });

            const start = dateStart ? new Date(dateStart) : new Date();
            if (isNaN(start.getTime())) throw ({ message: 'dateStart invalide.' });

            const loyers = [];
            const day = start.getDate();

            let currentDate = new Date(start);

            for (let i = 0; i < 12; i++) {
                // Avancer au mois suivant sauf pour la première itération
                if (i > 0) currentDate.setMonth(currentDate.getMonth() + 1);

                let tempDate = new Date(currentDate);
                const year = tempDate.getFullYear();
                const month = tempDate.getMonth();
                const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
                tempDate.setDate(Math.min(day, lastDayOfMonth));

                const loyerMensuel = (typeof montant !== 'undefined') ? montant : (location.montant || 0);

                // PRORATA
                let loyerFinal = loyerMensuel;
                let resteFinal = loyerMensuel;
                let isProrata = false;

                if (i === 0) {
                    const joursOccupes = lastDayOfMonth - day + 1;
                    loyerFinal = (loyerMensuel / lastDayOfMonth) * joursOccupes;
                    loyerFinal = Math.round(loyerFinal);
                    resteFinal = loyerFinal;
                }

                const carnetData = {
                    dateStart: start.toISOString(),
                    montant: 0,
                    loyer: loyerFinal,
                    datePayement: null,
                    dateECheance: tempDate.toISOString(),
                    reste: resteFinal,
                    status: 'unpaid',
                    bailleur: location.bailleur.id,
                    locateur: location.locateur.id,
                    location: locationId,
                    mois: tempDate.getMonth() + 1,
                    year: tempDate.getFullYear(),
                    prorata: isProrata
                };

                // push plain object, we'll insert in transaction
                loyers.push(carnetData);
            }

            const carnets = await Promise.all(loyers.map(carnet => CarnetRepo.create(carnet)));

            // Notifications (hors transaction pour ne pas rollback si notification échoue)
            await Promise.all((carnets || []).map(async (c) => {
                await NotificationService.notify(
                    c.bailleur,
                    `Carnet créé pour ${location.appartement ? (location.appartement.name || '') : 'votre bien'} - ${c.mois || ''}/${c.year || ''}`,
                    'info',
                    'carnet',
                    c.id,
                    `/carnet/${c.id}`
                );

                await NotificationService.notify(
                    c.locateur,
                    `Nouveau carnet disponible pour ${c.mois || ''}/${c.year || ''}`,
                    'info',
                    'carnet',
                    c.id,
                    `/carnet/${c.id}`
                );
            }));

            return carnets;
        } catch (error) {
            throw error;
        }
    },

    // Ajouté: Enregistrer un paiement partiel ou total et mettre à jour le statut
    // Cette fonction applique le paiement, calcule le nouveau `reste` et met à jour `status`.
    // Elle envoie aussi une notification aux parties prenantes.
    addPayment: async function (carnetId, montant, paymentDate) {
        try {
            if (!carnetId) throw new Error({ message: 'Carnet id requis.' });
            if (!montant || isNaN(montant)) throw new Error({ message: 'Montant invalide.' });
            const carnet = await CarnetRepo.findById(carnetId);
            if (!carnet) throw ({ message: 'Carnet introuvable.' });

            const newMontant = (carnet.montant || 0) + montant;
            const nouveauReste = (carnet.loyer || 0) - newMontant;

            const status = nouveauReste <= 0 ? 'paid' : (newMontant > 0 ? 'partial' : carnet.status);

            const updated = await CarnetRepo.update(carnetId, {
                montant: newMontant,
                reste: nouveauReste,
                datePayement: paymentDate || new Date().toISOString(),
                status
            });

            // notifications
            await NotificationService.notify(
                updated.proprietaire.id,
                `Paiement reçu (${montant}) pour carnet ${updated.mois || ''}/${updated.year || ''}`,
                'info',
                'carnet',
                updated.id,
                `/carnet/${updated.id}`
            );

            await NotificationService.notify(
                updated.locateur.id,
                `Votre paiement de ${montant} a été pris en compte`,
                'info',
                'carnet',
                updated.id,
                `/carnet/${updated.id}`
            );

            return updated;
        } catch (error) {
            throw error;
        }
    },

    // Ajouté: Marquer un carnet comme entièrement payé (utilise update interne)
    markAsPaid: async function (carnetId, paidDate) {
        try {
            const carnet = await CarnetRepo.findById(carnetId);
            if (!carnet) throw ({ message: 'Carnet introuvable.' });

            const updated = await CarnetRepo.update(carnetId, {
                montant: carnet.loyer || carnet.montant || 0,
                reste: 0,
                status: 'paid',
                datePayement: paidDate || new Date().toISOString()
            });

            await NotificationService.notify(
                updated.proprietaire.id,
                `Carnet ${updated.mois || ''}/${updated.year || ''} marqué comme payé`,
                'info',
                'carnet',
                updated.id,
                `/carnet/${updated.id}`
            );

            await NotificationService.notify(
                updated.locateur.id,
                `Votre carnet a été marqué comme payé`,
                'info',
                'carnet',
                updated.id,
                `/carnet/${updated.id}`
            );

            return updated;
        } catch (error) {
            throw error;
        }
    }

};
