module.exports = {

    create: async function (data) {
        try {
            return await Carnet.create(data).fetch();
        } catch (error) {
            throw error;
        }
    },

    update: async function (id, data) {
        try {
            return await Carnet.updateOne(id).set(data);
        } catch (error) {
            throw error;
        }
    },

    delete: async function (id) {
        try {
            return await Carnet.destroy({ id: id }).fetch();
        } catch (error) {
            throw error;
        }
    },

    findById: async function (id) {
        try {
            return await Carnet.findOne(id).populate('bailleur').populate('locateur').populate('location');
        } catch (error) {
            throw error;
        }
    },

    findByLocation: async function (locationId) {
        try {
            return await Carnet.find({ location: locationId }).populate('bailleur').populate('locateur').populate('location').sort('year DESC');
        } catch (error) {
            throw error;
        }
    },

    findByUser: async function (userId) {
        try {
            return await Carnet.find({ or: [{ bailleur: userId }, { locateur: userId }] }).populate('bailleur').populate('locateur').populate('location');
        } catch (error) {
            throw error;
        }
    },

    findByCriteria: async function (page, limit, bailleur, locateur, status, year, mois) {
        try {
            // Construire un filtre flexible :
            // - si bailleur et/ou locateur sont fournis, on supporte la recherche par l'un OU l'autre
            // - les autres critères (status, year, mois) sont appliqués en AND
            const filters = {};

            if (status) filters.status = status;
            if (year) filters.year = year;
            if (mois) filters.mois = mois;

            let whereClause = {};

            if (bailleur && locateur) {
                // l'utilisateur veut filtrer sur l'un ou l'autre
                whereClause = {
                    and: [
                        filters,
                        { or: [{ bailleur }, { locateur }] }
                    ]
                };
            } else if (bailleur) {
                whereClause = { ...filters, bailleur };
            } else if (locateur) {
                whereClause = { ...filters, locateur };
            } else {
                whereClause = filters;
            }

            const total = await Carnet.count(whereClause);

            const carnets = await Carnet.find({
                where: whereClause,
                skip: (page - 1) * limit,
                limit
            }).populate('bailleur').populate('locateur').populate('location');

            return {
                carnets,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw error;
        }
    },

    // Trouve les carnets en retard (non payés ou partiels) dont la date d'échéance est passée
    findOverdue: async function () {
        try {
            const now = new Date().toISOString();
            return await Carnet.find({
                where: {
                    or: [
                        { status: 'unpaid' },
                        { status: 'partial' }
                    ],
                    dateECheance: { '<': now }
                }
            }).populate('bailleur').populate('locateur').populate('location');
        } catch (error) {
            throw error;
        }
    },

    // Retourne le prochain carnet dû pour une location (le plus proche à venir ou non payé)
    findNextDue: async function (locationId) {
        try {
            const now = new Date().toISOString();

            const result = await Carnet.find({
                where: {
                    location: locationId,
                    status: ['unpaid', 'partial'],
                    dateECheance: { '<=': now }
                },
                sort: 'dateECheance ASC',
                limit: 1
            })
                .populate('bailleur')
                .populate('locateur')
                .populate('location');

            return result;

        } catch (error) {
            throw error;
        }
    },

    // Vérifie si un carnet existe pour une location à un mois/année donnés
    findByLocationAndPeriod: async function (locationId, mois, year) {
        try {
            if (!locationId || !mois || !year) return null;
            return await Carnet.findOne({ location: locationId, mois: mois, year: year }).populate('bailleur').populate('locateur').populate('location');
        } catch (error) {
            throw error;
        }
    }

};
