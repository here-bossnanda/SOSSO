const { Branch } = require("../models");
const { getPagination, getPagingData } = require("../helpers/pagination");
const { Op } = require("sequelize");

class BranchController {
  static async getAll(req, res, next) {
    try {
      const { page, size, search, type_search } = req.query;
      let condition = {};

      if (search) {
        condition[`${type_search}`] = {
          [Op.iLike]: `%${search}%`,
        };
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

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = BranchController;
