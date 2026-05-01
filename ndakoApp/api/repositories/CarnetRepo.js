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
            return await Carnet.findOne(id).populate('proprietaire').populate('locateur').populate('location');
        } catch (error) {
            throw error;
        }
    },

    findByLocation: async function (locationId) {
        try {
            return await Carnet.find({ location: locationId }).populate('proprietaire').populate('locateur').populate('location').sort('year DESC');
        } catch (error) {
            throw error;
        }
    },

    findByUser: async function (userId) {
        try {
            return await Carnet.find({ or: [{ proprietaire: userId }, { locateur: userId }] }).populate('proprietaire').populate('locateur').populate('location').sort('year DESC');
        } catch (error) {
            throw error;
        }
    },

    findByCriteria: async function (page = 1, limit = 10, proprietaire, locateur, status, year, mois) {
        try {
            const whereClause = {
                or: [
                    {
                        ...(proprietaire ? { proprietaire } : {}),
                        ...(locateur ? { locateur } : {}),
                        ...(status ? { status } : {}),
                        ...(year ? { year } : {}),
                        ...(mois ? { mois } : {}),
                    }
                ]
            };

            const total = await Carnet.count(whereClause);

            const carnets = await Carnet.find({
                where: whereClause,
                skip: (page - 1) * limit,
                limit
            }).populate('proprietaire').populate('locateur').populate('location').sort('createdAt DESC');

            return {
                carnets,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw error;
        }
    }

};
