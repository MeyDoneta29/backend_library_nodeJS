import Joi from "joi";

export const registerSchema = Joi.object({
    name:
     Joi.string()
     .min(3)
     .max(30)
     .required()
     .messages({
            'string.base': 'Le nom doit etre une chaine de caracteres',
            'string.empty': 'Le nom ne peut pas etre vide',
            'string.min': 'Le nom doit comporter au moins 3 caracteres',
            'string.max': 'Le nom doit comporter au maximum 30 caracteres',
        }),
    email:
     Joi.string()
     .email()
     .required(),
    password: 
    Joi.string()
    .min(6)
    .required()
});