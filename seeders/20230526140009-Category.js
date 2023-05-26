'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Categories", [
      {
        name: "Unit",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Finance",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Bengkel",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Others",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Categories", [
      {
        name: "Unit",
      },
      {
        name: "Finance",
      },
      {
        name: "Bengkel",
      },
      {
        name: "Others",
      },
    ]);
  },
};
