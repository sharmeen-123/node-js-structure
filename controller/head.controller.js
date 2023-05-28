const head = require("../models/head.model");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//VALIDATION
const Joi = require("@hapi/joi");

//validation for register data
const registerValidationSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().required(),
  password: Joi.string().min(3).required(),
  isAdmin: Joi.boolean(),
});

//validation for login data
const loginValidationSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(3).required(),
});

const headController = {
  async register(req, res) {
    const { error } = registerValidationSchema.validate(req.body);
    if (error) {
      console.log(error.details[0].message);
      res.status(400).send(error.details[0].message);
    } else {
      let headData = req.body;
      let head = new head(headData);
      const emailExists = await head.findOne({
        email: head.email,
      });
      if (emailExists) {
        console.log("already exisits");
        res.status(400).send("Email address Already exists try loging in");
      } else {
        const salt = await bcrypt.genSalt(10);
        head.password = await bcrypt.hash(head.password, salt);
        head.save((error, registeredhead) => {
          if (error) {
            res.send(error.message);
          } else {
            const token = jwt.sign(
              { _id: registeredhead._id },
              process.env.TOKEN_SECRET
            );
            res.status(200).send({
              authToken: token,
              name: registeredhead.name,
              email: registeredhead.email,
              _id: registeredhead._id,
            });
          }
        });
      }
    }
  },
  async login(req, res) {
    const { error } = loginValidationSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
    } else {
      const headData = req.body;
      const head = new head(headData);
      const foundhead = await head.findOne({ email: headData.email });

      if (!foundhead) {
        res.status(400).send("Email or Password is wrong");
      } else {
        const validPass = await bcrypt.compare(
          head.password,
          foundhead.password
        );
        if (!validPass) {
          res.status(400).send("Email or Password is wrong");
        } else {
          const token = jwt.sign(
            { _id: foundhead._id },
            process.env.TOKEN_SECRET
          );
          res.status(200).send({
            authToken: token,
            name: foundhead.name,
            email: foundhead.email,
            _id: foundhead._id,
            isAmdin: foundhead.isAdmin,
          });
        }
      }
    }
  },
};

module.exports = headController;

// router.post("/login", async (req, res) => {
// });
