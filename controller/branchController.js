const { Branch, sequelize } = require("../models");
const { getPagination, getPagingData } = require("../helpers/pagination");
const { Op, QueryTypes } = require("sequelize");

class BranchController {
  static async getAll(req, res, next) {
    try {
      const { page, size, search, type_search, for_search_select } = req.query;
      let condition = {};

      if (search) {
        condition[`${type_search}`] = {
          [Op.iLike]: `%${search}%`,
        };
      }

      if (req.user.role != 1) {
        condition["branch_code"] = req.user.branches.split(",");
      }

      const { limit, offset } = getPagination(page, size);
      const branch = await Branch.findAndCountAll({
        where: condition,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        order: [["id", "DESC"]],
        limit,
        offset,
      });

      const response = getPagingData(branch, page, limit);

      if (for_search_select) {
        let newData = [];
        response.data.map((e) => {
          newData.push({
            value: e.branch_code,
            label: e.branch_name,
          });

          response.data = newData;
        });
      }
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }

  static async bulkCreate(req, res, next) {
    try {
      const { branches } = req.body;

      if (branches.length > 0) {
        let valueString = "";
        branches.forEach((item, i) => {
          if (i == 0) {
            valueString += `('${item.branch_code}', '${item.branch_name}')`;
          } else {
            valueString += `, ('${item.branch_code}', '${item.branch_name}') `;
          }
        });

        let query =
          `select 
            * 
          from 
            (
              values 
                ` +
          valueString +
          `
            ) as v(branch_code, branch_name) 
          where 
            not exists (
              select 
                * 
              from 
                "Branches" b 
              where 
                b.branch_code = v.branch_code
            );
`;

        const branchNotExist = await sequelize.query(query, {
          bind: { valueString },
          type: QueryTypes.SELECT,
        });

        if (branchNotExist.length > 0) {
          await Branch.bulkCreate(branchNotExist);
        }
      }
      return res.status(200).json({ status: "200", message: "ok" });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = BranchController;
