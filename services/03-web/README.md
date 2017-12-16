# Web

## Improvements < 1.0.0
- prevent [caching of service-worker.js using custom headers](https://github.com/facebookincubator/create-react-app/tree/master/packages/react-scripts/template#offline-first-considerations)
  - or set it to [1~5 mins](https://stackoverflow.com/questions/38843970/service-worker-javascript-update-frequency-every-24-hours/38854905#38854905)
- only rebuild and redeploy web app when necessary, or consider --web option < 1.0.0
  - change in source: web app code changed
  - change in build: cloudformation references injected into web app changed
- consider SSR or static alternatives (with serverless?)
  - [Gatsby](https://www.gatsbyjs.org/)
  - Next.js
  - [React Slingshot](https://github.com/coryhouse/react-slingshot)
  - [Create react app](https://github.com/facebookincubator/create-react-app) (does not seem to have SSR)

## ToDo > 1.0.0
- implement non-conflicting modular css or javascript based styling
- consider alternative to using bootstrap, use flexbox or cssgrid
- use Typescript
- state management with redux and observable or RxJS
- consider using something like redux form for form [validation](https://serverless-stack.com/chapters/create-a-login-page.html); i.e. validate with config, not code
- stop using confusing [RouteNavItem](https://github.com/AnomalyInnovations/serverless-stack-com/issues/35) component
- no fixed pixels (incl margins/paddings) based styling (prefer vw, vh)
- use device keynames (phone, tablet, desktop, retina) instead of arbitrary media query pixels https://serverless-stack.com/chapters/create-a-login-page.html
- make more dumb components that are reusable rather than large containers like Login, NewNote etc.; load data based on router events rather than component life cycle events to make components more reusable
- avoid using globals like window.confirm which are asynchronous but not promises
- resolve 404s to `/favicon-32x32.png Failed to load resource: net::ERR_INSECURE_RESPONSE` and 16x16.png

Relevant resources
- https://blog.shovonhasan.com/deploying-a-typescript-node-aws-lambda-function-with-serverless
- https://github.com/serverless/examples/tree/master/aws-node-typescript-rest-api-with-dynamodb)

## Improvements > 1.0.0

- move `deploy-react-app` plugin outside of this repo and publish to NPM