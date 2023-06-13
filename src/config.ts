import { readFileSync } from "fs";
import * as yaml from 'js-yaml'
import {join} from 'path'
import * as _ from 'lodash'

const commonConfigFileName = 'config.yml'
const filePath = join(__dirname, '../config1',commonConfigFileName)
const envPath = join(__dirname, '../config1', `config.${process.env.NODE_ENV||'development'}.yml`)

const commonConfig = yaml.load(readFileSync(filePath).toString())
const envConfig = yaml.load(readFileSync(envPath).toString())

console.log(_.merge(commonConfig,envConfig))

export default () => {
  return _.merge(commonConfig,envConfig)
}