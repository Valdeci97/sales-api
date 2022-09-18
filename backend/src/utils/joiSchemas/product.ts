import joi from 'joi';

const UNFILLED_NAME = '400/Name field must be filled!';
const MIN_LENGTH_NAME = '400/Name must have at least 3 characters!';
const UNFILLED_PRICE = '400/Price field must be filled!';
const PRICE_GREATER_THAN_ZERO = '400/Price must be greater than zero!';
const QUANTITY_GREATER_THAN_ZERO =
  '400/Quantity field must be gretaer than zero!';
const NAME_BASE = '400/Name must be a string!';
const PRICE_BASE = '400/Price must be a number!';
const QUANTITY_BASE = '400/Quantity must be a number!';

export const productName = joi
  .object({
    name: joi.string().min(3).required().messages({
      'any.required': UNFILLED_NAME,
      'string.empty': UNFILLED_NAME,
      'string.min': MIN_LENGTH_NAME,
      'string.base': NAME_BASE,
    }),
  })
  .unknown(true);

export const productPrice = joi
  .object({
    price: joi.number().greater(0).required().messages({
      'any.required': UNFILLED_PRICE,
      'number.greater': PRICE_GREATER_THAN_ZERO,
      'number.base': PRICE_BASE,
    }),
  })
  .unknown(true);

export const productQuantity = joi
  .object({
    quantity: joi.number().integer().greater(0).required().messages({
      'any.required': UNFILLED_PRICE,
      'number.greater': QUANTITY_GREATER_THAN_ZERO,
      'number.base': QUANTITY_BASE,
    }),
  })
  .unknown(true);
