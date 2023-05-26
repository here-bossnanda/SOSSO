'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BranchDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BranchDetail.hasMany(models.BranchDetailMonthly, {
        as: "branchDetailMonthly",
        foreignKey: "branch_detail_id",
      });

      BranchDetail.belongsTo(models.Branch, {
        as: "branch",
        targetKey: "id",
        foreignKey: "branch_id",
      });
      
       BranchDetail.belongsTo(models.Category, {
         as: "category",
         foreignKey: "category_id",
       });
    }
  }
  BranchDetail.init({
    check_list: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    area: DataTypes.STRING,
    point_check: DataTypes.STRING,
    no_prio: DataTypes.INTEGER,
    list: DataTypes.TEXT,
    actual: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    branch_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'BranchDetail',
  });
  return BranchDetail;
};