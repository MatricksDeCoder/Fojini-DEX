#!/usr/bin/env bash
rm -rf src/flats/*
./node_modules/.bin/truffle-flattener src/contracts/Token.sol > src/flats/Token_flat.sol
./node_modules/.bin/truffle-flattener src/contracts/Exchange.sol > src/flats/Exchange_flat.sol
