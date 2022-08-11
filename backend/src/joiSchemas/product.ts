import joi from 'joi';

const UNFILLED_NAME = '400/Name field must be filled!';
const MIN_LENGTH_NAME = '400/Name must have at least 3 characters!';
const UNFILLED_PRICE = '400/Price field must be filled!';
const PRICE_GREATER_THAN_ZERO = '400/Price must be greater than zero';
const QUANTITY_GREATER_THAN_ZERO =
  '400/Quantity field must be gretaer than zero!';

export const productName = joi.object({
  name: joi.string().min(3).required().messages({
    'any.required': UNFILLED_NAME,
    'string.empty': UNFILLED_NAME,
    'string.min': MIN_LENGTH_NAME,
  }),
});

export const productPrice = joi.object({
  price: joi.number().greater(0).required().messages({
    'any.required': UNFILLED_PRICE,
    'number.greater': PRICE_GREATER_THAN_ZERO,
  }),
});

export const productQuantity = joi.object({
  quantity: joi.number().greater(0).required().messages({
    'any.required': UNFILLED_PRICE,
    'number.greater': QUANTITY_GREATER_THAN_ZERO,
  }),
});
