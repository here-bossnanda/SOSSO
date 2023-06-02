const {
  BranchDetail,
  BranchDetailMonthly,
  Category,
  Branch,
  sequelize,
} = require("../models");
const { getPagination, getPagingData } = require("../helpers/pagination");
const { QueryTypes } = require("sequelize");

class BranchDetailController {
  static async getAll(req, res, next) {
    try {
      const { page, size, category_name, month } = req.query;
      const { branch_code } = req.params;

      let condition = {};
      let conditionMonthly = {};

      condition["branch_id"] = branch_code;
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
    month = "",
    category_id = 0,
    is_admin = 0,
    branches = "",
    next
  ) {
    try {
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

      branches = branches.split(",");
      if (branch_code != "") {
        if (is_admin != 1) {
          if (!branches.includes(branch_code)) {
            return "unauthorize";
          }
        }

        query += `WHERE 
          b.branch_code = $branch_code `;
        whereFlag = true;
      } else {
        if (is_admin != 1) {
          if (branches.length > 0) {
            branches.forEach((element) => {
              if (branch_code.length > 0) {
                branch_code += `,'${element}'`;
              } else {
                branch_code += `'${element}'`;
              }
            });
          }

          query += `WHERE 
          b.branch_code in (${branch_code}) `;
          whereFlag = true;
        }
      }

      if (month != "") {
        if (whereFlag) {
          condition = "AND";
        }

        query += `${condition} 
          bdm.month = $month `;
        whereFlag = true;
      }

      if (category_id != 0) {
        if (whereFlag) {
          condition = "AND";
        }

        query += `${condition} 
          bd.category_id = $category_id `;
        whereFlag = true;
      }

      query += `GROUP BY 
          c.name;`;

      const chartBranch = await sequelize.query(query, {
        bind: { branch_code, month, category_id },
        type: QueryTypes.SELECT,
      });

      return chartBranch;
    } catch (error) {
      return next(error);
    }
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

    if (score > 100) {
      score = 100;
    }

    if (score < 0) {
      score = 0;
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

  static async _generateResultEachCategoryChart(getTotalChart) {
    const result = {
      labels: [],
      data: [],
      color: [],
    };

    await getTotalChart.forEach(async (data) => {
      let name = `Achieve`;

      const score = await BranchDetailController._generateScoreChart(
        data["name"],
        +data["final_score"]
      );
      result["labels"].push(name);
      result["data"].push(score);

      // const color = await BranchDetailController._generateColor(score);
      result["color"].push("#02d125");
    });

    let finalScore = result["data"][0];
    let elseScore = +(100 - finalScore).toFixed(2);
    if (finalScore > 100) {
      // finalScore = 100;
      elseScore = 0;
    }

    if (finalScore < 0) {
      elseScore = 100;
      // finalScore = 0;
    }

    result["labels"].push("Not Achiev");
    result["data"].push(elseScore);
    result["color"].push("#f20f16");

    return result;
  }

  static async _generatedResultChart(getTotalChart) {
    const finalScoreName = "Final Score";

    let { result, finalGrade, targerScore } =
      await BranchDetailController._generateEachCategoryChart(getTotalChart);

    let finalScore = +((finalGrade / targerScore) * 100).toFixed(2);
    if (finalScore > 100) {
      finalScore = 100;
    }

    if (finalScore < 0) {
      finalScore = 0;
    }
    const color = await BranchDetailController._generateColor(finalScore);
    result["color"].unshift(color);

    result["labels"].unshift(finalScoreName);
    result["data"].unshift(finalScore);

    return result;
  }

  static async _generateTitleChart(
    branch_code = "",
    month = "",
    category_id = 0
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

    if (month != "") {
      const naming = `Month ${month}`;
      if (prefixFlag) {
        result += ` ${naming}`;
      } else {
        result = `Chart All Branch ${naming}`;
        prefixFlag = true;
      }
    }

    if (category_id != "") {
      const category = await Category.findOne({
        where: { id: category_id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      const naming = `Category ${category.name}`;
      if (prefixFlag) {
        result += ` ${naming}`;
      } else {
        result = `Chart All Branch ${naming}`;
        prefixFlag = true;
      }
    }

    return result;
  }

  static async _generateDataTable(
    branch_code = "",
    month = "",
    category_id = 0,
    is_admin = 0,
    branches = "",
    next,
    page = 1,
    size = 5
  ) {
    try {
      let whereFlag = false;
      let conditionWording = "WHERE";
      let condition = {};

      const { limit, offset } = getPagination(page, size);

      let query = `SELECT
        sumData.branch_code,
        sumData.branch_name`;

      if (category_id != 0) {
        query += `, sumData.category_id`;
      }

      if (category_id == 1) {
        query += `, CAST(
        (
          (
            SUM(sumData.final_score) / 359
          ) * 100
        ) AS DECIMAL(10, 2)) AS "final_score"`;
      } else if (category_id == 2) {
        query += `, CAST(
          (
            (
              SUM(sumData.final_score) / 163
            ) * 100
          ) AS DECIMAL(10, 2)) AS "final_score"`;
      } else if (category_id == 3) {
        query += `, CAST(
          (
            (
              SUM(sumData.final_score) / 219
            ) * 100
          ) AS DECIMAL(10, 2)) AS "final_score"`;
      } else if (category_id == 4) {
        query += `, CAST(
        (
          (
            SUM(sumData.final_score) / 87
          ) * 100
        ) AS DECIMAL(10, 2)) AS "final_score"`;
      } else {
        query += `, CAST(
          (
            SUM(sumData.final_score) / SUM(sumData.target_score) * 100
          ) AS DECIMAL(10, 2)
        ) AS "final_score"`;
      }

      query += ` FROM
        (
          select
            b.branch_code,
            b.branch_name,
            c.id as "category_id",
            COALESCE(
              SUM(bd.score),
              100
            ) AS "target_score",
            COALESCE(
              SUM(bdm.score),
              0
            ) AS "final_score"
          FROM
            "Branches" AS b
            LEFT JOIN "BranchDetails" AS bd ON bd.branch_id = b.branch_code
            LEFT JOIN "BranchDetailMonthlies" AS bdm ON bdm.branch_detail_id = bd.id
            LEFT JOIN "Categories" AS c ON c.id = bd.category_id `;

      branches = branches.split(",");
      if (branch_code != "") {
        if (is_admin != 1) {
          if (!branches.includes(branch_code)) {
            return "unauthorize";
          }
        }

        condition["branch_code"] = branch_code;
        query += `WHERE 
          b.branch_code = $branch_code `;
        whereFlag = true;
      } else {
        if (is_admin != 1) {
          if (branches.length > 0) {
            branches.forEach((element) => {
              if (branch_code.length > 0) {
                branch_code += `,'${element}'`;
              } else {
                branch_code += `'${element}'`;
              }
            });
          }

          query += `WHERE 
          b.branch_code in (${branch_code}) `;
          condition["branch_code"] = branches;
          whereFlag = true;
        }
      }

      if (month != "") {
        if (whereFlag) {
          conditionWording = "AND";
        }

        query += `${conditionWording} 
          bdm.month = $month `;
        whereFlag = true;
      }

      if (category_id != 0) {
        if (whereFlag) {
          conditionWording = "AND";
        }

        query += `${conditionWording} 
          c.id = $category_id `;
        whereFlag = true;
      }

      query += `GROUP BY
            c.id,
            b.branch_code,
            b.branch_name
        ) AS sumData
      GROUP BY
        sumData.branch_code, sumData.branch_name `;

      if (category_id != 0) {
        query += `, sumData.category_id`;
      }

      query += ` ORDER BY final_score DESC, branch_code ASC 
      LIMIT $limit OFFSET $offset;`;

      const branchTable = await sequelize.query(query, {
        bind: { branch_code, month, category_id, limit, offset },
        type: QueryTypes.SELECT,
      });

      const amount = await Branch.count({
        where: condition,
      });

      const response = getPagingData(
        { count: amount, rows: branchTable },
        page,
        limit
      );

      return response;
    } catch (error) {
      return next(error);
    }
  }

  static async getBarChartDashbord(req, res, next) {
    try {
      const { branch_code, category_id, month } = req.query;

      let getTotalChart =
        await BranchDetailController._getTotalDataEachCategory(
          branch_code,
          month,
          category_id,
          req.user.role,
          req.user.branches,
          next
        );

      if (getTotalChart == "unauthorize") {
        return next({ name: "unauthorize" });
      }

      let generatedResultChartObj = {};
      if (getTotalChart.length > 0) {
        generatedResultChartObj =
          await BranchDetailController._generatedResultChart(getTotalChart);
      } else {
        generatedResultChartObj["labels"] = [
          "Final Score",
          "Final Score Finish Bengkel",
          "Final Score Finish Finance",
          "Final Score Finish Others",
          "Final Score Finish Unit",
        ];

        generatedResultChartObj["data"] = [0, 0, 0, 0, 0];

        generatedResultChartObj["color"] = [
          "#f20f16",
          "#f20f16",
          "#f20f16",
          "#f20f16",
          "#f20f16",
        ];
      }

      generatedResultChartObj["title"] =
        await BranchDetailController._generateTitleChart(branch_code, month);

      return res.status(200).json(generatedResultChartObj);
    } catch (error) {
      return next(error);
    }
  }

  static async getPieChart(req, res, next) {
    try {
      let { branch_code, month, category_id } = req.query;

      let getTotalChart =
        await BranchDetailController._getTotalDataEachCategory(
          branch_code,
          month,
          category_id,
          req.user.role,
          req.user.branches,
          next
        );

      if (getTotalChart == "unauthorize") {
        return next({ name: "unauthorize" });
      }

      let generatedResultChartObj = {};
      if (getTotalChart.length > 0) {
        if (category_id == "") {
          let totalTargetScore = 0;
          let totalFinalScore = 0;
          let elseScore = 0;

          getTotalChart.forEach((element) => {
            totalTargetScore += +element.target_score;
            totalFinalScore += +element.final_score;
          });

          let finalScore = +(
            (totalFinalScore / totalTargetScore) *
            100
          ).toFixed(2);

          elseScore = +(100 - finalScore).toFixed(2);
          if (finalScore > 100) {
            finalScore = 100;
            elseScore = 0;
          }

          if (finalScore < 0) {
            elseScore = 100;
            finalScore = 0;
          }

          generatedResultChartObj["labels"] = ["Achiev", "Not Achiev"];
          generatedResultChartObj["data"] = [finalScore, elseScore];
          generatedResultChartObj["color"] = ["#02d125", "#f20f16"];
        } else {
          generatedResultChartObj =
            await BranchDetailController._generateResultEachCategoryChart(
              getTotalChart
            );
        }
      } else {
        generatedResultChartObj["labels"] = ["Achieve", "Not Achieve"];
        generatedResultChartObj["data"] = [0, 100];
        generatedResultChartObj["color"] = ["#02d125", "#f20f16"];
      }

      generatedResultChartObj["title"] =
        await BranchDetailController._generateTitleChart(
          branch_code,
          month,
          category_id
        );

      return res.status(200).json(generatedResultChartObj);
    } catch (error) {
      return next(error);
    }
  }

  static async getTableData(req, res, next) {
    try {
      let { branch_code, month, category_id, page, size } = req.query;

      let branchData = await BranchDetailController._generateDataTable(
        branch_code,
        month,
        category_id,
        req.user.role,
        req.user.branches,
        next,
        page,
        size
      );

      if (branchData == "unauthorize") {
        return next({ name: "unauthorize" });
      }

      const title = await BranchDetailController._generateTitleChart(
        branch_code,
        month,
        category_id
      );

      branchData["title"] = title;

      return res.status(200).json(branchData);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = BranchDetailController;
