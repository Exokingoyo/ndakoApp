
/**
 * IncidentRepo.js
 * 
 * @description :: Couche d'accès aux données (Data Access Layer)
 * Gère toutes les interactions directes avec la base de données pour les incidents
 */

module.exports = {

    /**
     * Crée un nouvel incident en base de données
     * @param {Object} data - Les données de l'incident (title, description, category, appartement, user)
     * @returns {Object} L'incident créé avec son ID
     */
    create: async function (data) {
        try {
            return await Incident.create(data).fetch();
        } catch (error) {
            throw error;
        }
    },

    /**
     * Met à jour un incident existant
     * @param {String} id - ID de l'incident
     * @param {Object} data - Les champs à mettre à jour (status, priority, etc.)
     * @returns {Object} L'incident mis à jour
     */
    update: async function (id, data) {
        try {
            return await Incident.updateOne(id).set(data);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Trouve tous les incidents signalés par un utilisateur
     * Utile pour l'interface du locataire qui voit ses incidents
     * @param {String} userId - ID de l'utilisateur
     * @returns {Array} Liste des incidents avec les relations (appartement, user)
     */
    findByUser: async function (userId) {
        try {
            return await Incident.find({ user: userId })
                .populate('appartement')
                .populate('user')
                .sort('createdAt DESC');
        } catch (error) {
            throw error;
        }
    },

    /**
     * Trouve tous les incidents d'un immeuble
     * Logique métier: cherche les appartements de l'immeuble puis leurs incidents
     * Utile pour le dashboard du propriétaire
     * @param {String} immeubleId - ID de l'immeuble
     * @returns {Array} Liste des incidents triés par date décroissante
     */
    findByImmeuble: async function (immeubleId) {
        try {
            // Étape 1: Récupère tous les appartements de l'immeuble
            const appartements = await Appartement.find({ immeuble: immeubleId }).select('id');
            const appartementIds = appartements.map(a => a.id);
            
            // Étape 2: S'il n'y a pas d'appartements, retourne un tableau vide
            if (appartementIds.length === 0) return [];
            
            // Étape 3: Retourne les incidents de ces appartements
            return await Incident.find({ appartement: appartementIds })
                .populate('user')
                .populate('appartement')
                .sort('createdAt DESC');
        } catch (error) {
            throw error;
        }
    },

    /**
     * Récupère un incident spécifique avec toutes ses relations
     * @param {String} id - ID de l'incident
     * @returns {Object} L'incident avec user, appartement et assignedTo peuplées
     */
    findById: async function (id) {
        try {
            return await Incident.findOne({ id })
                .populate('user')
                .populate('appartement')
        } catch (error) {
            throw error;
        }
    },

    /**
     * Affecte un technicien/agent à un incident
     * Fondamental pour la gestion du workflow: marquer qui travaille sur le problème
     * @param {String} id - ID de l'incident
     * @param {String} technicianId - ID du technicien à affecter
     * @returns {Object} L'incident mis à jour
     */
    assignTechnician: async function (id, technicianId) {
        try {
            return await Incident.updateOne(id).set({ assignedTo: technicianId });
        } catch (error) {
            throw error;
        }
    },

    /**
     * Ajoute un commentaire/note à l'incident
     * Les commentaires sont stockés dans un tableau JSON pour la traçabilité
     * Chaque commentaire inclut l'auteur, le texte et la date
     * @param {String} id - ID de l'incident
     * @param {Object} commentObj - {author, text, createdAt}
     * @returns {Object} L'incident avec le nouveau commentaire
     */
    addComment: async function (id, commentObj) {
        try {
            const incident = await Incident.findOne({ id });
            const comments = incident.comments || [];
            comments.push(commentObj);
            return await Incident.updateOne(id).set({ comments });
        } catch (error) {
            throw error;
        }
    },

    /**
     * Escalade: augmente la priorité d'un incident à "high"
     * Utilisé quand un incident doit recevoir plus d'attention immédiatement
     * @param {String} id - ID de l'incident
     * @returns {Object} L'incident avec la nouvelle priorité
     */
    escalate: async function (id) {
        try {
            return await Incident.updateOne(id).set({ priority: 'high' });
        } catch (error) {
            throw error;
        }
    },

    /**
     * Retourne les statistiques: compte d'incidents par statut
     * Utile pour les tableaux de bord et KPIs
     * @returns {Object} {open: X, in_progress: X, resolved: X, closed: X}
     */
    statsByStatus: async function () {
        try {
            const statuses = ['open', 'in_progress', 'resolved', 'closed'];
            const result = {};
            for (const s of statuses) {
                result[s] = await Incident.count({ status: s });
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Retourne les incidents d'une priorité donnée
     * Permet de filtrer les incidents critiques pour action rapide
     * @param {String} priority - 'low', 'medium', 'high'
     * @returns {Array} Liste des incidents filtrés par priorité
     */
    findByPriority: async function (priority) {
        try {
            return await Incident.find({ priority })
                .populate('user')
                .populate('appartement')
                .populate('assignedTo')
                .sort('createdAt DESC');
        } catch (error) {
            throw error;
        }
    },

    /**
     * Retourne les incidents non résolus (open + in_progress)
     * Utile pour les notifications et alertes
     * @returns {Array} Liste des incidents actifs
     */
    findOpen: async function () {
        try {
            return await Incident.find({ status: ['open', 'in_progress'] })
                .populate('user')
                .populate('appartement')
                .populate('assignedTo')
                .sort('priority DESC')
                .sort('createdAt DESC');
        } catch (error) {
            throw error;
        }
    }

};
