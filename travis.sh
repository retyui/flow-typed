#!/bin/sh
#set -e

cd cli && \
yarn && \
cd ../state && \
yarn && \
cd .. && \
node state/check.js
