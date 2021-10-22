#!/bin/bash

########################################################################################
# Utility script to build and package
# - API
# - Data Portal
# - Retailer App
# This command outputs each of the built apps as a tar.gz file in the dist/ folder. 
#
# Usage:
# - VERSION=<app_version> ENVIRONMENT=<development|staging|production> ./package-app.sh
########################################################################################

ROOT_DIR=$(pwd)
DIST_FOLDER=$ROOT_DIR/dist

echo "VERSION=${VERSION}"
echo "ENVIRONMENT=${ENVIRONMENT}"

if [ -z "${VERSION}" ]; then
    echo "No VERSION specified"
    exit 0;
fi

if [ -z "${ENVIRONMENT}" ]; then
    echo "No ENVIRONMENT specified"
    exit 0;
fi

BUILD_SUFFIX=${ENVIRONMENT}-${VERSION}

function packageApi() {
    cd $ROOT_DIR/packages/bcer-api
    ENVIRONMENT=${ENVIRONMENT} make package-app

    mv ./dist.tar.gz $DIST_FOLDER/${BUILD_SUFFIX}/api-${BUILD_SUFFIX}.tar.gz
}

function buildSharedComponents() {
    cd $ROOT_DIR/packages/bcer-shared-components
    ENVIRONMENT=${ENVIRONMENT} make build
}

function packageRetailerApp() {
    cd $ROOT_DIR/packages/bcer-retailer-app
    ENVIRONMENT=${ENVIRONMENT} make package-app
    mv ./build.tar.gz $DIST_FOLDER/${BUILD_SUFFIX}/retailer-${BUILD_SUFFIX}.tar.gz
}

function packageDataPortal() {
    cd $ROOT_DIR/packages/bcer-data-portal
    ENVIRONMENT=${ENVIRONMENT} make package-app
    mv ./build.tar.gz $DIST_FOLDER/${BUILD_SUFFIX}/data-portal-${BUILD_SUFFIX}.tar.gz
}

# Create new dist folder if not already exists
mkdir -p $DIST_FOLDER/$BUILD_SUFFIX

packageApi
buildSharedComponents
packageRetailerApp
packageDataPortal
