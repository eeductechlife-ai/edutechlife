# GitHub Branch Protection & CI/CD Gates Setup

Complete guide for configuring GitHub branch protection rules and CI/CD gates.

## Overview

Branch protection rules ensure that:
1. All automated tests pass before merging
2. Code review is required from team members
3. Commit history is linear (no forced pushes)
4. Status checks are required

## Access

**GitHub Settings** → Branches → Add rule

---

## Main Branch Protection

### Settings for `main` branch

**Branch name pattern**: `main`

### 1. Require Status Checks

**Enable**: ✅

**Required status checks**:
```
ci/smoke
ci/lint
ci/test
ci/backend
ci/lighthouse
ci/security
```

**Optional status checks** (can proceed if they fail):
```
ci/e2e
ci/coverage
ci/budget
```

**Require status checks to pass before merging**: ✅
**Require branches to be up to date before merging**: ✅
**Require status checks from the most recent push**: ✅

### 2. Require Code Reviews

**Require pull request reviews before merging**: ✅
**Number of approvals required**: 1 (minimum)

**Require review from code owners**: ✅
**Dismiss stale pull request approvals when new commits are pushed**: ✅
**Require approval of the most recent reviewable push**: ✅

### 3. Require Conversation Resolution

**Require all conversations on code to be resolved before merging**: ✅

### 4. Require Signed Commits

**Require signed commits**: ⚠️ Optional
- Recommended for production
- Requires GPG key setup

### 5. Require Up-to-Date Branch

**Require branches to be up to date before merging**: ✅
- Ensures branch is built against latest `main`

### 6. Admin Options

**Restrict who can push to matching branches**: ⚠️ Optional
- Only repo admins can bypass protection

**Allow force pushes**: ❌
- Disable force pushes to prevent history loss

**Allow deletions**: ❌
- Prevent accidental branch deletion

**Lock branch**: ❌ (unless in maintenance)

---

## Develop Branch Protection

### Settings for `develop` branch

**Branch name pattern**: `develop`

### Differences from `main`

**More lenient for faster development**:

1. **Status Checks**:
   ```
   REQUIRED:
   ci/smoke
   ci/lint
   ci/test
   
   OPTIONAL:
   ci/backend
   ci/lighthouse
   ci/security
   ```

2. **Code Reviews**:
   - Number of approvals required: 1
   - ✅ Allow self-review by PR author

3. **Dismiss stale reviews**: ✅

4. **Admin options**:
   - Allow force pushes: ❌
   - Allow deletions: ❌

---

## Staging Branch Protection

### Settings for `staging` branch

**Branch name pattern**: `staging`

### Configuration

1. **Status Checks**:
   ```
   REQUIRED:
   ci/smoke
   ci/lint
   ci/test
   ci/backend
   
   OPTIONAL:
   ci/e2e
   ci/lighthouse
   ```

2. **Code Reviews**:
   - Required: ✅
   - Approvals: 1
   - Dismiss stale: ✅

3. **Deployment**:
   - Auto-deploy to staging after merge
   - Run smoke tests post-deploy

---

## Feature Branches

### Naming Convention

```
feat/[issue-id]-[description]
fix/[issue-id]-[description]
refactor/[issue-id]-[description]
perf/[issue-id]-[description]
chore/[issue-id]-[description]
docs/[issue-id]-[description]
```

**Examples**:
- `feat/auth-oauth-integration`
- `fix/123-payment-timeout-issue`
- `refactor/dashboard-components`
- `perf/reduce-bundle-size`

### Pull Request Template

Create `.github/pull_request_template.md`:

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 📚 Documentation
- [ ] 🎨 Styling
- [ ] ♻️ Refactoring
- [ ] ⚡ Performance
- [ ] 🔒 Security

## Related Issue
Closes #[issue-number]

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests passed
- [ ] E2E tests passed
- [ ] Manual testing on staging

## Checklist
- [ ] Code follows style guide
- [ ] Self-reviewed my changes
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests cover new functionality
- [ ] Changes don't break existing tests

## Screenshots (if applicable)
Add screenshots for UI changes.

## Performance Impact
- [ ] No performance impact
- [ ] Improves performance
- [ ] Potential regression (describe)

## Security Checklist
- [ ] No secrets in code
- [ ] No SQL injection risks
- [ ] No XSS vulnerabilities
- [ ] Input validation added
- [ ] Authorization checks included

## Deployment Notes
Any special deployment considerations.

## Reviewers
@mention-reviewer
```

---

## CI/CD Status Checks

### Mapping Workflows to Status Checks

| GitHub Status | Workflow Job | File | Timeout |
|---|---|---|---|
| `ci/smoke` | smoke | ci.yml | 6m |
| `ci/lint` | lint | ci.yml | 8m |
| `ci/test` | test | ci.yml | 15m |
| `ci/backend` | backend | ci.yml | 15m |
| `ci/e2e` | e2e | ci.yml | 10m |
| `ci/coverage` | coverage | ci.yml | 10m |
| `ci/lighthouse` | lighthouse | ci.yml | 10m |
| `ci/security` | security | ci.yml | 5m |
| `ci/budget` | budget | ci.yml | 8m |

### GitHub Actions Configuration

Ensure each job has proper context:

```yaml
# .github/workflows/ci.yml
jobs:
  smoke:
    name: Smoke Test (fast gate)
    runs-on: ubuntu-latest
    timeout-minutes: 6
    steps:
      # ... steps ...

  lint:
    name: Lint + Typecheck
    needs: smoke
    runs-on: ubuntu-latest
    timeout-minutes: 8
    steps:
      # ... steps ...

  # Jobs report status back to GitHub
  # GitHub checks branch protection rules
  # Merges allowed only if status checks pass
```

---

## Debugging Status Checks

### Status Check Won't Complete

1. **Check GitHub Actions logs**:
   - Go to Actions tab
   - Find workflow run
   - View logs for failed job

2. **Common issues**:
   - Timeout: Increase `timeout-minutes`
   - Hanging: Look for infinite loops
   - Flaky test: Add retry logic

3. **Re-run failed checks**:
   - Click "Re-run jobs" in PR
   - Or: `git commit --allow-empty && git push`

### Status Check Always Fails

1. **Check action workflow syntax**:
   ```bash
   # Validate locally
   npm run test
   npm run lint
   npm run typecheck
   ```

2. **Check environment**:
   - Missing GitHub secrets?
   - Cache not working?
   - Wrong Node version?

3. **Request a bypass** (last resort):
   - Go to PR settings
   - Admins can temporarily dismiss check
   - Document reason

---

## Automation & Rules Enforcement

### Auto-Merge on Status Checks

Enable auto-merge for feature branches:

```yaml
# .github/workflows/auto-merge.yml
name: Auto-Merge on Approval

on:
  pull_request_review:
    types: [submitted]

jobs:
  auto-merge:
    runs-on: ubuntu-latest
    if: github.event.review.state == 'approved'
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            github.rest.pulls.merge({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: context.issue.number,
              merge_method: 'squash'
            })
```

### Dismiss Old Pull Requests

```yaml
# .github/workflows/dismiss-old-prs.yml
name: Dismiss Old PRs

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight

jobs:
  dismiss:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            const prs = await github.rest.pulls.list({
              owner: context.repo.owner,
              repo: context.repo.repo,
              state: 'open',
              sort: 'updated',
              direction: 'asc'
            });
            
            const oldPRs = prs.data.filter(pr => {
              const age = Date.now() - new Date(pr.updated_at);
              return age > 30 * 24 * 60 * 60 * 1000; // 30 days
            });
            
            for (const pr of oldPRs) {
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: pr.number,
                body: 'This PR is older than 30 days. Please update or close.'
              });
            }
```

---

## Review Requirements

### Code Owners

Create `.github/CODEOWNERS`:

```
# Frontend
/edutechlife-frontend/ @frontend-team

# Backend
/edutechlife-backend/ @backend-team

# Documentation
/docs/ @devops-team

# Workflows & CI/CD
/.github/ @devops-team

# Database
/sql/ @database-team

# Security
/security/ @security-team
```

### Review Assignment

**GitHub Settings → Branches → Require Code Owners review**:
- ✅ Require review from code owners

---

## Monitoring Branch Protection

### View Protection Rule Status

1. **Go to**: Settings → Branches
2. **Find rule**: Click on branch name
3. **View status**:
   - ✅ Rules applied
   - ⚠️ Dismissible rules
   - ❌ Failing checks

### Audit Protection Changes

1. **Go to**: Settings → Audit log
2. **Filter**: `branch_protection_policy`
3. **See**: Who changed rules and when

---

## Temporary Overrides

### Admin Override (Emergency Only)

1. **Situation**: Production is down, need hotfix NOW
2. **Process**:
   - Go to PR
   - Click "Merge without waiting for checks"
   - Document reason in commit message
   - Alert team in Slack

3. **Post-Incident**:
   - Investigate why check failed
   - Fix underlying issue
   - Re-run check to verify

### Dismiss Stale Reviews

When new commits are pushed:
1. All approvals become "stale"
2. Re-review required
3. Can be disabled per rule (NOT recommended)

---

## Best Practices

### Branch Protection

1. ✅ **Do**:
   - Require status checks for all protected branches
   - Dismiss stale reviews on new commits
   - Require code reviews
   - Restrict force pushes
   - Add meaningful branch names

2. ❌ **Don't**:
   - Allow force pushes to main
   - Skip status checks
   - Have outdated status checks
   - Ignore branch naming conventions

### Review Process

1. ✅ **Do**:
   - Review for correctness, performance, security
   - Request changes, not just approve
   - Provide constructive feedback
   - Test locally if possible
   - Ask questions about complex code

2. ❌ **Don't**:
   - Auto-approve without reading
   - Approve code you don't understand
   - Approve just to unblock merge
   - Review on mobile without context

---

## Troubleshooting

### "Merging is blocked" Error

**Causes**:
1. Status checks not all passing
2. Missing required review
3. Conversations unresolved
4. Branch not up to date

**Solution**:
1. View PR status checks
2. Re-run failing checks
3. Request review from team member
4. Resolve all conversations
5. Update branch with main

### Review Request Ignored

1. **Check who's assigned**:
   - GitHub doesn't notify if CODEOWNERS isn't set
   - Manually @mention reviewer

2. **Set deadlines**:
   - Add comment: "Please review by EOD"
   - Set GitHub review deadline

3. **Escalate**:
   - Message in #dev-alerts
   - Assign to backup reviewer

---

## Quick Links

- **GitHub Branches Settings**: https://github.com/edutechlife/edutechlife/settings/branches
- **GitHub Actions**: https://github.com/edutechlife/edutechlife/actions
- **Audit Log**: https://github.com/edutechlife/edutechlife/settings/audit-log
- **Code Owners**: https://github.com/edutechlife/edutechlife/blob/main/.github/CODEOWNERS

---

## Setup Checklist

- [ ] Create branch protection rule for `main`
- [ ] Create branch protection rule for `staging`
- [ ] Create branch protection rule for `develop`
- [ ] Add CODEOWNERS file
- [ ] Create PR template
- [ ] Configure status checks
- [ ] Set up Slack notifications
- [ ] Train team on review process
- [ ] Document emergency override process
- [ ] Test pull request flow

---

## Support

For help:
1. Check GitHub documentation: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository
2. Open an issue
3. Contact DevOps team
4. Ask in #devops Slack channel
