#!/usr/bin/env bash

npm run-script build && cp -r ./frontend/build/* ./static/ && ls ./static/ && cp ./static/index.html ./templates/