#!/bin/bash

./node_modules/.bin/browserify client -o bundle.js
./node_modules/.bin/uglifyjs bundle.js > bundle.min.js
