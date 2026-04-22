
module.exports = {

    getAll: async function () {
        try {
            return await Immeuble.find().populate('user');
        } catch (error) {
            throw error;
        }
    },

    create: async function (data) {
        try {
            return await Immeuble.create(data).fetch();
        } catch (error) {
            throw error;
        }
    },

    update: async function (id, data) {
        try {
            return await Immeuble.updateOne(id).set(data);
        } catch (error) {
            throw error;
        }
    },

    delete: async function (id) {
        try {
            return await Immeuble.destroy({ id: id }).fetch();
        } catch (error) {
            throw error;
        }
    },

    findByCriteria: async function (page, limit, user, name, address, city, province, country, type, description, status, has_parking, has_pool, has_garden, water_available, electricity_available, total_units) {
        try {

            const whereClause = {
                or: [
                    {

                        //le spread operator + condition ternaire
                        ...(user ? { user } : {}),
                        ...(name ? { name } : {}),
                        ...(address ? { address } : {}),
                        ...(city ? { city } : {}),
                        ...(province ? { province } : {}),
                        ...(country ? { country } : {}),
                        ...(type ? { type } : {}),
                        ...(status ? { status } : {}),
                        ...(description ? { description } : {}),
                        ...(has_parking ? { has_parking } : {}),
                        ...(has_pool ? { has_pool } : {}),
                        ...(has_garden ? { has_garden } : {}),
                        ...(water_available ? { water_available } : {}),
                        ...(electricity_available ? { electricity_available } : {}),
                        ...(total_units ? { total_units } : {}),

                    }
                ]
            }


            const total = await Immeuble.count(whereClause);


            const immeubles = await Immeuble.find({
                where: whereClause,
                skip: (page - 1) * limit,
                limit: limit

            }).populate('user').populate('appartements').populate('locations').sort('createdAt DESC');

            return {
                immeubles,
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
            return await Immeuble.findOne(id).populate('user');
        } catch (error) {
            throw error;
        }
    },

    find: async function (id) {
        try {
            return await Immeuble.find(id).populate('user').populate('appartements').populate('locations');
        } catch (error) {
            throw error;
        }
    },



}