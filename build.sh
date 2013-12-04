#!/bin/bash

./node_modules/.bin/browserify client -o bundle.js
./node_modules/.bin/uglifyjs bundle.js -o bundle.min.js -c
