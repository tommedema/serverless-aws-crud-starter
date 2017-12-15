const readPkg = require('read-pkg')
const path = require('path')
const execa = require('execa')
const env = require('require-env')

async function main() {
  const servicePath = process.env.SERVICE_PATH || process.cwd()
  const rootPath = path.resolve(servicePath, '../..')
  const servicePkg = await readPkg(servicePath)
  const rootPkg = await readPkg(rootPath)
  
  const opts = {
    servicePath,
    rootPath,
    servicePkg,
    rootPkg,
    stage: env.require('STAGE'),
    region: rootPkg.slsConfig.region,
    serviceName: servicePkg.name,
    projectName: rootPkg.name
  }
  
  console.log(`deploying service ${opts.serviceName}`)
  await deployService(opts)
  console.log(`deployed service ${opts.serviceName}`)
}

async function deployService({ projectName, rootPath, stage, region, servicePath }) {
  await execa(path.resolve(rootPath, 'node_modules/serverless/bin/serverless'), [
     'deploy', '--aws-s3-accelerate', '--verbose',
     '--region', region,
     '--stage', stage
  ].concat(process.argv.slice(2)), {
    cwd: servicePath,
    stdout: process.stdout,
    env: {
      'AWS_PROFILE': `${projectName}-${stage}`
    }
  })
}

(async () => {
  try {
    await main()
  } catch (err) {
    console.error(err)
    process.exit(err.code)
  }
})()