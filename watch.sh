#!/usr/bin/env bash

while true
do
  fd | entr -d ./build.sh
  if [[ "$?" -ne 2 ]]
  then
    break
  fi
done
