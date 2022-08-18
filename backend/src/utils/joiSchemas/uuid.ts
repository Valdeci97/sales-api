import joi from 'joi';

const NOT_AVAILABLE_ID = '400/There is no available id param!';
const NOT_UUID_ID = '400/Id param must be an uuid string!';
const NOT_AVAILABLE_BODY_ID = '400/Token field must be filled!';

export const uuidSchema = joi.string().guid().required().messages({
  'any.required': NOT_AVAILABLE_ID,
  'string.guid': NOT_UUID_ID,
});

export const uuidBodySchema = joi
  .object({
    token: joi.string().guid().required().messages({
      'any.required': NOT_AVAILABLE_BODY_ID,
      'string.guid': NOT_UUID_ID,
    }),
  })
  .unknown(true);
