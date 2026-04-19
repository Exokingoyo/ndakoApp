/**
 * isLoggedIn.js
 *
 * @description :: Politique de sécurité - vérifie le token JWT dans le header Authorization.
 *                Injecte req.user avec les données du token décodé.
 */

module.exports = async function (req, res, proceed) {

  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Accès refusé. Token manquant ou malformé.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await sails.helpers.jwt.verifyToken.with({ token });

    // Vérifier que l'utilisateur existe encore en base de données
    const user = await User.findOne({ id: decoded.id });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Utilisateur introuvable.'
      });
    }

    if (user.status !== 'active') {
      return res.status(401).json({
        status: 'error',
        message: 'Compte non actif ou bloqué.'
      });
    }

    // Injecter l'utilisateur dans la requête
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      last_name: user.last_name,
    };

    return proceed();

  } catch (error) {
    sails.log.error('Erreur de vérification du token:', error.message);
    return res.status(401).json({
      status: 'error',
      message: 'Token invalide ou expiré.'
    });
  }

};
