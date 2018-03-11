const listDirectories = require('list-directories')
const execa = require('execa')
const path = require('path')
const env = require('require-env')
const stage = env.require('STAGE')
const command = process.argv[2]
const direction = process.argv[3]
const args = process.argv.slice(4)
const servicesPath = path.resolve(__dirname, '../services');

async function main() {
  let services = Array
    .from(await listDirectories(servicesPath))
    .sort()
    
  if (direction === 'z-a') {
    services = services.reverse()
  }
  
  for (let servicePath of services) {
    await runForService(servicePath, stage)
  }
  
  console.log(`
    ran ${command} for services:
    ${services.map((p) => path.basename(p)).join('\n')}
  `)
}

async function runForService(servicePath, stage) {
  if (command === 'deploy') {
    await execa('npm', ['install'], {
      cwd: servicePath,
      stdout: process.stdout
    })
  }
  
  await execa('npm', ['run', command, '--'].concat(args), {
    cwd: servicePath,
    env: {
      STAGE: stage
    },
    stdout: process.stdout
  })
}

main().catch(err => console.error(err))