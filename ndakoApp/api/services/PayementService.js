/**
 * PayementService.js
 *
 * @description :: Logique métier pour la gestion des paiements.
 */

const PayementRepo = require('../repositories/PayementRepo');
const NotificationService = require('./NotificationService');

module.exports = {

    /**
     * Créer un nouveau paiement
     */
    create: async function (data) {
        try {
            const { user, location, amount, motif, paymentMethod, date, carnet, reference, description } = data;

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

            // Vérifier que le carnet existe si fourni
            if (carnet) {
                const carnetRecord = await Carnet.findOne({ id: carnet });
                if (!carnetRecord) {
                    throw { status: 404, message: 'Carnet introuvable.' };
                }
            }

            const payementDate = date || new Date().toISOString();

            const payement = await PayementRepo.create({
                user,
                location,
                amount,
                motif,
                paymentMethod,
                date: payementDate,
                status: 'pending',
                carnet: carnet || null,
                reference: reference || null,
                description: description || null,
            });

            // Notification utilisateur
            try {
                await NotificationService.notify(user, `Paiement de ${amount} créé avec succès`, 'info', 'payement', payement.id, `/payement/${payement.id}`);
            } catch (notifError) {
                sails.log.error("Erreur notification paiement:", notifError);
            }

            return payement;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Créer un paiement directement depuis un carnet
     * @param {String} carnetId - ID du carnet
     * @param {Number} amount - Montant du paiement
     * @param {String} paymentMethod - Méthode de paiement
     * @param {String} userId - ID de l'utilisateur qui paie
     * @param {String} description - Description optionnelle
     */
    createFromCarnet: async function (carnetId, amount, paymentMethod, userId, description) {
        try {
            if (!carnetId) {
                throw { status: 400, message: 'ID carnet requis.' };
            }
            if (!amount || amount <= 0) {
                throw { status: 400, message: 'Montant invalide.' };
            }
            if (!paymentMethod) {
                throw { status: 400, message: 'Méthode de paiement requise.' };
            }
            if (!userId) {
                throw { status: 400, message: 'ID utilisateur requis.' };
            }

            const carnet = await Carnet.findOne({ id: carnetId });
            if (!carnet) {
                throw { status: 404, message: 'Carnet introuvable.' };
            }

            // Créer le paiement avec référence au carnet
            const payement = await this.create({
                user: userId,
                location: carnet.location,
                amount,
                motif: 'loyer',
                paymentMethod,
                date: new Date().toISOString(),
                carnet: carnetId,
                reference: `PAY-${carnetId}-${Date.now()}`,
                description: description || `Paiement pour carnet ${carnet.mois}/${carnet.year}`,
            });

            // Mettre automatiquement le statut à 'completed'
            const completed = await this.update(payement.id, { status: 'completed' });

            // Réconcilier les paiements du carnet
            await this.reconcileCarnetPayments(carnetId);

            return completed;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Réconcilier tous les paiements d'un carnet
     * Met à jour le statut du carnet en fonction des paiements reçus
     * @param {String} carnetId - ID du carnet
     */
    reconcileCarnetPayments: async function (carnetId) {
        try {
            if (!carnetId) {
                throw { status: 400, message: 'ID carnet requis.' };
            }

            const carnet = await Carnet.findOne({ id: carnetId });
            if (!carnet) {
                throw { status: 404, message: 'Carnet introuvable.' };
            }

            // Récupérer tous les paiements 'completed' pour ce carnet
            const payements = await PayementRepo.findByCarnet(carnetId);
            const completedPayments = payements.filter(p => p.status === 'completed');

            // Calculer le montant total payé
            const totalPaid = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
            const loyerAmount = carnet.loyer || 0;

            let newStatus = carnet.status;
            let montantCarnet = carnet.montant || 0;
            let resteCarnet = carnet.reste || loyerAmount;

            if (totalPaid >= loyerAmount) {
                newStatus = 'paid';
                montantCarnet = loyerAmount;
                resteCarnet = 0;
            } else if (totalPaid > 0) {
                newStatus = 'partial';
                montantCarnet = totalPaid;
                resteCarnet = loyerAmount - totalPaid;
            }

            // Mettre à jour le carnet si changement
            if (newStatus !== carnet.status || montantCarnet !== carnet.montant) {
                const updated = await Carnet.updateOne(carnetId).set({
                    status: newStatus,
                    montant: montantCarnet,
                    reste: resteCarnet,
                });

                // Notification si paiement complet
                if (newStatus === 'paid' && carnet.status !== 'paid') {
                    try {
                        await NotificationService.notify(carnet.locateur, `Votre carnet ${carnet.mois}/${carnet.year} est maintenant payé`, 'success', 'carnet', carnetId, `/carnet/${carnetId}`);
                        await NotificationService.notify(carnet.bailleur, `Paiement reçu pour carnet ${carnet.mois}/${carnet.year}`, 'success', 'carnet', carnetId, `/carnet/${carnetId}`);
                    } catch (notifError) {
                        sails.log.error("Erreur notification reconciliation:", notifError);
                    }
                }

                return updated;
            }

            return carnet;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Obtenir l'historique complet des paiements d'un carnet
     * @param {String} carnetId - ID du carnet
     */
    getPaymentHistory: async function (carnetId) {
        try {
            if (!carnetId) {
                throw { status: 400, message: 'ID carnet requis.' };
            }

            const carnet = await Carnet.findOne({ id: carnetId });
            if (!carnet) {
                throw { status: 404, message: 'Carnet introuvable.' };
            }

            const payements = await PayementRepo.findByCarnet(carnetId);

            // Grouper par statut
            const history = {
                carnet: carnet,
                totalLoyer: carnet.loyer || 0,
                totalPaid: 0,
                totalRefunded: 0,
                payements: {
                    completed: [],
                    pending: [],
                    failed: [],
                    refunded: []
                }
            };

            payements.forEach(p => {
                if (p.status === 'completed') {
                    history.totalPaid += p.amount;
                    history.payements.completed.push(p);
                } else if (p.status === 'refunded') {
                    history.totalRefunded += (p.refundedAmount || 0);
                    history.payements.refunded.push(p);
                } else if (p.status === 'pending') {
                    history.payements.pending.push(p);
                } else if (p.status === 'failed') {
                    history.payements.failed.push(p);
                }
            });

            history.remainingAmount = Math.max(0, history.totalLoyer - history.totalPaid + history.totalRefunded);
            history.isFullyPaid = history.remainingAmount === 0;

            return history;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Traiter la fin d'un paiement (marquer comme complété et réconcilier)
     * @param {String} payementId - ID du paiement
     */
    processPaymentCompletion: async function (payementId) {
        try {
            if (!payementId) {
                throw { status: 400, message: 'ID paiement requis.' };
            }

            const payement = await PayementRepo.findById(payementId);
            if (!payement) {
                throw { status: 404, message: 'Paiement introuvable.' };
            }

            // Mettre à jour le statut à 'completed'
            const completed = await this.update(payementId, { status: 'completed' });

            // Réconcilier si carnet associé
            if (completed.carnet) {
                await this.reconcileCarnetPayments(completed.carnet);
            }

            return completed;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Traiter un remboursement
     * @param {String} payementId - ID du paiement original
     * @param {Number} refundAmount - Montant à rembourser
     * @param {String} refundReason - Raison du remboursement
     */
    refundPayment: async function (payementId, refundAmount, refundReason) {
        try {
            if (!payementId) {
                throw { status: 400, message: 'ID paiement requis.' };
            }

            const payement = await PayementRepo.findById(payementId);
            if (!payement) {
                throw { status: 404, message: 'Paiement introuvable.' };
            }

            if (!refundAmount || refundAmount <= 0) {
                throw { status: 400, message: 'Montant de remboursement invalide.' };
            }

            if (refundAmount > payement.amount) {
                throw { status: 400, message: 'Le montant du remboursement ne peut pas dépasser le montant original.' };
            }

            // Mettre à jour le paiement
            const refunded = await this.update(payementId, {
                status: 'refunded',
                refundedAmount: refundAmount,
                refundReason: refundReason || 'Non spécifié',
                refundDate: new Date().toISOString(),
            });

            // Réconcilier le carnet si associé
            if (refunded.carnet) {
                await this.reconcileCarnetPayments(refunded.carnet);
            }

            // Notification utilisateur
            try {
                await NotificationService.notify(
                    payement.user,
                    `Remboursement de ${refundAmount} traité. Raison: ${refundReason || 'Non spécifié'}`,
                    'info',
                    'payement',
                    payementId,
                    `/payement/${payementId}`
                );
            } catch (notifError) {
                sails.log.error("Erreur notification refund:", notifError);
            }

            return refunded;
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
            }).populate('user').populate('location').populate('carnet').sort('createdAt DESC');

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
