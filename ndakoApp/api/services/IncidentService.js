
const IncidentRepo = require("../repositories/IncidentRepo");
const NotificationService = require("./NotificationService");
const AppartementRepo = require("../repositories/AppartementRepo");

/**
 * IncidentService.js
 * 
 * @description :: Couche métier (Business Logic Layer)
 * Contient toute la logique métier: validations, règles de transition, notifications
 */

module.exports = {

    /**
     * Signale un nouvel incident
     * Crée l'incident en BDD et notifie le propriétaire de l'immeuble
     * @param {String} title - Titre du problème
     * @param {String} description - Description détaillée
     * @param {String} category - Catégorie (plumbing, electricity, structural, other)
     * @param {String} appartementId - ID de l'appartement concerné
     * @param {String} userId - ID du locataire qui signale
     * @returns {Object} L'incident créé
     */
    reportIncident: async function (title, description, category, appartementId, userId) {
        try {
            // Validation des paramètres requis
            if (!title) throw { status: 400, message: 'Le titre est requis' };
            if (!description) throw { status: 400, message: 'La description est requise' };
            if (!category) throw { status: 400, message: 'La catégorie est requise' };
            if (!appartementId) throw { status: 400, message: 'L\'appartement est requis' };
            if (!userId) throw { status: 400, message: 'L\'utilisateur est requis' };

            // Crée l'incident en BDD
            const incident = await IncidentRepo.create({
                title: title,
                description: description,
                category: category,
                appartement: appartementId,
                user: userId
            });

            // Récupère l'appartement pour trouver le propriétaire de l'immeuble
            const appartement = await AppartementRepo.findById(appartementId);

            // Notifie le propriétaire de l'immeuble (règle métier importante)
            if (appartement && appartement.immeuble.user) {
                await NotificationService.notify(
                    appartement.immeuble.user,
                    `Nouvel incident signalé : ${incident.title} signalé à l\'immeuble ${appartement.immeuble.name} , Appartement ${appartement.name}`,
                    'warning'
                );
            }

            return incident;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Met à jour le statut d'un incident
     * Valide les transitions de statut et notifie le reporter
     * @param {String} incidentId - ID de l'incident
     * @param {String} status - Nouveau statut (open, in_progress, resolved, closed)
     * @param {String} userId - ID de l'utilisateur qui fait le changement
     * @returns {Object} L'incident mis à jour
     */
    updateStatus: async function (incidentId, status, userId) {
        try {
            const incident = await IncidentRepo.findById(incidentId);
            if (!incident) throw { status: 404, message: 'Incident non trouvé' };

            // Vérifie que la transition est valide
            const allowed = this.validateStatusTransition(incident.status, status);
            if (!allowed) throw { status: 400, message: 'Transition de statut non autorisée' };

            // Met à jour l'incident
            const updatedIncident = await IncidentRepo.update(incidentId, { status });

            // Notifie le reporter (le locataire)
            await NotificationService.notify(
                incident.user.id,
                `Le statut de votre incident "${incident.title}" est maintenant : ${status}`,
                'info'
            );

            return updatedIncident;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Valide les transitions autorisées entre statuts
     * Règle métier: définit le workflow d'un incident
     * @param {String} from - Statut actuel
     * @param {String} to - Nouveau statut souhaité
     * @returns {Boolean} true si la transition est autorisée, false sinon
     */
    validateStatusTransition: function (from, to) {
        // Définit le graphe de transitions possibles
        const transitionMap = {
            open: ['in_progress', 'resolved', 'closed'],           // Un incident peut passer en cours ou être résolu directement
            in_progress: ['resolved', 'closed'],                    // En cours -> résolu ou fermé
            resolved: ['closed', 'in_progress'],                    // Résolu peut être fermeture ou relancer si nouveau problème
            closed: ['in_progress']                                 // Fermé ne peut que rouvrir
        };
        return transitionMap[from] ? transitionMap[from].includes(to) : false;
    },



    /**
     * Escalade: augmente la priorité d'un incident
     * Utilisé pour les problèmes critiques qui nécessitent une action immédiate
     * @param {String} incidentId - ID de l'incident
     * @param {String} userId - ID de la personne qui escalade
     * @returns {Object} L'incident avec la nouvelle priorité 'high'
     */
    escalateIncident: async function (incidentId, userId) {
        try {
            const incident = await IncidentRepo.findById(incidentId);
            if (!incident) throw { status: 404, message: 'Incident non trouvé' };

            const updated = await IncidentRepo.escalate(incidentId);

            // Notifie les personnes concernées de l'escalade
            await NotificationService.notify(
                incident.user.id,
                `Votre incident "${incident.title}" a été escaladé en priorité élevée.`,
                'warning'
            );

            return updated;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Statistiques rapides par statut
     * Utile pour les tableaux de bord et monitoring
     * @returns {Object} {open: X, in_progress: Y, resolved: Z, closed: W}
     */
    getStatsByStatus: async function () {
        try {
            return await IncidentRepo.statsByStatus();
        } catch (error) {
            throw error;
        }
    },

    /**
     * Retourne la liste des incidents d'un immeuble
     * Utile pour le propriétaire qui gère ses incidents
     * @param {String} immeubleId - ID de l'immeuble
     * @returns {Array} Liste des incidents de cet immeuble
     */
    getByImmeuble: async function (immeubleId) {
        try {
            return await IncidentRepo.findByImmeuble(immeubleId);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Retourne les incidents de priorité haute
     * Utile pour les alertes et notifications urgentes
     * @returns {Array} Liste des incidents critiques
     */
    getHighPriorityIncidents: async function () {
        try {
            return await IncidentRepo.findByPriority('high');
        } catch (error) {
            throw error;
        }
    },

    /**
     * Retourne les incidents actifs (ouverts ou en cours)
     * Utile pour les tableaux de bord opérationnels
     * @returns {Array} Liste des incidents non fermés
     */
    getOpenIncidents: async function () {
        try {
            return await IncidentRepo.findOpen();
        } catch (error) {
            throw error;
        }
    }

};
