# Vaping Regulations Front End

#### Requirements

- Docker installed on your host machine

#### Application setup

`cd app && npm i`

#### Running app locally

All run and build commands are handled by the Makefile at the app's root directory. Ensure your API is running.

- To run the app locally, `make local`, app will be available at *localhost/3000*
- Hot module reloading is enabled, all changes to files under ./src/ will automatically update the docker volume and trigger a webpage refresh
- **NB:** there are updates that require a container and image rebuild (eg: `make close-local-development && make local`)
- changes to files outside of `app/src`
- installing new node modules
- changing/creating typescript interface variables
- updating environment variables in the `.config` folder

If Makefile fails, you can instead:
- Run `make setup-local-env` from `/packages/bcer-retailer-app`
- Navigate to the `app` directory
- Run `npm run start` to expose the app at `localhost:3000`

This goes through the BCER development environment, and you must have a BCeID to authenticate.

#### Shared Components
This app has a number of shared components in the `bcer-shared-components` package. If you make any changes there, you must run `npm run build` within the `bcer-shared-components` package, and then rebuild your Frontend apps to see those changes reflected. You're able to develop locally within the shared-components package using Storybook, however. Please see the readme.

#### Environment Variables

Local development uses environment variables tied to the *Development* instance, which are included at build from `./.config/.env.dev`

To include the new variable in the *process.env* object, we must load it via Webpack:

- include the variable in `./.config/.env.dev`

- add the new variable's key to the list of environment variable keys in *./src/webpack.parts.js* in the exported `setEnvironmentVariable` method and set the value to `JSON.stringify(dotEnv.MyNewVariable)`, ie: follow the pattern as for the `BASE_URL` variable

## Building for other environments locally

Each build target has a corresponding make command, and allows the app to be built with environment variables specific to each of those environments.

To run the app locally for different build targets, enter **make local-{development, staging, production}** on the command line at the root directory.

**NOTE:** this does not affect process.env.NODE_ENV, this is only changed from **development** during a deployment, allowing the app to retain some context of it's environment.

#### Deploying the app

All app deployments to the development instance will be handled by the CI/CD pipeline

## Development

#### API

The application will set the base url to `process.env.BASE_URL`

#### useAxios

For authenticated requests, the customized useAxiosPost and useAxiosGet hooks in `hooks` will provide auth headers. Otherwise, the base `useAxios` hook provided by `axios-hooks` itself is sufficient

## Test

Jest is used to run tests: `npm run test`

Generate a coverage report with `npm run test:cov`


## Deployment
There are a couple of steps involved with deploying to each environment.

1. Build + package the app - run `ENVIRONMENT=<development|staging|prod> VERSION=<version> make package-app`. This will output `build.tar.gz` which contains the app.
2. Verify that the build worked

Note: it's encouraged to use the build functionality provided at the root of the project which will build all parts of the app instead of building each piece individually.

There are a couple of possibilities to check for debugging if there are issues.
- Check that the extracted directory from the `.tar.gz` file points ot the right API and Authentication Provider (Keycloak) values by doing a search and cross-referencing the `.env.development` or `.env.test` or `.env.prod` values.
- You might also try running `serve -s -l 3000` on the produced directory to see that it runs. You will likely run into issues from the API or Keycloak if you're pointed to anything but local, but you can ensure it runs.

Checklist
- Check that API points to the right place: `bcer-<env>.api`
- Check that keycloak points to the right place: `common-logon-<env>`
- Check that redirect uri is right: `/portal/#/keycloak`