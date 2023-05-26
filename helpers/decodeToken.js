const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

const decodeToken = (token) => {
    return jwt.verify(token, JWT_SECRET_KEY);
}

module.exports = decodeToken;