#!/usr/bin/env bash

ssh server 'mkdir -p /websites/vijaymarupudi.com/static/clustering-poster'
./build.sh
rsync build/ server:/websites/vijaymarupudi.com/static/clustering-poster -aP
