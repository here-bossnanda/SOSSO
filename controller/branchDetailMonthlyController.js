const { BranchDetailMonthly } = require("../models");
const { getPagination, getPagingData } = require("../helpers/pagination");
const { Cloudinary } = require("../helpers/cloudinary");

class BranchDetailController {
  static async getAll(req, res, next) {
    try {
      const { page, size, month } = req.query;
      const { branch_detail_id } = req.params;
      let condition = {};

      condition["branch_detail_id"] = +branch_detail_id;
      if (month && month !== "all") {
        condition["month"] = month;
      }

      const { limit, offset } = getPagination(page, size);
      const branchDetail = await BranchDetailMonthly.findAndCountAll({
        where: condition,
        order: [["id", "DESC"]],
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [{
              model: BranchDetail,
              as: "branchDetail",
              attributes: {
                  exclude: ["createdAt", "updatedAt"],
              },
          },
        ],
        limit,
        offset,
      });

      const response = getPagingData(branchDetail, page, limit);

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }

  static async updateEvidance(req, res, next) {
    try {
      const id = +req.params.branch_detail_monthly_id;
      const { upload_proof_url} = req.body;
      let input = {}
      if (upload_proof_url) {
        const uploadResponse = await Cloudinary.uploader.upload(
          upload_proof_url
        );
        input["upload_proof_url"] = uploadResponse.url;
      }

      const data = await BranchDetailMonthly.findByPk(id, {
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      if (!data) return next({ name: "notFound" });

      await BranchDetailMonthly.update(input, { where: { id } });
      await data.reload();

      return res.status(200).json({
        status: "success",
        data,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = BranchDetailController;
