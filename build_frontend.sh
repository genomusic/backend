#!/usr/bin/env bash

cd frontend/ && npm install && npm run-script build && cp -r ./build/ ../static/build && cd ../