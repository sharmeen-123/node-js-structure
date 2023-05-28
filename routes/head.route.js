const express = require("express");
const headController = require("../controller/head.controller");

const headRouter = express.Router();

headRouter.get("/", headController.register);
headRouter.get("/graph", headController.login);

module.exports =  headRouter;
