# Web

## ToDo

1. consider SSR alternatives
  - [Gatsby](https://www.gatsbyjs.org/)
  - [React Slingshot](https://github.com/coryhouse/react-slingshot)
  - [Create react app](https://github.com/facebookincubator/create-react-app) (does not seem to have SSR)

2. implement non-conflicting modular css or javascript based styling

3. consider alternative to using bootstrap

4. consider using flexbox layout

5. no fixed pixel (incl margins/paddings) based styling (prefer vw, vh)

6. state management with redux and observable or RxJS

7. stop using confusing [RouteNavItem](https://github.com/AnomalyInnovations/serverless-stack-com/issues/35) component

8. consider using something like redux form for form [validation](https://serverless-stack.com/chapters/create-a-login-page.html); i.e. validate with config, not code

9. use device keynames (phone, tablet, desktop, retina) instead of arbitrary media query pixels https://serverless-stack.com/chapters/create-a-login-page.html

10. make more dumb components that are reusable rather than large containers like Login, NewNote etc.; load data based on router events rather than component life cycle events to make components more reusable

11. avoid using globals like window.confirm which are asynchronous but not promises

12. consider if all async functions should be defined as async (including notes() fn etc), or only when using `await`

13. use Typescript

14. resolve 404s to `/favicon-32x32.png Failed to load resource: net::ERR_INSECURE_RESPONSE` and 16x16.png

Relevant resources
- https://blog.shovonhasan.com/deploying-a-typescript-node-aws-lambda-function-with-serverless
- https://github.com/serverless/examples/tree/master/aws-node-typescript-rest-api-with-dynamodb)

## Improvements

- prevent [caching of service-worker.js using custom headers](https://github.com/facebookincubator/create-react-app/tree/master/packages/react-scripts/template#offline-first-considerations)
- only rebuild and redeploy web app when necessary, instead of only when --web is provided
  - web app code changed
  - cloudformation references injected into web app changed
- investigate when cloudfront is not caching (`x-cache:Miss from cloudfront`)
- move `deploy-react-app` plugin outside of this repo and publish to NPM