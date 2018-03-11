# serverless-aws-crud-starter

Serverless is a new paradigm that's easy to get started with but introduces several questions once applied on a larger scale. This starter kit aims to resolve most of these issues in an opinionated manner and allows for the almost instantaneous bootstrapping of maintainable serverless projects. These projects are typically geared towards web applications, including both front and backend. In addition to answering questions on how a large serverless project can remain maintainable, it also provides most of the boilerplate that web applications need, including but not limited to:

* the spawning of databases
* authentication, including social providers such as Google and Facebook
* the ability to perform create, read, update, delete operations with an API
* the deployment, hosting, and caching of server-side-rendered React applications
* the automatic configuration of a provided domain name, including HTTPS enforcement and www. prefix forwarding
* the automatic requesting, validation, and renewal of SSL certificates

All of this is done while adhering to the following core principles of this library:

* 100% version controlled (infrastructure as code)
* 100% serverless (potentially infinite scalability)
* highly maintainable (function and component level modularity)
* test driven development

## Getting started

### Prerequisites

1. Node.js
2. AWS cli
3. AWS account with an API user with administrator rights

### Installation
1. `$ git clone repo`
2. edit `package.json` with your project's name, AWS region, and optionally define your domain names (per stage)
3. define aws profile based on project name and stage
4. `npm install`
5. `$ STAGE=dev npm run deploy`

### AWS profile configuration
For security reasons, each project and stage combination is recommended to run on its own sandboxed AWS account. If you are running multiple non-production environments, it's acceptable to deploy these to the same account, but you still need to create an AWS profile for each. A AWS profile is named after the project's name postfixed by a hyphen (`-`) and the name of your stage. You should add these profiles to your `~/.aws/credentials` file. For example:

_~/.aws/credentials_
```
[serverless-aws-crud-starter-prod]
aws_access_key_id = XXXXXXXXXXXXXXXXXXXX
aws_secret_access_key = YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
[serverless-aws-crud-starter-dev]
aws_access_key_id = XXXXXXXXXXXXXXXXXXXX
aws_secret_access_key = YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

### Previewing branches
You can easily preview a new branch by deploying it under a different stage. E.g.:
`$ STAGE=<my_feature> npm run deploy`

### Adding a domain
If you have a domain, simply add it to your package.json under `slsConfig.domains.${stage_name}` where `${stage_name}` is the name of your stage or environment (e.g. dev, prod, or a name of a feature branch):

_package.json_
```
{
  ...
  "slsConfig": {
    "region": "eu-west-2",
    "domains": {
      "dev": {
        "name": "my-domain.com",
        "requestCertificate": true
      }
    }
  },
  ...
}
```

Once deployed, you will be informed to set your domain's nameservers. If you have `requestCertificate` set to true, a certificate will be requested and validated automatically as soon as your nameservers are set up. Once validated, the next deploy will cause the certificate to be activated and for all traffic to start using the `https` protocol. Certificates are automatically renewed. In summary, you may have to deploy twice to get a fully functioning SSL-enabled domain:
1. The first deploy creates your hosted zones and informs you about the nameservers you should set your domain to. It will also request a certificate and prepare DNS based domain validation entries for your hosted zone.
2. Subsequent deploys will check if your domain is now propagating correctly to your hosted zone. If so, it will be verified automatically by AWS Certificate Manager through DNS (this may take up to 2 hours). Once you deploy while the certificate is verified, it will start to be used by the cloudfront distributions and all HTTP traffic will be redirected to HTTPS.

### Deploying and removing individual services
To deploy or remove an individual service, simply navigate to that service's directory, and run `STAGE=dev npm run deploy` or `STAGE=dev npm run remove`.

### Cleanup
To remove a stage, run `STAGE=<my_feature> npm run remove` in the project directory.

## Required knowledge

While this starter helps you get on your way quickly, you'll have to be comfortable with the following technologies to be able to develop it further and customize it to an actual project.

* AWS Lambda, AWS Cloudformation, AWS IAM, AWS Cognito
* Serverless Framework
* Node.js and Javascript ES6

This is only the first phase of this starter. Based on my experience as a CTO at a highly valued scale-up, it is the integration of infrastructure, platform, and tooling that enables a development team to achieve a stable and high velocity. The vision of this project is to allow for the instant spawning of such projects, without having to put much thought into infrastructural or managerial decisions again. This includes a seamless continuous integration or even deployment process, the instant availability of a fully-featured development environment, as well as the use of proven software development methodologies such as scrum or scrumban. As such, in a next phase of this starter, the following optional additions will be considered:

* automatic setup of a full continuous integration process, with multi-branching
* automatic provisioning of a fully featured development environment using Cloud9
* automatic setup of a scrumban project and board for each root project and service, connected with CI

Since these last features are more distant from code, they can be opted out from.

## Future

Find the current roadmap [here](TODO.md).

This is only the first phase of this starter. Based on my experience as CTO at a highly valued scale-up, it is the integration of infrastructure, platform, and tooling that enables a development team to achieve a stable and high velocity. The vision of this project is to allow for the near instant spawning of such projects, without having to put much thought into infrastructural or managerial decisions again. This includes a seamless continuous integration or even deployment process, the instant availability of a fully-featured development environment, as well as the use of proven agile software development methodologies such as scrum. As such, in a next phase of this starter, the following optional additions will be considered:

* automatic setup of a full continuous integration process, with multi-branching
* automatic provisioning of a fully featured development environment using Cloud9
* automatic setup of a scrumban project and board for each root project and service, connected with CI

Since these last features are more distant from code, they can be opted out from.

