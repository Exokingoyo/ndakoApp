
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

    findByCriteria: async function (page, limit, user, name, address, city, province, country, type, description, status) {
        try {

            const whereClause = {
                or: [
                    {
                        user: user,
                        //le spread operator + condition ternaire
                        ...(name ? { name } : {}),
                        ...(address ? { address } : {}),
                        ...(city ? { city } : {}),
                        ...(province ? { province } : {}),
                        ...(country ? { country } : {}),
                        ...(type ? { type } : {}),
                        ...(status ? { status } : {}),
                        ...(description ? { description } : {}),

                    }
                ]
            }


            const total = await Immeuble.count(whereClause);


            const immeubles = await Immeuble.find({
                where: whereClause,
                skip: (page - 1) * limit,
                limit: limit

            }).populate('user').sort('createdAt DESC');

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



}