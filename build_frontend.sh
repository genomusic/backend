#!/usr/bin/env bash

npm install && npm run-script build && cp -r ./frontend/build/ ./static/build