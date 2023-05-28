const express = require("express");
const headRouter = require("./head.route");
const authGuard = require("../middleware/authGuard.middleware");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello from server");
});

router.use("/head", headRouter);

module.exports = router;

