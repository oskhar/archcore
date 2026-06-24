#!/bin/bash

# Simple git hook script to log commit intervals
# Usage: Copy to .git/hooks/post-commit or run manually

RESULTS_DIR="laboratory/results"
JSONL_FILE="${RESULTS_DIR}/commit-intervals.jsonl"

mkdir -p "$RESULTS_DIR"

BRANCH=$(git rev-parse --abbrev-ref HEAD)
COMMIT=$(git rev-parse --short HEAD)
TIMESTAMP=$(git log -1 --format=%at)

# Get interval to previous commit
PREV_TIMESTAMP=$(git log -1 --format=%at HEAD~1 2>/dev/null)

if [ -z "$PREV_TIMESTAMP" ]; then
    INTERVAL=0
else
    INTERVAL=$(( TIMESTAMP - PREV_TIMESTAMP ))
fi

echo "{\"branch\": \"$BRANCH\", \"commit\": \"$COMMIT\", \"timestamp\": $TIMESTAMP, \"interval_to_prev\": $INTERVAL}" >> "$JSONL_FILE"
