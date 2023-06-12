// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const rootPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`); // D:\web\nestjs-demo\.env.development
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: rootPath });
console.log(process.env.ENV);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('config');
const ENV = config.get('ENV');
console.log(ENV);
