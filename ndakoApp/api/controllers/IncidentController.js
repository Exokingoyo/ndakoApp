
const IncidentService = require("../services/IncidentService");
const IncidentRepo = require("../repositories/IncidentRepo");

/**
 * IncidentController.js
 * 
 * @description :: Contrôleur HTTP (Presentation Layer)
 * Expose les endpoints REST et gère les requêtes/réponses HTTP
 * Chaque fonction corresponds à une route/endpoint
 */

module.exports = {

    /**
     * POST /incident/report
     * Permet à un locataire de signaler un nouvel incident
     * Paramètres en body: title, description, category, appartementId
     */
    report: async function (req, res) {
        try {
            const { title, description, category, appartementId } = req.body;
            const userId = req.session.user.id;
            const incident = await IncidentService.reportIncident(
                title,
                description,
                category,
                appartementId,
                userId
            );
            return res.ok(incident);
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * PATCH /incident/:id/status
     * Met à jour le statut d'un incident
     * Paramètres: id (URL), status (body)
     * Effectue les validations de transition avant la mise à jour
     */
    updateStatus: async function (req, res) {
        try {
            const { status } = req.body;
            const updated = await IncidentService.updateStatus(req.params.id, status, req.session.user.id);
            return res.ok(updated);
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * GET /incident/my-incidents
     * Retourne tous les incidents signalés par l'utilisateur connecté
     * Utile pour l'interface du locataire: "Mes signalements"
     */
    getMyIncidents: async function (req, res) {
        try {
            const incidents = await IncidentRepo.findByUser(req.session.user.id);
            return res.ok(incidents);
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * PATCH /incident/:id/assign
     * Affecte un technicien à un incident
     * Paramètres: id (URL), technicianId (body)
     * Le technicien recevra une notification
     */
    assign: async function (req, res) {
        try {
            const { technicianId } = req.body;
            const updated = await IncidentService.assignTechnician(req.params.id, technicianId, req.session.user.id);
            return res.ok(updated);
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * POST /incident/:id/comment
     * Ajoute un commentaire/note à un incident
     * Paramètres: id (URL), text (body)
     * Création d'une trace du suivi de l'incident
     */
    comment: async function (req, res) {
        try {
            const { text } = req.body;
            const updated = await IncidentService.addComment(req.params.id, req.session.user.id, text);
            return res.ok(updated);
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * PATCH /incident/:id/escalate
     * Escalade un incident en priorité haute
     * Pour les problèmes critiques nécessitant une action rapide
     */
    escalate: async function (req, res) {
        try {
            const updated = await IncidentService.escalateIncident(req.params.id, req.session.user.id);
            return res.ok(updated);
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * GET /incident/stats
     * Retourne les statistiques d'incidents par statut
     * {open: 5, in_progress: 3, resolved: 20, closed: 40}
     * Utile pour les tableaux de bord
     */
    stats: async function (req, res) {
        try {
            const stats = await IncidentService.getStatsByStatus();
            return res.ok(stats);
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * GET /incident/immeuble/:immeubleId
     * Retourne tous les incidents d'un immeuble spécifique
     * Utile pour le propriétaire qui gère ses immeubles
     */
    byImmeuble: async function (req, res) {
        try {
            const incidents = await IncidentService.getByImmeuble(req.params.immeubleId);
            return res.ok(incidents);
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * GET /incident/priority/high
     * Retourne tous les incidents de priorité haute
     * Utile pour les alertes urgentes
     */
    highPriority: async function (req, res) {
        try {
            const incidents = await IncidentService.getHighPriorityIncidents();
            return res.ok(incidents);
        } catch (error) {
            return res.serverError(error);
        }
    },

    /**
     * GET /incident/active
     * Retourne les incidents actifs (non fermés)
     * Pour le dashboard opérationnel
     */
    active: async function (req, res) {
        try {
            const incidents = await IncidentService.getOpenIncidents();
            return res.ok(incidents);
        } catch (error) {
            return res.serverError(error);
        }
    }

};
