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

1. node, aws cli
2. create aws account with api user with administrator rights
3. define aws profile based on project name and stage

### Installation
1. `$ git clone repo`
2. `$ STAGE=dev npm run deploy`

### Previewing branches
You can easily preview a new branch by deploying it under a different stage. E.g.:
`$ STAGE=<my_feature> npm run deploy`

### Cleanup
To remove a stage, run `STAGE=<my_feature> npm run remove` in the project directory.

## Required knowledge

While this starter helps you get on your way quickly, you'll have to be comfortable with the following technologies to be able to develop it further.

* AWS Lambda, Cloudformation, IAM
* Serverless framework
* Node.js and Javascript

## To document
- sub-service packages and commands
- changing stage
- how a AWS profile can be created for each ${PROJECT}-${STAGE} combination
  - why to use account based separation with a link to recommendation of amazon itself
- enabling a custom domain for a stage (e.g. production)
- requesting a certificate for a custom domain

## Improvements: general
- break-up long strings and sls variables into [multiple lines](https://stackoverflow.com/questions/3790454/in-yaml-how-do-i-break-a-string-over-multiple-lines#21699210)
- set more service-level parameters on a project-level
  - service-level serverless.yml
    - frameworkVersion
    - provider name, stage, variable syntax, region, stackTags
  - service-level package.json
    - scripts
    - engines
- way of orchestration can be improved with [declarative dependencies and orchestrated deployments and  rollbacks](https://forum.serverless.com/t/orchestrating-deployment-and-sharing-stack-outputs-in-a-declarative-manner-with-lerna-repos/3319)
  - use `Fn::ImportValue:` instead of `cf:` (also in plugins?)
  - https://github.com/serverless/serverless/pull/3575
- enable standard.js linting in build tools
- figure out why service level `npm run deploy` without STAGE env var does not print exception
- consider using official lerna repo structure
- ensure that exceptions always have a stack trace in [cloudwatch](https://github.com/serverless-heaven/serverless-webpack/issues/291)
- consider using [cloudformation changesets](https://github.com/trek10inc/serverless-cloudformation-changesets) with reviews prior to deployment
- consider using [AWS SAM](https://d1.awsstatic.com/whitepapers/serverless-architectures-with-aws-lambda.pdf) as an abstraction layer on top of cloudformation
- prompt prior to replacing special resources like dynamodb, s3, cloudfront

## To do: general
- ensure that `npm install` is run prior to deploy
- implement service-level and project-level `npm run remove` with s3-remover plugin
- use standard.js code style with linter for both backend and frontend

## To do: TDD / local development
Including the mocking of AWS services like DynamoDB. To the extent that this is possible and not cumbersome. Also consider alternative approach where a TDD approach is used locally and you have to deploy to see integration with services working.

Relevant resources
- https://kalinchernev.github.io/tdd-serverless-jest/?utm_campaign=Serverless%2BDigest&utm_medium=email&utm_source=Serverless_Digest_16
- https://github.com/serverless/examples/tree/master/aws-node-rest-api-with-dynamodb-and-offline
- https://serverless.com/blog/event-driven-serverless-app-local-dev-exp
- https://serverless.com/blog/serverless-ops-logs/
- https://serverless.com/blog/serverless-ops-metrics/

## Next considerations
- read the AWS well-architected serverless lens [whitepaper](https://d1.awsstatic.com/whitepapers/architecture/AWS-Serverless-Applications-Lens.pdf)
- integrated [cloud IDE](https://aws.amazon.com/cloud9/) with debugging and CI
  - https://dev.to/kayis/10-easy-steps-to-create-aws-lambda-functions-with-the-serverless-framework--reason-in-aws-cloud9-8d1?utm_campaign=Serverless%2BDigest&utm_medium=email&utm_source=Serverless_Digest_16
  - http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html
  - https://dev.to/kayis/10-easy-steps-to-create-aws-lambda-functions-with-the-serverless-framework--reason-in-aws-cloud9-8d1?utm_campaign=Serverless%2BDigest&utm_medium=email&utm_source=Serverless_Digest_15
- CI/CD as code
  - https://github.com/serverless/blog/blob/master/posts/2017-02-22-cicd-for-serverless-part-2.md
  - (Gitlab or [AWS Codepipeline](https://cloudonaut.io/aws-velocity-serverless-app/))
  - https://forums.aws.amazon.com/ann.jspa?annID=5240
  - [circleCI](https://serverless.com/blog/ci-cd-workflow-serverless-apps-with-circleci/)
- automatically generated documentation
- green/blue deployments
- integrated agile development tooling (scrumban)

## Ask feedback
- https://forum.serverless.com/u/bill
- https://forum.serverless.com/u/kalinchernev
- https://gitter.im/alexdebrie
- https://gitter.im/HyperBrain
- https://og-aws.slack.com/archives/C2M3XL0QP/p1512663131000753
- https://serverless.com/blog/announcing-first-cohort-serverless-champions-2017/
- Sindre
- Geoffrey
- Serverless chronicle