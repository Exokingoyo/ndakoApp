/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const AuthService = require("../services/AuthService"); 

module.exports = {


    signup: async (req, res) => {

        const { name, first_name, last_name, birthday, nationality, phone, email, password, role } = req.body;

        try {
            const result = await AuthService.signup({ name, first_name, last_name, birthday, nationality, phone, email, password, role });
            return res.ok(result);
        } catch (error) {
            sails.log.error('Signup error:', error);

            if (error.status) {
                return res.status(error.status).json({
                    error: error.message
                });
            }

            return res.serverError(error);
        }
    },

    login: async (req, res) => {

        const { email, password } = req.body;
        try {
            const result = await AuthService.login(email, password);

            req.session.user = result.user;
            req.session.authToken = result.token;

            return res.ok(result);

        } catch (error) {
            sails.log.error('Login error:', error);

            if (error.status) {
                return res.status(error.status).json({
                    error: error.message
                });
            }
        }
    },

    logout: async function (req, res) {
        try {
            req.session.destroy(err => {
                if (err) {
                    return res.serverError('Erreur lors de la déconnexion');
                }
                return res.ok({ message: 'Déconnecté avec succès' });
            });
        } catch (error) {
            return res.serverError(error);
        }
    },

    changePassword: async function (req, res) {
        const userId = req.session.user.id;
        const { currentPassword, newPassword } = req.body;
        try {
            await AuthService.changePassword(userId, currentPassword, newPassword);
            return res.ok({ message: 'Mot de passe changé avec succès' });
        } catch (error) {
            sails.log.error('Change password error:', error);

            if (error.status) {
                return res.status(error.status).json({
                    error: error.message
                });
            }
            return res.serverError(error);
        }
    }

};

