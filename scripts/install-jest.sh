#!/bin/bash
set -e

JEST_VERSION="$1"

if [ -z "$JEST_VERSION" ]; then
  echo "Usage: $0 <jest-version>"
  echo "Example: $0 29   or   $0 30"
  exit 1
fi

if [ "$JEST_VERSION" = "29" ]; then
  echo "Installing Jest 29.x and related packages..."
  npm install jest@^29 jest-environment-jsdom@^29 jest-environment-node@^29 @jest/environment@^29 @jest/types@^29 @jest/reporters@^29 ts-jest@^29 --no-save
elif [ "$JEST_VERSION" = "30" ]; then
  echo "Installing Jest 30 and related packages (no ts-jest)..."
  npm install jest@30 jest-environment-jsdom@30 jest-environment-node@30 @jest/environment@30 @jest/types@30 @jest/reporters@30 --no-save
else
  echo "Unknown Jest version: $JEST_VERSION"
  exit 2
fi
