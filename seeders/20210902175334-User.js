'use strict';
const { hashPassword } = require('../helpers/hashPassword');

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Users', [
            { email: 'admin@sosso.com', password: hashPassword('Rahasia01'), role: 1, createdAt: new Date(), updatedAt: new Date() },
            { email: 'al@sosso.com', password: hashPassword('Rahasia01'), role: 2, createdAt: new Date(), updatedAt: new Date() }
        ])
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Users", [
            { email: "admin@sosso.com", role: 1 },
            { email: "al@sosso.com", role: 2 },
        ]);
    }
};