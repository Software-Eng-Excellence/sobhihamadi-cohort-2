#!/usr/bin/env bash
set -euo pipefail

########################################
# Configuration (ABSOLUTE PATHS ONLY)
########################################
APP_DIR="/home/se2-dev/sobhihamadi-cohort-2"
BUILD_DIR="$APP_DIR/build"
BACKUP_DIR="$APP_DIR/.backups"
CURRENT_BACKUP="$BACKUP_DIR/current_backup"
PREVIOUS_BACKUP="$BACKUP_DIR/previous_backup"
HEALTH_URL="http://127.0.0.1:3000/health/status"
PM2_APP_NAME="se2"
MIN_FREE_GB=2
WAIT_AFTER_DEPLOY=10

########################################
# Utils (colors + emojis)
########################################
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()   { echo -e "${BLUE}ℹ️  $1${NC}"; }
ok()    { echo -e "${GREEN}✅ $1${NC}"; }
warn()  { echo -e "${YELLOW}⚠️  $1${NC}"; }
fail()  { echo -e "${RED}❌ $1${NC}"; }

########################################
# Pre-flight checks
########################################
require_cmd() { command -v "$1" >/dev/null 2>&1 || { fail "Missing command: $1"; exit 1; }; }
require_cmd git
require_cmd npm
require_cmd pm2
require_cmd df
require_cmd curl

cd "$APP_DIR"

########################################
# Pre-deployment
########################################
log "Pre-deployment started"

# Storage check
FREE_GB=$(df -BG "$APP_DIR" | awk 'NR==2 {gsub(/G/,"",$4); print $4}')
if (( FREE_GB < MIN_FREE_GB )); then
  fail "Insufficient disk space: ${FREE_GB}GB free (< ${MIN_FREE_GB}GB)"
  exit 1
fi
ok "Disk space OK: ${FREE_GB}GB free"

# Health of current deployment (best-effort)
if curl -fsS "$HEALTH_URL" >/dev/null; then
  ok "Current deployment health check passed"
else
  warn "Current deployment health check failed (continuing)"
fi

# Prepare backups directory (private)
mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

# Backup rotation
if [[ -d "$BUILD_DIR" ]]; then
  if [[ -d "$CURRENT_BACKUP" ]]; then
    rm -rf "$PREVIOUS_BACKUP" || true
    mv "$CURRENT_BACKUP" "$PREVIOUS_BACKUP"
    ok "Rotated current_backup → previous_backup"
  else
    warn "No current_backup found (first run)"
  fi
  cp -a "$BUILD_DIR" "$CURRENT_BACKUP"
  ok "Created current_backup"
else
  warn "No build directory to backup"
fi

########################################
# Deployment
########################################
log "Deployment started"

log "Pulling latest code from master"
git fetch origin master
git checkout master
git pull origin master
ok "Git updated"

log "Installing dependencies"
npm install

log "Building application"
npm run build
ok "Build successful"

log "Reloading PM2 application"
pm2 reload ecosystem.config.js --env production || pm2 start ecosystem.config.js --env production
pm2 save
ok "PM2 reload complete"

########################################
# Post-deployment
########################################
log "Waiting ${WAIT_AFTER_DEPLOY}s before health check"
sleep "$WAIT_AFTER_DEPLOY"

if curl -fsS "$HEALTH_URL" >/dev/null; then
  ok "Post-deployment health check passed"
  ok "🎉 Deployment successful"
  exit 0
else
  fail "Post-deployment health check failed"
fi

########################################
# Rollback
########################################
log "Starting rollback"

pm2 status "$PM2_APP_NAME" || true

log "Stopping PM2 app safely"
pm2 stop "$PM2_APP_NAME" || true

if [[ -d "$PREVIOUS_BACKUP" ]]; then
  rm -rf "$BUILD_DIR"
  cp -a "$PREVIOUS_BACKUP" "$BUILD_DIR"
  ok "Restored previous_backup"
else
  fail "No previous_backup available. Rollback aborted"
  exit 1
fi

log "Restarting PM2 from backup"
pm2 start ecosystem.config.js --env production
pm2 save

sleep "$WAIT_AFTER_DEPLOY"
if curl -fsS "$HEALTH_URL" >/dev/null; then
  ok "Rollback successful and healthy"
  exit 0
else
  fail "Rollback failed health check"
  exit 1
fi
