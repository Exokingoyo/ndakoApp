
const ReviewRepo = require("../repositories/ReviewRepo");

module.exports = {

    create: async function (req, res) {
        try {
            const { rating, comment, immeubleId } = req.body;
            const userId = req.session.user.id;

            const review = await ReviewRepo.create({
                rating,
                comment,
                immeuble: immeubleId,
                user: userId
            });

            return res.ok(review);
        } catch (error) {
            return res.serverError(error);
        }
    },

    getByImmeuble: async function (req, res) {
        try {
            const reviews = await ReviewRepo.findByImmeuble(req.params.id);
            const average = await ReviewRepo.getAverageRating(req.params.id);
            return res.ok({ reviews, average });
        } catch (error) {
            return res.serverError(error);
        }
    }

};
