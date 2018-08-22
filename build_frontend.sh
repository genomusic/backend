#!/usr/bin/env bash

npm run-script build && cp -r ./frontend/build/ ./static/ && cp ./static/index.html ./templates/