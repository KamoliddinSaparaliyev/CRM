const Joi = require("joi");

/**
 *
 * @param {Joi.Schema} schema
 * @returns
 */
module.exports = function genValidator(schema) {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      throw new BadReqqustError(error.details[0].message);
    }
  };
};
