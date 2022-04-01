![Lifecycle:Maturing](https://img.shields.io/badge/Lifecycle-Maturing-007EC6)

# B.C. E-Substance Reporting

The BCER application includes 4 packages.
- API
- Retailer App
- Data Portal App
- Shared Components

There is documentation in each package for how to build, run, and deploy them. This README includes more generalized documentation.

## API - bcer-api
The API uses NestJS and TypeORM, which locally you can run where it uses a synchronize setting to keep your local database or containerized database in sync with entity changes.

## Retailer Application - bcer-retailer-app
The retailer application uses BCeID Keycloak for authentication. 

## Data Portal - bcer-data-portal
The data portal application uses IDIR Keycloak for authentication.

## Shared Components
The shared components are used for importing onto both the retailer application and the common portal. This package is developed and imported locally in the other frontend packages. However, after making changes to any shared components, `npm run build` must be ran within the shared components package for the other packages to find the changes.

## Releases
In order to create a new build of the application, you can use the `package-app` make command. This will build and package the
- API (`dist-<version>.tar.gz`)
- Retailer app (`build-<env>-<version>.tar.gz`)
- Data Portal (`build-portal-<env>-<version>.tar.gz`)

and output them as tar.gz files in the `dist` folder.

Usage:
```sh
VERSION=<app_version> ENVIRONMENT=<development|staging|production> make package-build

# Example 
VERSION=2.2.0 ENVIRONMENT=development make package-build
```

## Notes
- Currently, we only deploy to on-prem servers. The documentation in each readme will reflect as such.

## Running application in local

- Run the following command at the root directory to prepare project for local development.

  ```sh
  make setup-local
  ```
  This command builds the shared component library and creates proper .env files for front end applications

- Create a `.env` file in `packages/bcer-api/app` folder and populate it with necessary values. The list of environment 
variable can be found below.

- Run the following command at the root directory to start all the applications.

  ```sh
  make run-local
  ```
  Note: Docker Desktop is required to use this command.
  This will spin up all the applications and they can be accessed on the following urls
  1. API - bcer-api: `http://localhost:4000`
  2. Retailer Application - bcer-retailer-app: `http://localhost:3000`
  3. Data Portal - bcer-data-portal: `http://localhost:3001`

## Running E2E tests

- Run the following command at the root directory to prepare project for test environment.

  ```sh
  make setup-test
  ```

- Run the following to start the applications in test mode

  ```sh
  make run-test
  ```

- Once the application is running, run one of the following commands

  ```sh
  npm run test:open
  ```
  This will open the cypress interactive window where each test can be run individually and actual behavior can be monitored

  ```sh
  npm run test:run
  ```
  This will run the tests without interactive window and the results will be printed on the screen.

> Tests are setup to run in a sequential order.

## List of envs for bcer-api

```
CLOSE_LOCATION_CRON_TIME= <Cron expression when the location without valid NOI will be closed, (default: `0 1 16 1 *`)>
CRON_JOB_NAMES= <List of cron job names as csv, included cron jobs will be enabled>

# Map

GA_KEY= <Google location api key, must be provided or application won't start, use any string to prevent app from crushing>
BC_DIRECTION_API_KEY= <BC direction api key, required>
MAP_BOX_ACCESS_TOKEN= <Map box access token, required>
MAP_BOX_TILE_LAYER= <Map box tile layer, required>
MAP_BOX_ATTRIBUTION= <Map box attribution, required>
MAP_BOX_ID= <Map box id, required>

# Text Notification

ENABLE_TEXT_MESSAGES= <`true` to enable text messaging functionality>
ENABLE_SUBSCRIPTION= <`true` to enable subscription to text messaging>
TEXT_API_KEY= <API key for text service, must be provided or application won't start, use any string to prevent app from crushing>
TEXT_GENERIC_NOTIFICATION_TEMPLATE_ID= <text template id, required>
TEXT_REFERENCE= <text reference, (default: `abc123`)>
TEXT_API_PROXY= <text api proxy, deployment environments does not have access to text notification service directly, required>
TEXT_API_PROXY_PORT= <text api proxy port, required>
# Date Config

SALES_REPORT_END_DATE= <Sales report end in MM-DD format, (default: `01-15`)> 
NOI_EXPIRY_DATE= <NOI expiry date in MM-DD format, (default: `10-01`)>
REPORTING_YEAR_START= <Reporting year start date in MM-DD format, (default: `10-01`)>
SALES_REPORT_START_DATE= <Sales period start date in MM-DD format, (default: `10-01`)>
NOI_VALID_TILL= <Date until NOI is considered valid, (default: `01-15`)>
CRON_TIME_ZONE= <Time zone for cron job time, (default: `America/Vancouver`)>
SEND_NOTIFICATION_CRON_TIME= <Cron expression: interval at will notification batch is sent, (default: */3 * * * *)>
NOTIFICATION_BATCH_SIZE= <Size of text notification batch, (default: 50)>
```