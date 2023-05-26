'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("BranchDetailMonthlies", [
      {
        month: "Januari",
        score: 0,
        branch_detail_id: 1,
        status: 1,
        upload_proof_url:"",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        month: "Februari",
        score: 20,
        branch_detail_id: 1,
        status: 1,
        upload_proof_url:"",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        month: "Maret",
        score: 5,
        branch_detail_id: 1,
        status: 1,
        upload_proof_url:"",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        month: "Januari",
        score: 0,
        branch_detail_id: 2,
        status: 1,
        upload_proof_url:"",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        month: "Februari",
        score: 15,
        branch_detail_id: 2,
        status: 1,
        upload_proof_url:"",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        month: "Maret",
        score: 5,
        branch_detail_id: 2,
        status: 1,
        upload_proof_url:"",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        month: "Januari",
        score: 10,
        branch_detail_id: 3,
        status: 1,
        upload_proof_url:"",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        month: "Februari",
        score: 5,
        branch_detail_id: 3,
        status: 0,
        upload_proof_url:"",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        month: "Maret",
        score: 10,
        branch_detail_id: 3,
        status: 1,
        upload_proof_url:"",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        month: "Januari",
        score: 0,
        branch_detail_id: 4,
        status: 0,
        upload_proof_url:"",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        month: "Februari",
        score: 10,
        branch_detail_id: 4,
        status: 0,
        upload_proof_url:"",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        month: "Maret",
        score: 5,
        branch_detail_id: 4,
        status: 1,
        upload_proof_url:"",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("BranchDetailMonthlies", [
      {
        month: "Januari",
        score: 0,
        branch_detail_id: 1,
      },
      {
        month: "Februari",
        score: 20,
        branch_detail_id: 1,
      },
      {
        month: "Maret",
        score: 5,
        branch_detail_id: 1,
      },
      {
        month: "Januari",
        score: 0,
        branch_detail_id: 2,
      },
      {
        month: "Februari",
        score: 15,
        branch_detail_id: 2,
      },
      {
        month: "Maret",
        score: 5,
        branch_detail_id: 2,
      },
      {
        month: "Januari",
        score: 10,
        branch_detail_id: 3,
      },
      {
        month: "Februari",
        score: 5,
        branch_detail_id: 3,
      },
      {
        month: "Maret",
        score: 10,
        branch_detail_id: 3,
      },
      {
        month: "Januari",
        score: 0,
        branch_detail_id: 4,
      },
      {
        month: "Februari",
        score: 10,
        branch_detail_id: 4,
      },
      {
        month: "Maret",
        score: 5,
        branch_detail_id: 4,
      },
    ]);
  },
};