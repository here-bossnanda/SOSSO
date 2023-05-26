const { BranchDetail, BranchDetailMonthly, Category, Branch } = require("../models");
const { getPagination, getPagingData } = require("../helpers/pagination");

class BranchDetailController {
  static async getAll(req, res, next) {
    try {
      const { page, size, category_name, month } = req.query;
      const { branch_code } = req.params;
      
      let condition = {};
      let conditionMonthly = {};



      condition["branch_id"] = branch_code.toLowerCase();
      if (category_name && category_name !== "all") {
        const category = await Category.findOne({
          where: { name: category_name },
          attributes: { exclude: ["createdAt", "updatedAt"] },
        });

        condition["category_id"] = category.id;
      }

      if (month && month !== "all") {
        conditionMonthly["month"] = month;
      }

      const branch = await Branch.findOne({
        where: { branch_code: branch_code },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      const { limit, offset } = getPagination(page, size);

      const branchDetail =  await BranchDetailMonthly.findAndCountAll({
        where: conditionMonthly,
        order: [["id", "DESC"]],
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            where: condition,
            model: BranchDetail,
            as: "branchDetail",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: [
              {
                model: Category,
                as: "category",
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
            ],
          },
        ],
        limit,
        offset,
      });
      // const branchDetail = await BranchDetail.findAndCountAll({
      //   where: condition,
      //   order: [["id", "DESC"]],
      //   attributes: { exclude: ["createdAt", "updatedAt"] },
      //   include: [
      //     {
      //       model: Category,
      //       as: "category",
      //       attributes: {
      //         exclude: ["createdAt", "updatedAt"],
      //       },
      //     }
      //   ],
      //   limit,
      //   offset,
      // });

      const response = getPagingData(branchDetail, page, limit, branch);

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = BranchDetailController;
