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
The shared components are used for importing onto both the retailer application and the common portal. The intention is for this package to be published to a package manager. As of now, this only works on the bitbucket repository version of this package.

### Notes
- At the moment, the containerized versions of these apps are non-functional.
- Currently, we only deploy to on-prem servers. The documentation in each readme will reflect as such.