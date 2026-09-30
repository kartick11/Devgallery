const Joi = require("joi");

const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    // Updated to match your frontend formData keys
    organizationName: Joi.string().min(3).max(100).required(),
    officialEmail: Joi.string().email().required(),
    phoneNumber: Joi.string().min(10).max(15).required(),
    pin: Joi.string().length(4).required(),
    password: Joi.string().min(4).max(100).required(),
    otp: Joi.string().length(6).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Bad request",
      // This extracts the specific missing/invalid field message for easier debugging
      error: error.details[0].message,
    });
  }
  next();
};
const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Bad request", error });
  }
  next();
};

module.exports = {
  signupValidation,
  loginValidation,
};
