'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("BranchDetails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      branch_id: {
        type: Sequelize.STRING,
      },
      check_list: {
        type: Sequelize.STRING,
      },
      category_id: {
        type: Sequelize.INTEGER,
      },
      area: {
        type: Sequelize.STRING,
      },
      point_check: {
        type: Sequelize.STRING,
      },
      no_prio: {
        type: Sequelize.INTEGER,
      },
      list: {
        type: Sequelize.TEXT,
      },
      actual: {
        type: Sequelize.INTEGER,
      },
      score: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BranchDetails');
  }
};