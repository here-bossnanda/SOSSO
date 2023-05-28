const {
  BranchDetail,
  BranchDetailMonthly,
  Category,
  Branch,
  sequelize,
} = require("../models");
const { getPagination, getPagingData } = require("../helpers/pagination");
const { QueryTypes, where } = require("sequelize");

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

      const branchDetail = await BranchDetailMonthly.findAndCountAll({
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

      const response = getPagingData(branchDetail, page, limit, branch);

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }

  static async _getTotalDataEachCategory(
    branch_code = "",
    check_list = 0,
    month = ""
  ) {
    let whereFlag = false;
    let condition = "WHERE";
    let query = `SELECT 
          c.name, 
          SUM(bd.score) as "target_score", 
          SUM(bdm.score) as "final_score" 
        from 
          "BranchDetailMonthlies" as bdm 
          LEFT JOIN "BranchDetails" as bd ON bd.id = bdm.branch_detail_id 
          LEFT JOIN "Branches" as b ON b.branch_code = bd.branch_id 
          LEFT JOIN "Categories" as c ON c.id = bd.category_id `;

    if (branch_code != "") {
      query += `WHERE 
          b.branch_code = $branch_code `;
      whereFlag = true;
    }

    if (check_list != "") {
      if (whereFlag) {
        condition = "AND";
      }

      query += `${condition} 
          bd.check_list = $check_list `;
      whereFlag = true;
    }

    if (month != "") {
      if (whereFlag) {
        condition = "AND";
      }

      query += `${condition} 
          bdm.month = $month `;
      whereFlag = true;
    }

    query += `GROUP BY 
          c.name;`;

    const chartBranch = await sequelize.query(query, {
      bind: { branch_code, check_list, month },
      type: QueryTypes.SELECT,
    });

    return chartBranch;
  }

  static async _generateScoreChart(name, final_score) {
    let score = 0;
    switch (name) {
      case "Bengkel":
        score = +((final_score / 219) * 100).toFixed(2);
        break;
      case "Finance":
        score = +((final_score / 163) * 100).toFixed(2);
        break;
      case "Others":
        score = +((final_score / 87) * 100).toFixed(2);
        break;
      case "Unit":
        score = +((final_score / 359) * 100).toFixed(2);
        break;
      default:
        break;
    }

    return score;
  }

  static async _generateColor(score) {
    let color = "";
    if (score <= 50) {
      color = "#f20f16";
    } else if (score <= 70) {
      color = "#f29b0f";
    } else if (score <= 90) {
      color = "#faef20";
    } else if (score <= 98) {
      color = "#4cfa20";
    } else if (score <= 100) {
      color = "#02d125";
    }

    return color;
  }

  static async _generateEachCategoryChart(getTotalChart) {
    const result = {
      labels: [],
      data: [],
      color: [],
    };

    let targerScore = 0;
    let finalGrade = 0;

    await getTotalChart.forEach(async (data) => {
      let name = `Final Score Finish ${data["name"]}`;
      finalGrade += +data["final_score"];
      targerScore += +data["target_score"];

      const score = await BranchDetailController._generateScoreChart(
        data["name"],
        +data["final_score"]
      );
      result["labels"].push(name);
      result["data"].push(score);

      const color = await BranchDetailController._generateColor(score);
      result["color"].push(color);
    });

    return { result, finalGrade, targerScore };
  }

  static async _generatedResultChart(getTotalChart) {
    const finalScoreName = "Final Score";

    let { result, finalGrade, targerScore } =
      await BranchDetailController._generateEachCategoryChart(getTotalChart);

    let finalScore = +((finalGrade / targerScore) * 100).toFixed(2);
    const color = await BranchDetailController._generateColor(finalScore);
    result["color"].unshift(color);

    result["labels"].unshift(finalScoreName);
    result["data"].unshift(finalScore);

    return result;
  }

  static async _generateTitleChart(
    branch_code = "",
    check_list = 0,
    month = ""
  ) {
    let result = "Chart All Branch";
    let prefixFlag = false;

    if (branch_code != "") {
      const branch = await Branch.findOne({
        where: { branch_code: branch_code },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      result = `Chart Branch ${branch.branch_name}`;
      prefixFlag = true;
    }

    if (check_list != "") {
      const naming = `Check List ${check_list}`;
      if (prefixFlag) {
        result += ` ${naming}`;
      } else {
        result = `Chart All Branch ${naming}`;
      }
    }

    if (month != "") {
      const naming = `Month ${month}`;
      if (prefixFlag) {
        result += ` ${naming}`;
      } else {
        result = `Chart All Branch ${naming}`;
      }
    }

    return result;
  }

  static async getBarChartDashbord(req, res, next) {
    try {
      const { branch_code, check_list, month } = req.query;

      let getTotalChart =
        await BranchDetailController._getTotalDataEachCategory(
          branch_code,
          check_list,
          month
        );

      let generatedResultChartObj = {};
      if (getTotalChart.length > 0) {
        generatedResultChartObj =
          await BranchDetailController._generatedResultChart(getTotalChart);
      }

      generatedResultChartObj["title"] =
        await BranchDetailController._generateTitleChart(
          branch_code,
          check_list,
          month
        );

      return res.status(200).json(generatedResultChartObj);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = BranchDetailController;
