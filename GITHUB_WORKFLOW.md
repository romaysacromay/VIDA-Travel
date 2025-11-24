# GitHub Workflow Guide for VIDA Travel

## 🚀 Quick Setup

### 1. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `vida-travel`
3. Description: `Bilingual vacation credit platform for Mexican families`
4. Keep it **Private** (or Public if you prefer)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **Create repository**

### 2. Connect Local Repository to GitHub

Copy and run these commands (replace `YOUR_USERNAME` with your GitHub username):

```bash
cd "/Users/m1/Desktop/VIDA Travel"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/vida-travel.git

# Push initial commit
git push -u origin main
```

### 3. Set Up Firebase Service Account (for Auto-Deploy)

#### Get Firebase Service Account:

1. Go to: https://console.firebase.google.com/project/vida-travel-vacation-credit/settings/serviceaccounts/adminsdk
2. Click **Generate new private key**
3. Save the JSON file securely
4. Copy the entire contents of the JSON file

#### Add to GitHub Secrets:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `FIREBASE_SERVICE_ACCOUNT`
5. Value: Paste the entire JSON content
6. Click **Add secret**

---

## 📋 Daily Workflow

### Starting a New Feature

```bash
# Make sure you're on main and up to date
git checkout main
git pull origin main

# Create a new feature branch
git checkout -b feature/your-feature-name

# Examples:
# git checkout -b feature/add-payment-gateway
# git checkout -b feature/new-destination
# git checkout -b bugfix/email-validation
```

### Making Changes

1. **Edit your files** as needed

2. **Check what changed:**
```bash
git status
```

3. **Review your changes:**
```bash
git diff
```

4. **Stage your changes:**
```bash
# Stage all changes
git add .

# Or stage specific files
git add public/js/app.js
git add functions/src/sendVerificationOTP.ts
```

5. **Commit with a good message:**
```bash
# Use conventional commits format
git commit -m "feat: add new payment gateway integration"
git commit -m "fix: resolve email validation issue"
git commit -m "docs: update README with new instructions"
git commit -m "style: improve mobile responsiveness"
```

### Pushing to GitHub

```bash
# Push your branch to GitHub
git push origin feature/your-feature-name
```

### Creating a Pull Request

1. Go to your GitHub repository
2. You'll see a banner **"Compare & pull request"** → Click it
3. Add a description of your changes
4. Click **Create pull request**
5. Review your changes
6. When ready, click **Merge pull request**
7. Delete the branch after merging

### After Merging (Auto-Deploy)

When you merge to `main`, GitHub Actions will automatically:
1. ✅ Build your functions
2. ✅ Run tests (if configured)
3. ✅ Deploy to Firebase Hosting
4. ✅ Deploy Cloud Functions

Check the deployment status:
- GitHub → **Actions** tab
- Wait for the green checkmark ✅

---

## 🔄 Common Git Commands

### Checking Status
```bash
# See what files have changed
git status

# See what's been changed in files
git diff

# See commit history
git log --oneline
```

### Undoing Changes

```bash
# Discard changes to a file (before staging)
git checkout -- filename.js

# Unstage a file (keep changes)
git reset HEAD filename.js

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes) ⚠️ DANGEROUS
git reset --hard HEAD~1
```

### Branch Management

```bash
# List all branches
git branch

# Switch branches
git checkout main
git checkout feature/my-feature

# Create and switch to new branch
git checkout -b feature/new-feature

# Delete local branch
git branch -d feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature
```

### Syncing with GitHub

```bash
# Get latest changes from GitHub
git pull origin main

# Push your commits to GitHub
git push origin main

# Force push (⚠️ use carefully)
git push origin main --force
```

---

## 📝 Commit Message Guidelines

Use this format: `type: description`

### Types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `perf:` - Performance improvement
- `test:` - Adding tests
- `chore:` - Updating build tasks, package manager configs, etc.

### Examples:
```bash
git commit -m "feat: add Google Pay integration"
git commit -m "fix: resolve OTP email sending issue on iPhone"
git commit -m "docs: update API documentation"
git commit -m "style: improve mobile navigation layout"
git commit -m "refactor: extract email template to separate file"
git commit -m "perf: optimize destination video loading"
git commit -m "chore: update Firebase SDK to latest version"
```

---

## 🌿 Branch Strategy

### Main Branches:
- `main` - Production (auto-deploys to Firebase)
- `develop` - Development/staging (optional)

### Supporting Branches:
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Example Branch Names:
```
feature/payment-integration
feature/new-destination-video
bugfix/email-not-sending
bugfix/mobile-layout
hotfix/security-patch
```

---

## 🚨 Emergency: Rollback a Deployment

If something breaks after deployment:

```bash
# See recent commits
git log --oneline

# Revert to a specific commit
git revert COMMIT_HASH

# Push the revert
git push origin main
```

Or manually deploy a previous version:
```bash
# Check out the old commit
git checkout COMMIT_HASH

# Deploy manually
firebase deploy --only hosting,functions

# Return to main
git checkout main
```

---

## 🔍 Checking Deployment Status

### In Terminal:
```bash
# See what's on GitHub
git remote -v

# See local vs remote differences
git fetch
git status
```

### On GitHub:
1. Go to repository → **Actions** tab
2. See all deployments and their status
3. Click on any deployment to see logs

### On Firebase:
1. https://console.firebase.google.com/project/vida-travel-vacation-credit
2. Check **Hosting** and **Functions** tabs
3. See deployment history and rollback if needed

---

## 💡 Best Practices

### ✅ DO:
- Commit often with clear messages
- Pull before starting new work
- Create branches for each feature
- Test locally before pushing
- Review changes before committing
- Keep commits focused and small

### ❌ DON'T:
- Commit directly to `main` (use branches)
- Commit sensitive data (API keys, passwords)
- Force push to `main` branch
- Commit large binary files
- Make huge commits with many changes
- Commit commented-out code

---

## 🆘 Getting Help

### Git Help:
```bash
git help
git help commit
git help push
```

### Common Issues:

**"Push rejected":**
```bash
# Someone else pushed changes
git pull --rebase origin main
git push origin main
```

**"Merge conflict":**
```bash
# Open conflicted files
# Look for <<<<<<< and >>>>>>>
# Edit to resolve
git add .
git commit -m "fix: resolve merge conflict"
```

**"Detached HEAD":**
```bash
# Return to main branch
git checkout main
```

---

## 📚 Additional Resources

- Git Documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com
- Firebase CI/CD: https://firebase.google.com/docs/hosting/github-integration
- Conventional Commits: https://www.conventionalcommits.org

---

## 🎯 Quick Reference

```bash
# Daily workflow
git checkout main
git pull origin main
git checkout -b feature/new-feature
# ... make changes ...
git add .
git commit -m "feat: description"
git push origin feature/new-feature
# ... create PR on GitHub ...
# ... merge PR ...
# ✅ Auto-deploys to Firebase!

# Check status
git status
git log --oneline

# Undo changes
git checkout -- filename.js
git reset --soft HEAD~1
```

---

**Remember:** Always commit to a branch first, then merge to `main` to trigger automatic deployment! 🚀

