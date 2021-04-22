# Vape BC

## Description

NestJS API for Vaping Regulation application

## Stack

- TypeScript
- NestJS
- Express
- TypeORM
- Postgres
- JWT
- Keycloak

## Run
Requirements: 
- node v12.18.3
- Postgresql v11, v12, or v13

**Docker-Compose** (Not functional as of 04-13-2021)
1. Navigate into the `app` directory and run `npm i`.  This only needs to be done when you are first initializing the project, due to a 'chicken-egg-problem' with the docker-volumes: `cd app && npm i`
2. Build docker containers from root: `docker-compose build`
3. Run docker containers: `docker-compose up -d`
4. Your PG database will be available on the docker volume and the API will be exposed onto `http://localhost:4000`

**NPM**
1. Ensure you have postgres running locally
2. Navigate into the `app` directory and run `npm i`
3. Ensure you have a local instance of Postgres running. Check the `.env` file to ensure the `DB_` values matches with your PG db.
4. Run `npm run start`
5. The API will be exposed onto `http://localhost:4000`

## Build and Deploy
We have four environments for this app - Internal/UAT hosted on AWS, and a Dev, Test, and Prod server hosted by CGI on premise.

**Internal**
This is hosted on AWS and is kicked off by a merge to the `dev` branch on BitBucket. [Link](https://dev.web.vaping-regulation.freshworks.club/login).
The .env variables is a little all over the place here. The deployment script runs off of `docker-compose.production.yml` but because it relies on the `.env`, we have some script in the `Dockerfile.production` that replaces `.env` with `.env.aws` so that the database values are correct. The `NODE_ENV` on internal apparently must be `production`, and as such, we have some extra values to retrieve the right entities and other such logic, with envs being `AWS_ENV` and `LOAD_CERTS` as examples.

**Dev, Staging, Production**
These are hosted by CGI on-prem and uses an Apache server. In order to build and release, we run a build locally and send a `.tar.gz` to CGI (currently done through Google Drive).

To get a build going, run `npm run build:prem` to produce a resulting `/dist` folder. This should include everything necessary.
Run `npm run tar` to find a `dist.tar.gz` produced. Please give this a version (e.g. `dist-1.1.1.tar.gz`) depending on the last version they were given (no automated versioning for now).
Before passing it to CGI, please try to run it and check the code for any gotchas.
1. In a different directory, untar the `tar.gz` file
2. Navigate the code in the resulting project. You'll want to set the `NODE_ENV` environment variable as `development`, `staging`, or `production`.
3. ONLY WHILE YOU'RE TESTING, set `LOAD_CERTS` environment variable to false. You wouldn't have these SSL keys, so it is unnecessary.
4. Run `npm i --only=production`
5. You'll need to have a local instance of postgres running, and set those variables in the `.env`
6. Run `npm run migrate:run` to apply any recent migrations onto your database
7. Run `node main` within the directory. You should see it exposed onto `http://localhost:4000`

If this is working, you can pass on the `.tar.gz` file to CGI. They will be in charge of putting it into each environment's respective servers and changing the `.env` to match the database, Keycloak, etc.

## Keycloak

The app uses a Keycloak instance within GovBC for authentication and authorization purposes. This is currently split into two realms - `bcer` and `moh_applications` - with the former for business owners and the latter for Ministry users.

While there are currently two different paths for auth within the middleware and guards of the app, this can be shortened to a single guard that authorizes for both realms.

## DB Password Decode

As requested by CGI, we are creating a cipher to enter the database passwords (and the Keycloak secrets). This is to ensure that they don't just store the plaintext database passwords in their `.env` files, and as such, the algorithm and salt are freely available within the code.

## Typedoc

- To add comments to methods and classes see: https://typedoc.org/guides/doccomments/
- To generate documentation in the `app/typedocs` folder, run `npm run typedoc` from within `app`
- Options are specified in `app/tsconfig.json`

## Test

- `npm run test` will run Jest (ts-jest)
- `npm run test:cov` will generate coverage reports
- `npm run test:e2e` will perform end to end testing

## Schema

Running the following command from the root directory will create a visual schema in `app/schema`:

```
docker run -ti --rm --name schemaspy --network=nest-cli_backend \
  -v ${PWD}/app/schema:/output \
  -p 8080:8080 \
  -e DATABASE_TYPE=pgsql \
  -e DATABASE_HOST=postgres -e DATABASE_NAME=nest_api_dev \
  -e DATABASE_USER=vape_nestapi -e DATABASE_PASSWORD=vape_nest123 \
  --link vape-nest-api-postgres \
  schemaspy/schemaspy \
  -t pgsql \
  -db nest_api_dev \
  -host postgres \
  -u vape_nestapi \
  -p vape_nest123 \
  -s public
```

nb: variables must match what's in docker-compose.yml per env

## Code analysis

1. Spin up sonarqube server: `docker run -d --name SonarQube -p 9000:9000 -p 9092:9092 sonarqube`

2. Run analysis with SonarQube: `npm run sonar`

3. Visit `localhost:9000/dashboard?id=Vapescape`

## Swagger

This API self-documents, and exposed a swagger-utility page at `http://localhost:4000/api` when build locally.  This should be disabled for production builds to not expose the internal functionality publicly.

To add a module to the generated documentation, include it in `app/src/common/common.documentation.ts`

## Error handling

To format a custom error, throw a new GenericException from a service with an error defined as per `auth.error`, see the login method of the auth service for an example.

## Logging

Errors and requests are being logged locally when transports are on (in `development`, `test`, or `production` `NODE_ENV`s). It runs on a Daily Transport file using winston in a directory named according to the env `LOGS_PATH`. 

## Migrations
In order to create a migration, run `npm run migrate:create -- -n MigrationName`. Please create a new migration whenever the entities change. The flow goes:
- For dev, you can rely on the synchronize so you can develop in peace. Your entity changes will be reflected onto your database.
- However, we want to create migrations. So anytime you make an entity change, for the PR, please create a migration with the above command. The database `vape_migrations` was created for this very purpose.
- In order to point the `ormconfig` to the right entities and migrations, you'll want to add `require('dotenv').config({ path: '../.env' });` to the top, or ensure that it points at the correct `.env` file.
- You'll want to make sure the previous migration has been applied to your `vape_migrations` database. Run `npm run migrate:run` beforehand. That way, your migration generation should specifically be the changes you made to the entities.
- TODO: We need a command on the build pipelines to apply this migration to the destination database. Until then, we keep it `synchronize`d.
- NOTE: This only works with a local or remote postgres db. This will need to be working with containers.

If you see any issues with running or generating migrations, please check that directories are being referred to properly. For example, migrations will need to point to what's in `dist` where your migrations sit, and same with entities. Please check `ormconfig.js` to amend this.

In short:
- When you make entity changes, first run `npm run migrate:run` and then `npm run migrate:create -- -n MigrationName`.

## Common Issues
- If you see any issues with respect to the database when you're running it, the best thing to check is `ormconfig.js`. Check that the entities is where you expect them to be.

## Docs

[NestJS](https://docs.nestjs.com).

## Deployment
To prepare the NodeJS app for deployment, thereyou only need to run two things:
- In the `app` directory, run `npm run build:prem"`
- Run `npm run tar` to produce a `.tar.gz` file

This produces a whole package that includes all the files necessary. For deployment, it is only required to replace specific values in the produced `.env` file. The values are
```
DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD, APPLICATION_PORT, KEYCLOAK_REALM, KEYCLOAK_CLIENT, KEYCLOAK_AUTH_URL, KEYCLOAK_SECRET, KEYCLOAK_DATA_REALM, KEYCLOAK_DATA_CLIENT, KEYCLOAK_DATA_AUTH_URL, PEM_KEY_PATH, PEM_CERT_PATH, LOGS_PATH
```

NOTE: LOAD_CERTS must be true for deployment, and DB_SYNCHRONIZE should be false.

NOTE: The DB_PASSWORD and KEYCLOAK_SECRET values must be encrypted. You can find the values to encrypt with in `ormconfig.js`.