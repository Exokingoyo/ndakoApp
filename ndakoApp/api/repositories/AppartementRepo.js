
module.exports = {

    create: async function (data) {
        try {
            return await Appartement.create(data).fetch();
        } catch (error) {
            throw error;
        }
    },

    update: async function (id, data) {
        try {
            return await Appartement.updateOne(id).set(data);
        } catch (error) {
            throw error;
        }
    },

    delete: async function (id) {
        try {
            return await Appartement.destroy({ id: id }).fetch();
        } catch (error) {
            throw error;
        }
    },

    findByCriteria: async function (page, limit, user, immeuble, name, loyerStart, loyerEnd, etage, chambreMin, ChambreMax, bathroomsMin, bathroomsMax, surface_areaMin, surface_areaMax, is_vacant, description, status) {
        try {

            const whereClause = {
                or: [
                    {

                        //le spread operator + condition ternaire
                        ...(user ? { user } : {}),
                        ...(name ? { name } : {}),
                        ...(immeuble ? { immeuble } : {}),
                        ...(etage ? { etage } : {}),
                        ...(status ? { status } : {}),
                        ...(description ? { description } : {}),
                        ...(is_vacant ? { is_vacant } : {}),
                        ...(description ? { description } : {}),

                        // imbrication
                        ...(loyerStart || loyerEnd ? {
                            loyer: {
                                ...(loyerStart ? { '>=': loyerStart } : {}),
                                ...(loyerEnd ? { '<=': loyerEnd } : {})
                            }

                        } : {}),

                        ...(chambreMin || ChambreMax ? {
                            chambre: {
                                ...(chambreMin ? { '>=': chambreMin } : {}),
                                ...(ChambreMax ? { '<=': ChambreMax } : {})
                            }

                        } : {}),

                        ...(bathroomsMin || bathroomsMax ? {
                            bathrooms: {
                                ...(bathroomsMin ? { '>=': bathroomsMin } : {}),
                                ...(bathroomsMax ? { '<=': bathroomsMax } : {})
                            }

                        } : {}),

                        ...(surface_areaMin || surface_areaMax ? {
                            surface_area: {
                                ...(surface_areaMin ? { '>=': surface_areaMin } : {}),
                                ...(surface_areaMax ? { '<=': surface_areaMax } : {})
                            }

                        } : {}),


                    }
                ]
            }


            const total = await Appartement.count(whereClause);

            const appartements = await Appartement.find({
                where: whereClause,
                skip: (page - 1) * limit,
                limit: limit

            }).populate('immeuble').populate('locations').sort('createdAt DESC');

            return {
                appartements,
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
            return await Appartement.findOne(id).populate('immeuble').populate('locations');
        } catch (error) {
            throw error;
        }
    },

    findByImmeuble: async function (immeubleId) {
        try {
            return await Appartement.find({ immeuble: immeubleId }).populate('immeuble').populate('locations').sort('name ASC');
        } catch (error) {
            throw error;
        }
    },

    findVacantByImmeuble: async function (immeubleId) {
        try {
            return await Appartement.find({ immeuble: immeubleId, is_vacant: true }).populate('immeuble').populate('locations').sort('name ASC');
        } catch (error) {
            throw error;
        }
    }

};
