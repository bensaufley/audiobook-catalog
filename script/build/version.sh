#!/usr/bin/env bash

set -eo pipefail

cd "$(dirname "$0")/../.."

version="$(jq -r .version package.json)"
current_version="$(grep -oP 'bnsfly/audiobook-catalog:v\K[^<]+' community-applications.xml)"
sed -i "s|${current_version//\./\\.}|$version|g" community-applications.xml
git add community-applications.xml
