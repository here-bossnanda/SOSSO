'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BranchDetailMonthly extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BranchDetailMonthly.belongsTo(models.BranchDetail, {
        as: "branchDetail",
        foreignKey: "branch_detail_id",
      });
    }
  }
  BranchDetailMonthly.init(
    {
      month: DataTypes.STRING,
      score: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      upload_proof_url: DataTypes.STRING,
      branch_detail_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "BranchDetailMonthly",
      hooks: {
        beforeCreate(instance) {
          if (instance.upload_proof_url  == null) {
            instance.upload_proof_url = "";
          }
        },
      },
    }
  );
  return BranchDetailMonthly;
};