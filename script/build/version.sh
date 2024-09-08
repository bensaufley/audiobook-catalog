#!/usr/bin/env bash

set -eo pipefail

cd "$(dirname "$0")/../.."

version="$(jq -r .version package.json)"
sed -i 's|Container version=".*"|Container version="'"$version"'"|' community-applications.xml
git add community-applications.xml
