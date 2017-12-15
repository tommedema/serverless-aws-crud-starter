# API

## ToDo

- s3 store for attachments, with appropriate user rights (inject bucket name into web build config)
- switch to using GraphQL

## Improvements
- use individual packaging
- organize s3 attachments bucket files by user folder rather than prefix
- consider adding [custom domain to API gateway](https://github.com/dougmoscrop/serverless-plugin-custom-domain)
- consider keeping lambdas warm using a plugin like serverless-plugin-warmup
- consider [not using api gateway proxy](https://read.acloud.guru/how-you-should-and-should-not-use-the-api-gateway-proxy-integration-f9e35479b993)
- consider using @babel/babel-env preset with target node 6.10
- consider [serverless aurora](https://serverless.com/blog/serverless-aurora-future-of-data/) instead of dynamodb
  - https://read.acloud.guru/why-amazon-dynamodb-isnt-for-everyone-and-how-to-decide-when-it-s-for-you-aefc52ea9476
  - otherwise at least enable [auto scaling for dynamodb](https://github.com/medikoo/serverless-plugin-dynamodb-autoscaling)
  - https://aws.amazon.com/about-aws/whats-new/2017/12/amazon-aurora-with-mysql-compatibility-natively-supports-synchronous-invocation-of-aws-lambda-functions/?utm_campaign=Serverless%2BDigest&utm_medium=email&utm_source=Serverless_Digest_16