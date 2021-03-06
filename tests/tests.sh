#!/bin/bash

## Called via 'npm test' ##


# Shortcuts to test modules
mocha=./node_modules/mocha/bin/mocha
karma=./node_modules/karma/bin/karma

# Start mocha node test suite
$mocha ./tests
$mocha ./game_files/**/tests
# Start karma web test suite
$karma start
