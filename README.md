# serverless-aws-crud-starter

Serverless is a new paradigm that's easy to get started with but introduces several questions once applied on a large scale. This starter kit aims to resolve most of these issues in an opinionated manner and allows for the almost instantaneous bootstrapping of maintainable serverless projects. These projects are typically geared towards web applications, including both front and backend. In addition to answering questions on how a large serverless project can remain maintainable, it also provides most of the boilerplate that web applications need, including but not limited to:

* authentication, including social providers such as Google and Facebook
* the ability to perform CRUD operations with GraphQL
* the deployment, hosting, and caching of server-side-rendered React applications based on Gatsby.js
* the automatic configuration of a provided domain name, including https and www. prefix forwarding
* the automatic requesting, validation, and renewal of SSL certificates

All of this is done while adhering to the following core principles of this library:

* 100% version controlled (infrastructure as code)
* 100% serverless (potentially infinite scalability)
* highly maintainable (function and component level modularity)

This is only the first phase of this starter. Based on my experience as a CTO at a highly valued scale-up, it is the integration of infrastructure, platform, and tooling that enables a development team to achieve a stable and high velocity. The vision of this project is to allow for the instant spawning of such projects, without having to put much thought into infrastructural or managerial decisions again. This includes a seamless continuous integration or even deployment process, the instant availability of a fully-featured development environment, as well as the use of proven software development methodologies such as scrum or scrumban. As such, in a next phase of this starter, the following optional additions will be considered:

* automatic setup of a full continuous integration process, with multi-branching
* automatic provisioning of a fully featured development environment using Cloud9
* automatic setup of a scrumban project and board for each root project and service, connected with CI

Since these last features are more distant from code, they can be opted out from.

## Usage

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

### Cleanup
To remove a stage, run `STAGE=<my_feature> npm run remove` in the project directory.

## Required knowledge

While this starter helps you get on your way quickly, you'll have to be comfortable with the following technologies to be able to develop it further and customize it to an actual project.

* AWS Lambda, AWS Cloudformation, AWS IAM, AWS Cognito
* Serverless Framework
* Node.js and Javascript ES6

## To document < 1.0.0
- sub-service packages and commands
- changing stage
- how a AWS profile can be created for each ${PROJECT}-${STAGE} combination
  - why to use account based separation with a link to recommendation of amazon itself
- dev dependencies are in project level's package.json

## To do: general < 1.0.0
- consider creating separate db service (and take it out from api service)
- create [sls deploy PR](https://github.com/serverless/serverless/issues/4545)
- fork s3-remover to support `Ref:` and use it for `npm run remove`
- use standard.js code style with linter for both backend and frontend
- pull in upstream changes from https://serverless-stack.com/chapters/changelog.html

## To do: TDD / local development < 1.0.0
Including the mocking of AWS services like DynamoDB. To the extent that this is possible and not cumbersome. Also consider alternative approach where a TDD approach is used locally and you have to deploy to see integration with services working.

Relevant resources
- https://trackchanges.postlight.com/introducing-postlights-modern-serverless-starter-kit-53ebfbf4459f
- https://kalinchernev.github.io/tdd-serverless-jest/?utm_campaign=Serverless%2BDigest&utm_medium=email&utm_source=Serverless_Digest_16
- https://github.com/serverless/examples/tree/master/aws-node-rest-api-with-dynamodb-and-offline
- https://serverless.com/blog/event-driven-serverless-app-local-dev-exp
- https://serverless.com/blog/serverless-ops-logs/
- https://serverless.com/blog/serverless-ops-metrics/
- https://www.jeremydaly.com/stub-aws-services-lambda-functions-using-serverless-sinon-js-promises/

## Improvements: general < 1.0.0
- ensure that exceptions always have a stack trace in [cloudwatch](https://github.com/serverless-heaven/serverless-webpack/issues/291)
  - create [sample project](https://github.com/serverless-heaven/serverless-webpack/issues/297#issuecomment-353208338)
  - consider if this might be due to a unhandled promise rejection or uncaught exception
- break-up long strings and sls variables into [multiple lines](https://stackoverflow.com/questions/3790454/in-yaml-how-do-i-break-a-string-over-multiple-lines#21699210)
- set more service-level parameters on a project-level
  - service-level serverless.yml
    - frameworkVersion
    - provider name, stage, variable syntax, region, stackTags
  - service-level package.json
    - scripts
    - engines

## Improvements: general > 1.0.0
- way of orchestration can be improved with [declarative dependencies and orchestrated deployments and  rollbacks](https://forum.serverless.com/t/orchestrating-deployment-and-sharing-stack-outputs-in-a-declarative-manner-with-lerna-repos/3319)
  - use `Fn::ImportValue:` instead of `cf:` (also in plugins?)
  - https://github.com/serverless/serverless/pull/3575
- figure out why service level `npm run deploy` without STAGE env var does not print exception
- consider using official lerna repo structure
- consider using [cloudformation changesets](https://github.com/trek10inc/serverless-cloudformation-changesets) with reviews prior to deployment
- consider using [AWS SAM](https://d1.awsstatic.com/whitepapers/serverless-architectures-with-aws-lambda.pdf) as an abstraction layer on top of cloudformation
- prompt prior to replacing special resources like dynamodb, s3, cloudfront

## Next considerations > 1.0.0
- move url-to-static-clone to lambda
  - consider https://serverless.com/blog/serverless-application-for-long-running-process-fargate-lambda/ for long running processes
- consider best practices
  - read https://www.jeremydaly.com/securing-serverless-a-newbies-guide/
  - read https://read.acloud.guru/our-serverless-journey-part-2-908d76d03716
  - watch https://www.youtube.com/watch?v=_mB1JVlhScs
  - read the AWS well-architected serverless lens [whitepaper](https://d1.awsstatic.com/whitepapers/architecture/AWS-Serverless-Applications-Lens.pdf)
- CI/CD as code
  - https://docs.aws.amazon.com/solutions/latest/aws-cloudformation-validation-pipeline
  - https://github.com/serverless/blog/blob/master/posts/2017-02-22-cicd-for-serverless-part-2.md
  - (Gitlab or [AWS Codepipeline](https://cloudonaut.io/aws-velocity-serverless-app/))
  - https://forums.aws.amazon.com/ann.jspa?annID=5240
  - [circleCI](https://serverless.com/blog/ci-cd-workflow-serverless-apps-with-circleci/), see [example project](https://github.com/v-studios/scaffold-serverless)
  - https://cur.at/82FDI4c?m=email&sid=996pNM9
  - green/blue deployments
  - example with travisCI described [here](http://www.rowellbelen.com/microservice-starter-template/) with source [here](https://github.com/bytekast/serverless-templates/tree/master/microservice-starter  )
- consider [Go](https://yos.io/2018/02/08/getting-started-with-serverless-go/?utm_campaign=Serverless%2BDigest&utm_medium=email&utm_source=Serverless_Digest_23)
- consider further debugging tools like [Thundra](https://serverless.com/blog/state-of-serverless-observability-why-we-built-thundra/)
- integrated [cloud IDE](https://aws.amazon.com/cloud9/) with debugging and CI
  - https://dev.to/kayis/10-easy-steps-to-create-aws-lambda-functions-with-the-serverless-framework--reason-in-aws-cloud9-8d1?utm_campaign=Serverless%2BDigest&utm_medium=email&utm_source=Serverless_Digest_16
  - http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html
  - https://dev.to/kayis/10-easy-steps-to-create-aws-lambda-functions-with-the-serverless-framework--reason-in-aws-cloud9-8d1?utm_campaign=Serverless%2BDigest&utm_medium=email&utm_source=Serverless_Digest_15
  - https://read.acloud.guru/some-quick-thoughts-on-blue-green-deployment-for-lambda-with-cloudformation-ac66797984f
- automatically generated documentation
- integrated agile development tooling (scrumban)
- consider creating an apex-terraform-starter with same functionality for comparison

## Ask feedback for v1.0.0
- https://forum.serverless.com/u/kalinchernev
- https://gitter.im/alexdebrie
- https://gitter.im/HyperBrain
- https://og-aws.slack.com/archives/C2M3XL0QP/p1512663131000753
- https://serverless.com/blog/announcing-first-cohort-serverless-champions-2017/
- Sindre
- Serverless chronicle
- Youri van der lans; Dojo Developers group