# Function to check for deployment lock
check_lock() {
    if [[ -f "$LOCK_FILE" ]]; then
        local lock_pid
        lock_pid=$(cat "$LOCK_FILE" 2>/dev/null || echo "")

        if [[ -n "$lock_pid" ]] && kill -0 "$lock_pid" 2>/dev/null; then
            log_error "Another deployment is already running (PID: $lock_pid)"
            log_info "If you're sure no deployment is running, remove: $LOCK_FILE"
            exit 1
        else
            log_warning "Stale lock file found, removing..."
            rm -f "$LOCK_FILE"
        fi
    fi
}

# Function to create deployment lock
create_lock() {
    echo $$ > "$LOCK_FILE"
    log_info "Created deployment lock (PID: $$)"
}

# Function to setup deployment timeout
setup_timeout() {
    (
        sleep $MAX_DEPLOYMENT_TIME
        log_error "Deployment timeout reached (${MAX_DEPLOYMENT_TIME}s)"
        kill -TERM $$ 2>/dev/null || true
    ) &
    TIMEOUT_PID=$!
}

# Function to validate environment
validate_environment() {
    log_header "🔍 ENVIRONMENT VALIDATION"

    # Check if we're in the right directory
    if [[ ! -f "$APP_DIR/package.json" ]]; then
        log_error "package.json not found. Are you in the right directory?"
        exit 1
    fi

    # Check required commands
    local required_commands=("git" "npm" "pm2" "curl")
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            log_error "Required command not found: $cmd"
            exit 1
        fi
    done

    # Check Node.js version
    local node_version
    node_version=$(node --version | sed 's/v//')
    local required_node="16.0.0"

    if ! printf '%s\n%s\n' "$required_node" "$node_version" | sort -V -C; then
        log_warning "Node.js version $node_version might be too old (recommended: >= $required_node)"
    fi

    log_success "Environment validation completed"
}

# Function to run deployment step with error handling
run_step() {
    local step_name="$1"
    local step_command="$2"
    local is_critical="${3:-true}"

    log_step "Starting: $step_name"
    local start_time
    start_time=$(date +%s)

    if eval "$step_command"; then
        local end_time
        end_time=$(date +%s)
        local duration=$((end_time - start_time))
        log_success "Completed: $step_name (${duration}s)"
        return 0
    else
        local exit_code=$?
        log_error "Failed: $step_name (exit code: $exit_code)"

        if [[ "$is_critical" == "true" ]]; then
            log_error "Critical step failed, aborting deployment"
            exit $exit_code
        else
            log_warning "Non-critical step failed, continuing deployment"
            return 0
        fi
    fi
}

# Main deployment function
main_deployment() {
    log_header "🚀 SE2 DEPLOYMENT ORCHESTRATOR"
    log_info "Deployment ID: $DEPLOYMENT_ID"
    log_info "Log file: $LOG_FILE"
    log_info "Started at: $(date)"

    # Create logs directory if it doesn't exist
    mkdir -p "$(dirname "$LOG_FILE")"

    # Check for existing deployment
    check_lock
    create_lock
    setup_timeout

    # Validate environment
    validate_environment

    # Run deployment steps
    local step_exit_code
    step_exit_code=$(run_step "Pre-deployment hooks" "${SCRIPT_DIR}/pre-deploy-hook.sh" true)
    if [[ $step_exit_code -ne 0 ]]; then
        exit $step_exit_code
    fi

    step_exit_code=$(run_step "Main deployment" "${SCRIPT_DIR}/deploy.sh deploy" true)
    if [[ $step_exit_code -ne 0 ]]; then
        exit $step_exit_code
    fi

    step_exit_code=$(run_step "Post-deployment hooks" "${SCRIPT_DIR}/post-deploy-hook.sh" false)
    if [[ $step_exit_code -ne 0 ]]; then
    log_warn "Post-deployment hook exited ${step_exit_code} (non-fatal)"
    fi

    # Final success message
    log_header "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY"
    log_success "Deployment ID: $DEPLOYMENT_ID"
    log_success "Completed at: $(date)"

    # Show quick status
    if command -v pm2 >/dev/null 2>&1; then
        echo -e "\n${CYAN}📊 Current Application Status:${NC}"
        pm2 describe se2 2>/dev/null | grep -E "(status|uptime|memory)" || log_info "PM2 status not available"
    fi

    # Show access URLs
    echo -e "\n${GREEN}🔗 Application Access URLs:${NC}"
    echo -e "${BLUE}Health Check:${NC} http://localhost:3000/health/status"
    echo -e "${BLUE}Database Check:${NC} http://localhost:3000/health/db"
    echo -e "${BLUE}API Endpoint:${NC} http://localhost:3000/api"
}

# Quick deployment function (no hooks)
quick_deployment() {
    log_header "⚡ QUICK DEPLOYMENT"
    log_info "Running quick deployment without hooks"

    check_lock
    create_lock
    setup_timeout

    local step_exit_code
    step_exit_code=$(run_step "Quick deployment" "${SCRIPT_DIR}/deploy.sh deploy" true)
    if [[ $step_exit_code -ne 0 ]]; then
        exit $step_exit_code
    fi

    log_success "Quick deployment completed"
}

# Status check function
check_status() {
    log_header "📊 DEPLOYMENT STATUS CHECK"

    # Check if deployment is running
    if [[ -f "$LOCK_FILE" ]]; then
        local lock_pid
        lock_pid=$(cat "$LOCK_FILE" 2>/dev/null || echo "")
        if [[ -n "$lock_pid" ]] && kill -0 "$lock_pid" 2>/dev/null; then
            log_info "Deployment is currently running (PID: $lock_pid)"
            exit 1
        else
            log_info "No active deployment found"
        fi
    else
        log_info "No deployment lock file found"
    fi

    # Run health check
    "${SCRIPT_DIR}/health-check.sh" --quick

    # Show recent deployments
    log_info "Recent deployments:"
    find "${APP_DIR}/logs" -name "deployment_*.log" -mtime -7 2>/dev/null | \
        sort -r | head -5 | while read -r logfile; do
            local deploy_date
            deploy_date=$(stat -c %y "$logfile" 2>/dev/null || stat -f "%Sm" "$logfile" 2>/dev/null || echo "unknown")
            echo "  - $(basename "$logfile") ($deploy_date)"
        done || log_info "No recent deployment logs found"
}

# Usage function
show_usage() {
    cat <<'EOF'

🚀 SE2 Deployment Orchestrator

Usage: $0 [COMMAND] [OPTIONS]

Commands:
  deploy       - Run full deployment with hooks (default)
  quick        - Run quick deployment without hooks
  rollback     - Rollback to previous version
  status       - Check deployment and application status
  health       - Run health check
  logs         - Show recent deployment logs
  help         - Show this help message

Options:
  --force      - Force deployment even if checks fail
  --dry-run    - Simulate deployment without making changes
  --verbose    - Enable verbose logging

Examples:
  $0                    # Run full deployment
  $0 deploy             # Run full deployment
  $0 quick              # Quick deployment
  $0 rollback           # Rollback to previous version
  $0 status             # Check current status
  $0 logs --tail        # Show recent logs

EOF
}