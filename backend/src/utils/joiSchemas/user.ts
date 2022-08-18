import joi from 'joi';

const UNFILLED_NAME = '400/Name field must be filled!';
const MIN_NAME_LENGTH =
  '400/Name must be greater than or equal 3 characters length';
const UNFILLED_EMAIL = '400/Email field must be filled!';
const INVALID_EMAIL_TYPE =
  '400/Email must be a valid e-mail. i.e user@user.com';
const STRING_BASE = '400/It must be a string.';
const UNFILLED_PASSWORD = '400/Password field mus be filled!';
const MIN_PASSWORD_LENGTH =
  '400/Passwrod must be greater than or equal 8 characters length';

export const username = joi
  .object({
    name: joi.string().min(3).required().messages({
      'any.required': UNFILLED_NAME,
      'string.empty': UNFILLED_NAME,
      'string.min': MIN_NAME_LENGTH,
      'string.base': STRING_BASE,
    }),
  })
  .unknown(true);

export const userEmail = joi
  .object({
    email: joi.string().email().required().messages({
      'any.required': UNFILLED_EMAIL,
      'string.email': INVALID_EMAIL_TYPE,
      'string.base': STRING_BASE,
    }),
  })
  .unknown(true);

export const userPassword = joi
  .object({
    password: joi.string().min(8).required().messages({
      'any.required': UNFILLED_PASSWORD,
      'string.empty': UNFILLED_PASSWORD,
      'string.min': MIN_PASSWORD_LENGTH,
      'string.base': STRING_BASE,
    }),
  })
  .unknown(true);

export const userPasswordConfirmation = joi
  .object({
    passwordConfirmation: joi
      .string()
      .min(8)
      .required()
      .valid(joi.ref('password'))
      .messages({
        'any.required': UNFILLED_PASSWORD,
        'string.empty': UNFILLED_PASSWORD,
        'string.min': MIN_PASSWORD_LENGTH,
        'string.base': STRING_BASE,
        'any.only': '400/Password confirmation must be equal password field.',
      }),
  })
  .unknown(true);
