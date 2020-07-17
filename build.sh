#!/usr/bin/env bash

while true
do
  fd | entr -d -s 'npx rollup -c'
done
