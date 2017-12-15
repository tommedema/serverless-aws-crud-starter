# Domains

## ToDo
- add redirect to domains service
  - create redirect s3 bucket and cloudfront dist
  - create A records in hosted zone for redirect cloudfront dist
  - invalidate redirect cloudfront distribution on web deploy
  - include domain alias in redirect cloudfront dist
  
## Improvements
- move `warn-nameservers` plugin outside of this repo and publish to NPM