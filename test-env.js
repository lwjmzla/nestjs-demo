// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const rootPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`); // D:\web\nestjs-demo\.env.development
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dot = require('dotenv').config({ path: rootPath });
console.log(dot)
console.log(process.env.ENV);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('config');
const ENV = config.get('ENV');
console.log(ENV);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Joi = require('joi');

const schema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

  repeat_password: Joi.ref('password'),

  access_token: [
    Joi.string(),
    Joi.number()
  ],

  birth_year: Joi.number()
    .integer()
    .min(1900)
    .max(2013),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
  .with('username', 'birth_year')
  .xor('password', 'access_token')
  .with('password', 'repeat_password');

const { error, value } =  schema.validate({ username: 123, birth_year: 1994,access_token: {} });
// -> { value: { username: 'abc', birth_year: 1994 } }
console.log(error,value)

schema.validate({});
// -> { value: {}, error: '"username" is required' }

// Also -

// try {
//   const value = schema.validateAsync({ username: 'abc', birth_year: 1994 });
// }
// catch (err) { }

