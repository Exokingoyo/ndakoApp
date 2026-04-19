/**
 * PayementService.js
 *
 * @description :: Logique métier pour la gestion des paiements.
 */

const PayementRepo = require('../repositories/PayementRepo');

module.exports = {

    /**
     * Créer un nouveau paiement
     */
    create: async function (data) {
        try {
            const { user, location, amount, motif, paymentMethod, date } = data;

            if (!user) {
                throw { status: 400, message: 'ID utilisateur requis.' };
            }
            if (!location) {
                throw { status: 400, message: 'ID de location requis.' };
            }
            if (!amount || amount <= 0) {
                throw { status: 400, message: 'Montant invalide.' };
            }
            if (!motif) {
                throw { status: 400, message: 'Motif du paiement requis.' };
            }
            if (!paymentMethod) {
                throw { status: 400, message: 'Méthode de paiement requise.' };
            }

            // Vérifier que la location existe
            const loc = await Location.findOne({ id: location });
            if (!loc) {
                throw { status: 404, message: 'Contrat de location introuvable.' };
            }

            const payementDate = date || new Date().toISOString();

            return await PayementRepo.create({
                user,
                location,
                amount,
                motif,
                paymentMethod,
                date: payementDate,
                status: 'pending',
            });
        } catch (error) {
            throw error;
        }
    },

    /**
     * Mettre à jour un paiement
     */
    update: async function (id, data) {
        try {
            if (!id) {
                throw { status: 400, message: 'ID du paiement requis.' };
            }

            const payement = await PayementRepo.findById(id);
            if (!payement) {
                throw { status: 404, message: 'Paiement introuvable.' };
            }

            return await PayementRepo.update(id, data);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Récupérer les paiements d'un utilisateur avec pagination et filtres
     */
    findByUser: async function (page, limit, userId, filters = {}) {
        try {
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;

            if (!userId) {
                throw { status: 400, message: 'ID utilisateur requis.' };
            }

            const whereClause = {
                user: userId,
                ...(filters.motif ? { motif: filters.motif } : {}),
                ...(filters.status ? { status: filters.status } : {}),
                ...(filters.paymentMethod ? { paymentMethod: filters.paymentMethod } : {}),
                ...(filters.location ? { location: filters.location } : {}),
            };

            const total = await Payement.count(whereClause);
            const payements = await Payement.find({
                where: whereClause,
                skip: (page - 1) * limit,
                limit,
            }).populate('user').populate('location').sort('createdAt DESC');

            return {
                payements,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        } catch (error) {
            throw error;
        }
    },

    findById: async function (id) {
        try {
            return await PayementRepo.findById(id);
        } catch (error) {
            throw error;
        }
    },

};
