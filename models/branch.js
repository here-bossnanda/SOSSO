"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Branch.hasMany(models.BranchDetail, {
        as: "branchDetail",
        foreignKey: "branch_id",
      });
    }
  }
  Branch.init(
    {
      branch_code: {
        type: DataTypes.STRING,
      },
      branch_name: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Branch",
    }
  );
  return Branch;
};
