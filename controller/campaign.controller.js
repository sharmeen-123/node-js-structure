const Campaign = require("../models/campaign.model");

const campaignController = {
  async addCampaign(req, res) {
    let campaignData = req.body;
    let campaign = new Campaign(campaignData);
    const mapExists = await Campaign.findOne({
      name: campaign.name,
      startedBy: campaign.startedBy,
    });
    if (mapExists) {
      res.status(400).send("name exists");
    } else {
      campaign.save((error, map) => {
        if (error) {
          res.send(error.message);
        } else {
          res.status(200).send({
            mapDetails: map,
          });
        }
      });
    }
  },
  async getCampaigns(req, res) {
    let user = req.query;
    let data = await Campaign.find({
      startedBy: user.startedBy,
    });
    res.status(200).send({
      data: data,
    });
  },
  async deleteCampaign(req, res) {
    let campaignData = req.body;

    await Campaign.deleteOne(
      {
        name: campaignData.campaignName,
      },
      (err, suc) => {
        if (err) {
          res.status(404).send("campaign not found");
        } else {
          if (suc.deletedCount == 1) {
            res.send("deleted");
          } else res.status(404).send("campaign not found");
        }
      }
    );
  },
};

module.exports =  campaignController;
