import Joi from 'joi';

export const borrowSchema = Joi.object({
  member_id: 
  Joi.number()
  .integer()
  .required(),
  book_id: 
  Joi.number()
  .integer()
  .required(),
  due_date: 
  Joi.date()
  .greater('now')
  .required()
});