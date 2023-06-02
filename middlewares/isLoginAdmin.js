const { User } = require("../models");
const decodeToken = require("../helpers/decodeToken");
const { SECRET_KEY_USER } = process.env;

const isLoginAdmin = async (req, res, next) => {
  try {
    const { access_token } = req.headers;

    if (!access_token) {
      return next({ name: "unauthorize" });
    }

    if (access_token === SECRET_KEY_USER) {
      return next();
    }

    const decoded = decodeToken(access_token);
    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user) return next({ name: "authValidate" });
    req.user = user;
    return next();
    // if (user.role === 'admin' || user.role === 'nakes' || user.role === 'super_admin') {
    //     return next()
    // } else {
    //     return next({ name: 'unauthorize' });
    // }
  } catch (error) {
    return next(error);
  }
};

module.exports = isLoginAdmin;
