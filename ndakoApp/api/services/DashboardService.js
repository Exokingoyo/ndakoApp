
const ImmeubleRepo = require("../repositories/ImmeubleRepo");
const PayementRepo = require("../repositories/PayementRepo");

module.exports = {

    getOwnerStats: async function (ownerId) {
        try {
            const immeubles = await Immeuble.find({ user: ownerId }).populate('locations');
            
            let totalRevenue = 0;
            let activeLocationsCount = 0;
            let totalUnits = 0;

            for (const imm of immeubles) {
                totalUnits += imm.total_units || 0;
                activeLocationsCount += imm.locations.filter(l => l.status === 'active').length;
                
                const payments = await Payement.find({ 
                    user: ownerId, // This logic might need adjustment depending on how payments are linked
                    status: 'completed'
                });
                // Note: Simplified logic for demonstration
            }

            return {
                propertyCount: immeubles.length,
                totalUnits,
                activeLocationsCount,
                occupancyRate: totalUnits > 0 ? (activeLocationsCount / totalUnits) * 100 : 0,
                // revenue would normally be calculated from Payement records linked to owner's properties
            };
        } catch (error) {
            throw error;
        }
    }

};
