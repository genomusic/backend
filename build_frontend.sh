#!/usr/bin/env bash

npm run-script build && cp -r ./frontend/build/* ./static/ && cp -r ./frontend/build/static/* ./static/ && ls -r ./static/* && cp ./static/index.html ./templates/ && cat ./templates/index.html