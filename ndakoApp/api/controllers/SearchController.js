
const SearchService = require("../services/SearchService");

module.exports = {

    search: async function (req, res) {
        try {
            const results = await SearchService.search(req.query);
            return res.ok(results);
        } catch (error) {
            sails.log.error('Search error:', error);
            return res.serverError(error);
        }
    }

};
