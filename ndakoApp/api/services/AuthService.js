/**
 * AuthService
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const UserRepo = require("../repositories/UserRepo");
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const jwt = require('jsonwebtoken');


module.exports = {

    signup: async (userData) => {
        try {

            if (!userData?.name) {
                throw { status: 400, message: 'Nom requis.' };
            }
            if (!userData?.last_name) {
                throw { status: 400, message: 'Postnom requis.' };
            }
            if (!userData?.phone) {
                throw { status: 400, message: 'Telephone requis.' };
            }
            if (!userData?.role) {
                throw { status: 400, message: 'Role requis.' };
            }
            if (!userData?.birthday) {
                throw { status: 400, message: 'Date de naissance requise.' };
            }
            if (!userData?.nationality) {
                throw { status: 400, message: 'Nationalite  requis.' };
            }

            if (!userData?.email || !userData?.password) {
                throw { status: 400, message: 'Email et mot de passe requis.' };
            }

            const normalizedEmail = userData.email.toLowerCase();

            const existingUser = await UserRepo.findByEmail(normalizedEmail);

            if (existingUser) {
                throw { status: 409, message: 'Email déjà utilisé.' };
            }

            const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

            const user = await UserRepo.create({
                name: userData.name,
                first_name: userData.first_name,
                last_name: userData.last_name,
                birthday: userData.birthday,
                nationality: userData.nationality,
                role: userData.role,
                phone: userData.phone,
                email: normalizedEmail,
                password: hashedPassword,

            });
            

            const token = await sails.helpers.jwt.sign.with({
                payload: {
                    id: user.id,
                    email: user.email,
                }
            });

            const { password, createdAt, updatedAt, ...safeUserData } = user;

            return { token, user: safeUserData };

        } catch (error) {
            sails.log.error('Signup error:', { error: error.message, stack: error.stack });
            throw error;
        }
    },


    login: async (email, password) => {
        try {
            const user = await UserRepo.findByEmail(email);

            if (!user) {
                throw { status: 401, message: 'Email ou mot de passe incorrect.' };
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw { status: 401, message: 'Email ou mot de passe incorrect.' };
            }

            if (user.status !== "active") {
                throw { status: 401, message: 'Compte non actif.' };
            }

            await UserRepo.update(user.id, { last_login: new Date() });

            const token = await sails.helpers.jwt.sign.with({
                payload: {
                    id: user.id,
                    email: user.email,
                }
            });

            const { password_hash, createdAt, updatedAt, ...safeUserData } = user;

            return { token, user: safeUserData };
        } catch (error) {
            sails.log.error('Login error:', { error: error.message, stack: error.stack });
            throw error;
        }
    },

    logout: async (req, res) => {
        try {
            return res.ok();
        } catch (error) {
            sails.log.error('Logout error:', { error: error.message, stack: error.stack });
            throw error;
        }
    },

    changePassword: async (userId, currentPassword, newPassword) => {

        try {
            const user = await UserRepo.findById(userId);
            if (!user) {
                throw { status: 404, message: 'Utilisateur non trouvé.' };
            }

            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                throw { status: 401, message: 'Mot de passe actuel incorrect.' };
            }
            const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
            await UserRepo.update(userId, { password: hashedNewPassword });

            return { message: 'Mot de passe mis à jour avec succès.' };
        } catch (error) {
            sails.log.error('Change password error:', { error: error.message, stack: error.stack });
            throw error;
        }
    }



};