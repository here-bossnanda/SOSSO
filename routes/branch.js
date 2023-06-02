const router = require("express").Router();
const branchController = require("../controller/branchController");
const branchDetailController = require("../controller/branchDetailController");
const branchDetailMonthlyController = require("../controller/branchDetailMonthlyController");

const isLoginAdmin = require("../middlewares/isLoginAdmin");

router.get("/", isLoginAdmin, branchController.getAll);
router.post("/bulk", isLoginAdmin, branchController.bulkCreate);
router.get("/:branch_code", isLoginAdmin, branchDetailController.getAll);
router.get(
  "/detail/:branch_detail_id",
  isLoginAdmin,
  branchDetailMonthlyController.getAll
);

router.get(
  "/dashboard/chart-bar",
  isLoginAdmin,
  branchDetailController.getBarChartDashbord
);

router.get(
  "/dashboard/chart-pie",
  isLoginAdmin,
  branchDetailController.getPieChart
);

router.get(
  "/dashboard/detail",
  isLoginAdmin,
  branchDetailController.getTableData
);

router.patch(
  "/detail/:branch_detail_monthly_id",
  isLoginAdmin,
  branchDetailMonthlyController.updateEvidance
);

router.patch(
  "/detail/status/:branch_detail_monthly_id",
  isLoginAdmin,
  branchDetailMonthlyController.updateStatus
);

module.exports = router;
