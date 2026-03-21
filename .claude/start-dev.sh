#!/bin/bash
export PATH="/Users/jayeshruchandani/.nvm/versions/node/v20.19.5/bin:$PATH"
cd "$(dirname "$0")/.."
exec npx next dev
