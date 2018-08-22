#!/usr/bin/env bash

cd frontend/ && npm install && npm build && cp -r ./build/ ../static/ && cd ../