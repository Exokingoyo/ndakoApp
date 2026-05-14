/**
 * CarnetPaymentHelper.js
 *
 * @description :: Utilitaires pour lier et synchroniser les paiements avec les carnets
 */

const PayementRepo = require('../repositories/PayementRepo');
const NotificationService = require('../services/NotificationService');

module.exports = {

    /**
     * Lier un paiement à un carnet
     * @param {String} payementId - ID du paiement
     * @param {String} carnetId - ID du carnet
     */
    linkPaymentToCarnet: async function (payementId, carnetId) {
        try {
            if (!payementId || !carnetId) {
                throw new Error('Payment ID and Carnet ID are required');
            }

            const payement = await PayementRepo.findById(payementId);
            if (!payement) {
                throw new Error('Payment not found');
            }

            const carnet = await Carnet.findOne({ id: carnetId });
            if (!carnet) {
                throw new Error('Carnet not found');
            }

            // Mettre à jour le paiement avec le carnet
            const updated = await PayementRepo.update(payementId, { carnet: carnetId });

            return updated;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Récupérer tous les paiements manquants d'un carnet
     * @param {String} carnetId - ID du carnet
     */
    getMissingPayments: async function (carnetId) {
        try {
            if (!carnetId) {
                throw new Error('Carnet ID is required');
            }

            const carnet = await Carnet.findOne({ id: carnetId });
            if (!carnet) {
                throw new Error('Carnet not found');
            }

            const loyerAmount = carnet.loyer || 0;
            const payements = await PayementRepo.findByCarnet(carnetId);
            const completedPayments = payements.filter(p => p.status === 'completed');
            const totalPaid = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

            const missing = loyerAmount - totalPaid;

            return {
                carnetId: carnetId,
                loyerAmount: loyerAmount,
                totalPaid: totalPaid,
                missingAmount: Math.max(0, missing),
                hasOutstandingPayments: missing > 0,
                paymentCount: payements.length,
                completedCount: completedPayments.length
            };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Vérifier si un carnet est entièrement payé
     * @param {String} carnetId - ID du carnet
     */
    isCarnetFullyPaid: async function (carnetId) {
        try {
            if (!carnetId) {
                throw new Error('Carnet ID is required');
            }

            const carnet = await Carnet.findOne({ id: carnetId });
            if (!carnet) {
                throw new Error('Carnet not found');
            }

            const loyerAmount = carnet.loyer || 0;
            const payements = await PayementRepo.findCompletedByCarnet(carnetId);
            const totalPaid = payements.reduce((sum, p) => sum + (p.amount || 0), 0);

            return totalPaid >= loyerAmount;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Synchroniser automatiquement le statut d'un carnet basé sur ses paiements
     * @param {String} carnetId - ID du carnet
     */
    syncCarnetStatus: async function (carnetId) {
        try {
            if (!carnetId) {
                throw new Error('Carnet ID is required');
            }

            const carnet = await Carnet.findOne({ id: carnetId });
            if (!carnet) {
                throw new Error('Carnet not found');
            }

            const loyerAmount = carnet.loyer || 0;
            const payements = await PayementRepo.findByCarnet(carnetId);
            const completedPayments = payements.filter(p => p.status === 'completed');
            const totalPaid = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

            let newStatus = carnet.status;
            let newMontant = carnet.montant || 0;
            let newReste = carnet.reste || loyerAmount;

            if (totalPaid >= loyerAmount) {
                newStatus = 'paid';
                newMontant = loyerAmount;
                newReste = 0;
            } else if (totalPaid > 0) {
                newStatus = 'partial';
                newMontant = totalPaid;
                newReste = loyerAmount - totalPaid;
            } else {
                newStatus = 'unpaid';
                newMontant = 0;
                newReste = loyerAmount;
            }

            // Mettre à jour si changement
            if (newStatus !== carnet.status || newMontant !== carnet.montant) {
                const updated = await Carnet.updateOne(carnetId).set({
                    status: newStatus,
                    montant: newMontant,
                    reste: newReste,
                });

                // Notification pour paiement complet
                if (newStatus === 'paid' && carnet.status !== 'paid') {
                    try {
                        await NotificationService.notify(
                            carnet.locateur,
                            `Carnet ${carnet.mois}/${carnet.year} entièrement payé - merci!`,
                            'success',
                            'carnet',
                            carnetId,
                            `/carnet/${carnetId}`
                        );
                        await NotificationService.notify(
                            carnet.bailleur,
                            `Paiement complet reçu pour carnet ${carnet.mois}/${carnet.year}`,
                            'success',
                            'carnet',
                            carnetId,
                            `/carnet/${carnetId}`
                        );
                    } catch (notifError) {
                        sails.log.error("Erreur notification sync:", notifError);
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
     * Générer un rapport de paiement pour une location
     * @param {String} locationId - ID de la location
     * @param {Number} year - Année (optionnel, par défaut année courante)
     */
    generatePaymentReport: async function (locationId, year) {
        try {
            if (!locationId) {
                throw new Error('Location ID is required');
            }

            const reportYear = year || new Date().getFullYear();
            const location = await Location.findOne({ id: locationId });
            if (!location) {
                throw new Error('Location not found');
            }

            // Récupérer tous les carnets pour cette location et année
            const carnets = await Carnet.find({ location: locationId, year: reportYear });

            const report = {
                locationId: locationId,
                year: reportYear,
                totalCarnets: carnets.length,
                stats: {
                    paidCount: 0,
                    partialCount: 0,
                    unpaidCount: 0,
                    lateCount: 0,
                    totalLoyer: 0,
                    totalPaid: 0,
                    totalRemaining: 0
                },
                carnets: []
            };

            for (const carnet of carnets) {
                const summary = await this.calculatePaymentSummary(carnet.id);
                
                report.stats.totalLoyer += carnet.loyer || 0;
                report.stats.totalPaid += summary.totalCompleted;
                report.stats.totalRemaining += summary.remaining;

                if (carnet.status === 'paid') report.stats.paidCount++;
                else if (carnet.status === 'partial') report.stats.partialCount++;
                else if (carnet.status === 'unpaid') report.stats.unpaidCount++;
                else if (carnet.status === 'late') report.stats.lateCount++;

                report.carnets.push({
                    carnetId: carnet.id,
                    mois: carnet.mois,
                    status: carnet.status,
                    loyer: carnet.loyer,
                    totalPaid: summary.totalCompleted,
                    remaining: summary.remaining,
                    isFullyPaid: summary.isFullyPaid,
                    dateECheance: carnet.dateECheance,
                    isOverdue: new Date(carnet.dateECheance) < new Date() && carnet.status !== 'paid'
                });
            }

            report.stats.percentagePaid = report.stats.totalLoyer > 0 
                ? Math.round((report.stats.totalPaid / report.stats.totalLoyer) * 100) 
                : 0;

            return report;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Helper pour calculer le résumé des paiements d'un carnet (alias simplifiée)
     */
    calculatePaymentSummary: async function (carnetId) {
        try {
            const CarnetService = require('../services/CarnetService');
            return await CarnetService.calculatePaymentSummary(carnetId);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Marquer des carnets comme en retard
     * @param {Array} carnetIds - IDs des carnets
     */
    markAsLate: async function (carnetIds) {
        try {
            if (!Array.isArray(carnetIds) || carnetIds.length === 0) {
                throw new Error('Array of Carnet IDs is required');
            }

            const updates = await Promise.all(
                carnetIds.map(id => 
                    Carnet.updateOne(id).set({ status: 'late' })
                )
            );

            // Notifications
            for (const updated of updates) {
                try {
                    await NotificationService.notify(
                        updated.locateur,
                        `Votre carnet ${updated.mois}/${updated.year} est en retard de paiement`,
                        'warning',
                        'carnet',
                        updated.id,
                        `/carnet/${updated.id}`
                    );
                } catch (notifError) {
                    sails.log.error("Erreur notification late:", notifError);
                }
            }

            return updates;
        } catch (error) {
            throw error;
        }
    },

};
