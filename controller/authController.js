const { User } = require('../models')
const { comparePassword } = require('../helpers/hashPassword')
const generateToken = require('../helpers/generateToken');

class AuthController {
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) return next({ name: 'authValidate' });

            const checkPassword = comparePassword(password, user.password);
            if (!checkPassword) return next({ name: 'authValidate' });

            const payload = {
                id: user.id,
                email: user.email,
                role: user.role
            }
            const access_token = generateToken(payload);

            return res.status(200).json({ access_token, 'role': payload.role });
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = AuthController;