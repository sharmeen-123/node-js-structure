const User = require("../models/user.model");

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

const userController = {
  async register(req, res) {
    const { error } = registerValidationSchema.validate(req.body);
    if (error) {
      console.log(error.details[0].message);
      res.status(400).send(error.details[0].message);
    } else {
      let userData = req.body;
      let user = new User(userData);
      const emailExists = await User.findOne({
        email: user.email,
      });
      if (emailExists) {
        console.log("already exisits");
        res.status(400).send("Email address Already exists try loging in");
      } else {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.save((error, registeredUser) => {
          if (error) {
            res.send(error.message);
          } else {
            const token = jwt.sign(
              { _id: registeredUser._id },
              process.env.TOKEN_SECRET
            );
            res.status(200).send({
              authToken: token,
              name: registeredUser.name,
              email: registeredUser.email,
              _id: registeredUser._id,
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
      const userData = req.body;
      const user = new User(userData);
      const foundUser = await User.findOne({ email: userData.email });

      if (!foundUser) {
        res.status(400).send("Email or Password is wrong");
      } else {
        const validPass = await bcrypt.compare(
          user.password,
          foundUser.password
        );
        if (!validPass) {
          res.status(400).send("Email or Password is wrong");
        } else {
          const token = jwt.sign(
            { _id: foundUser._id },
            process.env.TOKEN_SECRET
          );
          res.status(200).send({
            authToken: token,
            name: foundUser.name,
            email: foundUser.email,
            _id: foundUser._id,
            isAmdin: foundUser.isAdmin,
          });
        }
      }
    }
  },
};

module.exports = userController;

// router.post("/login", async (req, res) => {
// });
