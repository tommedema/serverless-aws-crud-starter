# SSL

## ToDo < 1.0.0

- properly provide physical ID from lambda to prevent unexpected Delete requests to the "old" service
  - change to https://www.npmjs.com/package/cfn-responder
  - delete created certificates on actual stack deletion (perhaps use tags to identify?)
  - http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cfn-customresource.html  
  - http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources-sns.html#crpg-walkthrough-stack-updates
  - http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks.html
  
## Improvements < 1.0.0

- rewrite substitute-certificate-valid to use async/await
- after writing unit tests, refactor request-certificate.js async.forever to use [do/while with async/await](https://github.com/caolan/async/issues/1503#issuecomment-350576515)

## Improvements > 1.0.0
- prevent repackaging when functions have not changed
- when possible, remove need for custom lambda backed resource to create DNS validated ACM certificates and do this [directly through cloudformation](https://aws.amazon.com/blogs/security/easier-certificate-validation-using-dns-with-aws-certificate-manager/#comment-3651528530)
  - remove the need to have a plugin that checks if certificate is valid
- don't package aws-sdk once [lambda version](http://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html) is >= 2.156; and then enable individual packaging
- move `substitute-certificate-valid` plugin outside of this repo and publish to NPM
- figure out a way to prevent [circular dependencies](https://github.com/serverless/serverless/pull/3575) such that the route53 recordsetgroup specific for SSL validation CNAME records can be put into the ssl domain instead of the domains domain