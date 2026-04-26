
module.exports = {

    getAll: async function () {
        try {
            return await Location.find().populate('user').populate('appartement');
        } catch (error) {
            throw error;
        }
    },

    create: async function (data) {
        try {
            return await Location.create(data).fetch();
        } catch (error) {
            throw error;
        }
    },

    update: async function (id, data) {
        try {
            return await Location.updateOne(id).set(data);
        } catch (error) {
            throw error;
        }
    },

    delete: async function (id) {
        try {
            return await Location.destroy({ id: id }).fetch();
        } catch (error) {
            throw error;
        }
    },

    // findByCriteria: async function (criteria = {}) {
    //     try {
    //         return await Location.find(criteria).populate('user').populate('appartement');
    //     } catch (error) {
    //         throw error;
    //     }
    // },

    findByCriteria: async function (user, status, loyerMin, loyerMax, cautionMin, cautionMax, dateStart, dateEnd, page, limit) {
        try {

            const whereClause = {
                or: [
                    {
                        ...(user ? { user } : {}),
                        ...(status ? { status } : {}),

                        ...(loyerMin || loyerMax ? {
                            loyer: {
                                ...(loyerMin ? { '>=': loyerMin } : {}),
                                ...(loyerMax ? { '<=': loyerMax } : {})
                            }

                        } : {}),

                        ...(cautionMin || cautionMax ? {
                            caution: {
                                ...(cautionMin ? { '>=': cautionMin } : {}),
                                ...(cautionMax ? { '<=': cautionMax } : {})
                            }

                        } : {}),

                        ...(dateStart ? {
                            dateStart: {
                                ...(dateStart ? { '>=': new Date(dateStart) } : {}),
                            }

                        } : {}),

                        ...(dateEnd ? {
                            dateEnd: {
                                ...(dateEnd ? { '<=': new Date(dateEnd) } : {})
                            }

                        } : {}),
                    }
                ]
            };

            const total = await Location.count(whereClause);

            const locations = await Location.find({
                where: whereClause,
                skip: (page - 1) * limit,
                limit

            }).populate('user').populate('appartement').sort('createdAt DESC');

            return {
                locations,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw error;
        }
    },
    findById: async function (id) {
        try {
            return await Location.findOne(id).populate('user').populate('appartement');
        } catch (error) {
            throw error;
        }
    },



}