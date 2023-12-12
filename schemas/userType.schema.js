'use strict';

const Joi = require('joi');

const userTypeSchema = Joi.object({
    UserType: Joi.string()
    .required()
    .messages({
        'any.required': 'UserType is required',
    })
});

module.exports = { userTypeSchema };