const router = require("express").Router();
const authRouter = require("./auth");
const branchRouter = require("./branch");
const userRouter = require("./user");

router.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server Up!",
  });
});

router.use(authRouter);

router.use("/branch", branchRouter);
router.use("/users", userRouter);

module.exports = router;
