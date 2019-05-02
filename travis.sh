#!/bin/sh
#set -e

cd cli && \
yarn && \
yarn build && \
cd ../state && \
yarn && \
cd .. && \
node state/check.js
