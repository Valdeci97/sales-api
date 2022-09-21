import joi from 'joi';

const NOT_UUID_CUSTOMER_ID = '400/CustomerId field must be an uuid string!';
const NOT_UUID_PRODUCT_ID = '400/Id field must be an uuid string!';
const NOT_AVAILABLE_CUSTOMER_ID = '400/CustomerId field must be filled!';
const NOT_AVAILABLE_PRODUCT_ID = '400/Id field must be filled!';
const UNFILLED_NAME = '400/Name field must be filled!';
const STRING_BASE = '400/Name must be a string.';
const UNFILLED_PRICE = '400/Price field must be filled!';
const PRICE_GREATER_THAN_ZERO = '400/Price must be greater than zero!';
const PRICE_BASE = '400/Price must be a number!';
const QUANTITY_GREATER_THAN_ZERO =
  '400/Quantity field must be gretaer than zero!';
const QUANTITY_BASE = '400/Quantity must be a number!';

export const customerId = joi
  .object({
    customerId: joi.string().guid().required().messages({
      'any.required': NOT_AVAILABLE_CUSTOMER_ID,
      'string.guid': NOT_UUID_CUSTOMER_ID,
      'string.emprty': NOT_AVAILABLE_CUSTOMER_ID,
    }),
  })
  .unknown(true);

export const products = joi
  .object({
    products: joi
      .array()
      .items(
        joi.object({
          id: joi.string().guid().required().messages({
            'any.required': NOT_AVAILABLE_PRODUCT_ID,
            'string.guid': NOT_UUID_PRODUCT_ID,
            'string.empty': NOT_AVAILABLE_PRODUCT_ID,
          }),
          name: joi.string().required().messages({
            'any.required': UNFILLED_NAME,
            'string.empty': UNFILLED_NAME,
            'string.base': STRING_BASE,
          }),
          price: joi.number().greater(0).required().messages({
            'any.required': UNFILLED_PRICE,
            'number.greater': PRICE_GREATER_THAN_ZERO,
            'number.base': PRICE_BASE,
          }),
          quantity: joi.number().integer().greater(0).required().messages({
            'any.required': UNFILLED_PRICE,
            'number.greater': QUANTITY_GREATER_THAN_ZERO,
            'number.base': QUANTITY_BASE,
          }),
        })
      )
      .messages({
        'array.base': '400/products must be an array',
      }),
  })
  .unknown(true);
