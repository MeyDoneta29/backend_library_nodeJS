import Joi from 'joi';

export const memberSchema = Joi.object({
  first_name: 
        Joi.string()
        .min(2)
        .max(100)
        .required(),
  last_name: 
        Joi.string()
        .min(2)
        .max(100)
        .required(),
  email: 
        Joi.string()
        .email()
        .optional()
        .allow('', null),
  phone: 
        Joi.string()
        .optional()
        .allow('', null),
  address: 
        Joi.string()
        .optional()
        .allow('', null),
  status: 
        Joi.string()
        .valid('active', 'inactive')
        .optional()
});