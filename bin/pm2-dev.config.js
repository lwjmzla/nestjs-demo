// eslint-disable-next-line @typescript-eslint/no-var-requires
const appConf = require('./pm2AppConf')

// 为了测试方便，pm2 进程设置为 1
appConf.instances = 2

module.exports = {
  apps: [appConf],
}
