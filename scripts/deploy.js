const readPkg = require('read-pkg')
const listDirectories = require('list-directories')
const execa = require('execa')

if (!process.env.STAGE) {
  throw new Error('STAGE environment variable is not set')
}

async function main() {
  const pkg = await readPkg()
  const services = await listDirectories(`${__dirname}/../services`)
  
  for (let servicePath of services) {
    const spkg = await readPkg(servicePath)
    console.log(`deploying ${spkg.name} version ${spkg.version}`)
    await deployService(servicePath, pkg.name, process.env.STAGE, pkg.region)
    console.log(`deployed ${spkg.name} version ${spkg.version}`)
  }
}

async function deployService(servicePath, project, stage, region) {
  await execa('npm', ['run', 'deploy'], {
    cwd: servicePath,
    env: {
      PROJECT: project,
      REGION: region,
      STAGE: stage
    },
    stdout: process.stdout
  })
}

main()