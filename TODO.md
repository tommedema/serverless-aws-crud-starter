## To document
- sub-service packages and commands
- changing stage
- how a AWS profile can be created for each ${PROJECT}-${STAGE} combination
  - why to use account based separation with a link to recommendation of amazon itself
- dev dependencies are in project level's package.json

## To do
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
  - use `Fn::ImportValue:` instead of `cf:` (also in plugins?) because this defines hard dependencies and prevents illegal deletes
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
  - https://read.acloud.guru/continuous-deployment-with-serverless-and-circleci-772f990820ee
  - https://docs.aws.amazon.com/lambda/latest/dg/automating-deployment.html
  - https://github.com/davidgf/serverless-plugin-canary-deployments
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