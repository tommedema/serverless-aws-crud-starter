const readPkg = require('read-pkg')
const path = require('path')
const execa = require('execa')
const env = require('require-env')
const servicePath = process.env.SERVICE_PATH || process.cwd()
const rootPath = path.resolve(servicePath, '../..')
const command = process.argv[2]
const args = process.argv.slice(3)

async function main() {
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
  
  console.log(`running ${command} for service ${opts.serviceName}`)
  await runForService(opts)
  console.log(`ran ${command} for service ${opts.serviceName}`)
}

async function runForService({ projectName, rootPath, stage, region, servicePath }) {
  await execa(path.resolve(rootPath, 'node_modules/serverless/bin/serverless'), [
     command, '--aws-s3-accelerate', '--verbose',
     '--region', region,
     '--stage', stage
  ].concat(args), {
    cwd: servicePath,
    stdout: process.stdout,
    env: {
      'AWS_PROFILE': `${projectName}-${stage}`
    }
  })
}

main().catch(err => console.error(err))