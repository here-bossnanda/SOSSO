'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("BranchDetailMonthlies", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      month: {
        type: Sequelize.STRING,
      },
      score: {
        type: Sequelize.INTEGER,
      },
      branch_detail_id: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.INTEGER,
      },
      upload_proof_url: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('BranchDetailMonthlies');
  }
};