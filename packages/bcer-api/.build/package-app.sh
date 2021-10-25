#!/bin/bash
echo "+\n++ Building API"

cd app
npm i
npm run build:prem

echo "+\n++ Packaging API"
npm run tar

echo "+\n++ Finished building and packaging API"
