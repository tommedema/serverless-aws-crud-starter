const getOutputFactory = require('../../../../lib/get-cf-output')
const readPkg = require('read-pkg')
const path = require('path')
const rootPkg = readPkg.sync(path.resolve(process.cwd(), '../..'))
const projectName = rootPkg.name
const get = require('lodash.get')
const promisify = require('pify')
const dn = promisify(require('dn'))
const dnsResolverIp = '8.8.8.8'

class WarnNameservers {
  constructor(serverless, options) {
    // members
    this.serverless = serverless
    this.options = options
    this.getOutput = getOutputFactory(serverless)
    
    // bindings
    this.log = this.log.bind(this)
    this.warnNameservers = this.warnNameservers.bind(this)
    
    // hooks
    this.hooks = {
      'after:deploy:finalize': this.warnNameservers
    }
  }
  
  async warnNameservers() {
    const domain = get(rootPkg, ['slsConfig', 'domains', this.options.stage, 'name'])
    if (!domain) {
      return this.log('no need to check nameservers as no domain is configured')
    }
    
    let hostedZoneNameServers = this.getOutput('WebHostedZoneNameServers')
    if (!hostedZoneNameServers) {
      return this.log(`
        
        ERROR: a domain ${domain} is defined for this stage,
        but no hosted zone nameservers were returned as cloudformation output
        
      `)
    }
    
    let { answer: results } = await dn.dig(domain, 'NS', dnsResolverIp)
    results = results.map(o => o.data).sort().join(',')
    hostedZoneNameServers = hostedZoneNameServers.split(',').sort().join(',')
    
    if (results !== hostedZoneNameServers) {
      this.log(`
        
        WARNING: nameservers of domain ${domain} do not yet propagate to the
        nameservers of the route53 hosted zone.
        
        Your current nameservers propagate to:
        ${results}
        
        Please set your nameservers to:
        ${hostedZoneNameServers}
        
      `)
    }
    else {
      this.log(`nameservers for domain ${domain} are configured and propagate correctly from Google's DNS resolver at ${dnsResolverIp}`)
    }
    
  }
  
  log(msg) {
    this.serverless.cli.log(`Warn-nameservers: ${msg}`)
  }
}

module.exports = WarnNameservers