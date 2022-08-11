import joi from 'joi';

const NOT_AVAILABLE_ID = '400/There is no available id param!';
const NOT_UUID_ID = '400/Id param must be an uuid string!';

export const uuidSchema = joi.string().guid().required().messages({
  'any.required': NOT_AVAILABLE_ID,
  'string.guid': NOT_UUID_ID,
});
