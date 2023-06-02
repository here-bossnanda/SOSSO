const { User, Branch } = require("../models");
const { getPagination, getPagingData } = require("../helpers/pagination");
const { Op } = require("sequelize");
const { comparePassword, hashPassword } = require("../helpers/hashPassword");

class UserController {
  static async register(req, res, next) {
    try {
      const { email, password, role, branches } = req.body;
      let input = { email, password, role, branches };

      if (branches.length > 0) {
        const amount = await Branch.count({
          where: {
            branch_code: branches,
          },
        });

        if (amount != branches.length) return next("branchesNotMatch");

        input.branches = branches.toString();
      }

      const create = await User.create(input);

      return res.status(201).json({
        id: create.id,
        email: create.email,
        role: create.role,
        branches: create.branches,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const { page, size, q } = req.query;
      let condition = q
        ? {
            email: {
              [Op.like]: `%${q}%`,
            },
          }
        : null;

      const { limit, offset } = getPagination(page, size);

      const user = await User.findAndCountAll({
        where: condition,
        attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        order: [["id", "DESC"]],
        limit,
        offset,
      });

      const response = getPagingData(user, page, limit);

      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  }

  static async get(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        attributes: { exclude: ["createdAt", "updatedAt", "password"] },
      });
      if (!user) return next({ name: "notFound" });

      user.branches = user.branches.split(",");
      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { password, role, branches } = req.body;
      let input = { password, role, branches };

      if (branches.length > 0) {
        const amount = await Branch.count({
          where: {
            branch_code: branches,
          },
        });

        if (amount != branches.length) return next("branchesNotMatch");

        input.branches = branches.toString();
      }

      const user = await User.findByPk(id);

      if (!user) return next({ name: "notFound" });

      if (!password) {
        input.password = user.password;
      } else {
        if (password.length > 6) {
          const checkPassword = comparePassword(password, user.password);
          if (!checkPassword) {
            password = hashPassword(password);
          }
        }
      }

      await user.update(input, { where: id });
      await user.reload();

      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(+id);
      if (!user) return next({ name: "notFound" });

      await user.destroy();
      return res.status(200).json({ message: "successfully delete user" });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = UserController;
