const express = require("express");
const campaignController = require("../controller/campaign.controller");

const campaignRouter = express.Router();

campaignRouter.post("/addCampaign", campaignController.addCampaign);
campaignRouter.get("/getCampaigns", campaignController.getCampaigns);
campaignRouter.delete("/deleteCampaign", campaignController.deleteCampaign);

module.exports =  campaignRouter;
