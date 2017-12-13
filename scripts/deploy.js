const listDirectories = require('list-directories')
const execa = require('execa')
const env = require('require-env')
const path = require('path')

async function main() {
  const services = Array.from(await listDirectories(path.resolve(__dirname, '../services')))
  const stage = env.require('STAGE')
  
  for (let servicePath of services) {
    await deployService(servicePath, stage)
  }
  
  console.log(`deployed services:\n${services.map((p) => path.basename(p)).join('\n')}`)
}

async function deployService(servicePath, stage) {
  await execa('npm', ['run', 'deploy'], {
    cwd: servicePath,
    env: {
      STAGE: stage
    },
    stdout: process.stdout
  })
}

(async () => {
  try {
    main()
  }
  catch (err) {
    console.error(err)
    process.exit(err.code)
  }
})()