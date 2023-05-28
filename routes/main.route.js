const express = require("express");
const userRouter = require("./user.route");
const campaignRouter = require("./campaign.route");
const authGuard = require("../middleware/authGuard.middleware");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello from server");
});

router.use("/user", userRouter);
router.use("/campaign", authGuard,campaignRouter);

module.exports = router;

