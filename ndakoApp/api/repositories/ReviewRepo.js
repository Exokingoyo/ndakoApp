
module.exports = {

    create: async function (data) {
        try {
            return await Review.create(data).fetch();
        } catch (error) {
            throw error;
        }
    },

    findByImmeuble: async function (immeubleId) {
        try {
            return await Review.find({ immeuble: immeubleId }).populate('user');
        } catch (error) {
            throw error;
        }
    },

    getAverageRating: async function (immeubleId) {
        try {
            const reviews = await Review.find({ immeuble: immeubleId });
            if (reviews.length === 0) return 0;
            const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
            return sum / reviews.length;
        } catch (error) {
            throw error;
        }
    }

};
