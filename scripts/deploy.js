const listDirectories = require('list-directories')
const execa = require('execa')
const env = require('require-env')
const path = require('path')

async function main() {
  const services = Array.from(await listDirectories(path.resolve(__dirname, '../services'))).sort()
  const stage = env.require('STAGE')
  
  await execa('npm', ['install'], { cwd: path.resolve(__dirname, '..'), stdout: process.stdout })
  
  for (let servicePath of services) {
    await deployService(servicePath, stage)
  }
  
  console.log(`deployed services:\n${services.map((p) => path.basename(p)).join('\n')}`)
}

async function deployService(servicePath, stage) {
  await execa('npm', ['install'], { cwd: servicePath, stdout: process.stdout })
  
  await execa('npm', ['run', 'deploy', '--'].concat(process.argv.slice(2)), {
    cwd: servicePath,
    env: {
      STAGE: stage
    },
    stdout: process.stdout
  })
}

main().catch(err => { throw err })