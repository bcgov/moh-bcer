#!/bin/bash

if [ -z "${ENVIRONMENT}" ]; then
    echo "No ENVIRONMENT specified"
    exit 0;
fi

echo "+\n++ Building retailer app"
make setup-${ENVIRONMENT}-env
cd app
npm i
npm run build
npm run tar
echo "\n++ Finished building retailer app"
