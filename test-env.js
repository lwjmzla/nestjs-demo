// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const env = 'development';
const rootPath = path.resolve(process.cwd(), `.env.${env}`); // D:\web\nestjs-demo\.env.development
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: rootPath });
console.log(process.env);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('config');
const ENV = config.get('ENV');
console.log(ENV);
