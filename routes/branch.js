const router = require('express').Router();
const branchController = require('../controller/branchController');
const branchDetailController = require("../controller/branchDetailController");
const branchDetailMonthlyController = require("../controller/branchDetailMonthlyController");

const isLoginAdmin = require('../middlewares/isLoginAdmin');

router.get('/', isLoginAdmin, branchController.getAll);
router.get("/:branch_code", isLoginAdmin, branchDetailController.getAll);
router.get(
  "/detail/:branch_detail_id",
  isLoginAdmin,
  branchDetailMonthlyController.getAll
);

router.patch(
  "/detail/:branch_detail_monthly_id",
  isLoginAdmin,
  branchDetailMonthlyController.updateEvidance
);

module.exports = router