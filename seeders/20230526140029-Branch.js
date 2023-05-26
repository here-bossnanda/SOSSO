'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("Branches", [
          {
            branch_code: "H601",
            branch_name: "SO Veteran",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            branch_code: "H602",
            branch_name: "SO Sukarame",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            branch_code: "H603",
            branch_name: "SO Prabumulih",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            branch_code: "H604",
            branch_name: "SO Baturaja",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            branch_code: "H605",
            branch_name: "SO Sungai Lilin",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            branch_code: "H606",
            branch_name: "SO Sako",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            branch_code: "H607",
            branch_name: "SO Tugumulyo",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            branch_code: "H608",
            branch_name: "SO Plaju",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            branch_code: "H609",
            branch_name: "SO Simpang Priuk",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            branch_code: "H610",
            branch_name: "SO Basuki Rahmat",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            branch_code: "H611",
            branch_name: "SO Muara Enim",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            branch_code: "H612",
            branch_name: "SO Belitang",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            branch_code: "H613",
            branch_name: "SO Indralaya",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            branch_code: "H614",
            branch_name: "SO Lahat",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            branch_code: "H615",
            branch_name: "SO Betung",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Branches", [
          {
            branch_code: "H601",
            branch_name: "SO Veteran",
          },
          {
            branch_code: "H602",
            branch_name: "SO Sukarame",
          },
          {
            branch_code: "H603",
            branch_name: "SO Prabumulih",
          },
          {
            branch_code: "H604",
            branch_name: "SO Baturaja",
          },
          {
            branch_code: "H605",
            branch_name: "SO Sungai Lilin",
          },
          {
            branch_code: "H606",
            branch_name: "SO Sako",
          },
          {
            branch_code: "H607",
            branch_name: "SO Tugumulyo",
          },
          {
            branch_code: "H608",
            branch_name: "SO Plaju",
          },
          {
            branch_code: "H609",
            branch_name: "SO Simpang Priuk",
          },
          {
            branch_code: "H610",
            branch_name: "SO Basuki Rahmat",
          },
          {
            branch_code: "H611",
            branch_name: "SO Muara Enim",
          },
          {
            branch_code: "H612",
            branch_name: "SO Belitang",
          },
          {
            branch_code: "H613",
            branch_name: "SO Indralaya",
          },
          {
            branch_code: "H614",
            branch_name: "SO Lahat",
          },
          {
            branch_code: "H615",
            branch_name: "SO Betung",
          },
        ]);
    }
};
