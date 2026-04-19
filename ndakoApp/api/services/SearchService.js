
const ImmeubleRepo = require("../repositories/ImmeubleRepo");

module.exports = {

    search: async function (filters) {
        try {
            const { 
                city, 
                province, 
                minPrice, 
                maxPrice, 
                type, 
                has_parking, 
                has_pool, 
                has_garden,
                bedrooms,
                page = 1,
                limit = 10
            } = filters;

            const whereClause = {
                status: 'active',
                is_active: true
            };

            if (city) whereClause.city = { contains: city };
            if (province) whereClause.province = { contains: province };
            if (type) whereClause.type = type;
            if (has_parking !== undefined) whereClause.has_parking = has_parking === 'true' || has_parking === true;
            if (has_pool !== undefined) whereClause.has_pool = has_pool === 'true' || has_pool === true;
            if (has_garden !== undefined) whereClause.has_garden = has_garden === 'true' || has_garden === true;

            // Simple search first, we'll expand with price and bedrooms if they are apartments
            const results = await Immeuble.find({
                where: whereClause,
                skip: (page - 1) * limit,
                limit: limit
            }).populate('user').populate('appartements').sort('createdAt DESC');

            const total = await Immeuble.count(whereClause);

            return {
                results,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw error;
        }
    }

};
