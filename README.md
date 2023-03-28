![Lifecycle:Maturing](https://img.shields.io/badge/Lifecycle-Maturing-007EC6)

# B.C. E-Substance Reporting

The BCER application includes 4 packages.
- API
- Retailer App
- Data Portal App
- Shared Components

There is documentation in each package for how to build, run, and deploy them. This README includes more generalized documentation.

# AWS Promotion Guide
## BCER API
1) Created Aurora Serverless Postgres database in AWS RDS, provided connection information to ops team.
    see ./aurora_create_db.sql for script

2) Docker, from the app folder
    docker build -t bcer-api .

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
VERSION=<app_version> ENVIRONMENT=<development|staging|production> make package-app

# Example 
VERSION=2.2.0 ENVIRONMENT=development make package-app
```

### Notes
- At the moment, the containerized versions of these apps are non-functional.
- Currently, we only deploy to on-prem servers. The documentation in each readme will reflect as such.