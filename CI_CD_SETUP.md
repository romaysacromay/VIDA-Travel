# 🔄 CI/CD Setup Guide for VIDA Travel

## Overview

This project is configured to **automatically deploy to Firebase** when you push commits to GitHub. No manual deployment needed!

---

## 🎯 How It Works

### Workflow:
1. ✅ Make changes to code
2. ✅ Commit changes to git
3. ✅ Push to GitHub
4. ✅ GitHub Actions automatically deploys to Firebase
5. ✅ Your site is live!

### Deployment Triggers:

| Action | Result |
|--------|--------|
| Push to `main` branch | 🚀 **Production deployment** |
| Create Pull Request | 🔍 **Preview deployment** (temporary URL) |
| Push to other branches | ❌ No deployment |

---

## 🔧 Initial Setup (One Time Only)

### Step 1: Get Firebase Service Account Key

```bash
# Generate service account key
firebase login
firebase projects:list

# Create service account (in Firebase Console)
# Go to: https://console.firebase.google.com/project/vida-travel-vacation-credit/settings/serviceaccounts/adminsdk
```

**Or use this command:**

```bash
cd /Users/syffs/.cursor/worktrees/VIDA_Travel/Z1yk9

# This will generate the key
firebase init hosting:github
```

Follow the prompts:
- Repository: `your-username/VIDA_Travel` (or your repo name)
- Set up GitHub Actions? **Yes**
- Overwrite workflow file? **No** (we already have one)

This will:
1. Create a Firebase service account
2. Add `FIREBASE_SERVICE_ACCOUNT` secret to GitHub
3. Set up the connection

---

## 🔐 Manual Setup (Alternative)

If the automatic setup doesn't work, do this manually:

### 1. Generate Service Account Key

1. Go to: https://console.firebase.google.com/project/vida-travel-vacation-credit/settings/serviceaccounts/adminsdk
2. Click **"Generate new private key"**
3. Save the JSON file (keep it secret!)

### 2. Add Secret to GitHub

1. Go to your GitHub repository
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: `FIREBASE_SERVICE_ACCOUNT`
5. Value: Paste the **entire contents** of the JSON file
6. Click **"Add secret"**

### 3. Push the Workflow File

```bash
cd /Users/syffs/.cursor/worktrees/VIDA_Travel/Z1yk9

git add .github/workflows/firebase-hosting-deploy.yml
git commit -m "Add CI/CD workflow"
git push
```

---

## 📝 Git Workflow

### Daily Development:

```bash
cd /Users/syffs/.cursor/worktrees/VIDA_Travel/Z1yk9

# 1. Make your changes
# ... edit files ...

# 2. Check what changed
git status

# 3. Stage changes
git add .

# 4. Commit with descriptive message
git commit -m "Update landing page design with gamification"

# 5. Push to GitHub (triggers deployment)
git push origin main
```

### ✅ What Happens Next:

1. GitHub receives your push
2. GitHub Actions workflow starts
3. Code is built and tested
4. Firebase deployment happens automatically
5. Your site is live in ~2-3 minutes
6. You get a notification if it fails

---

## 🔍 Check Deployment Status

### On GitHub:

1. Go to your repository
2. Click **"Actions"** tab
3. See the latest workflow run
4. Green checkmark = Success ✅
5. Red X = Failed ❌ (click to see logs)

### On Firebase:

1. Go to: https://console.firebase.google.com/project/vida-travel-vacation-credit/hosting
2. See deployment history
3. See live URL

---

## 🚫 What NOT to Do

❌ **DON'T** run `firebase deploy` manually anymore
❌ **DON'T** commit without testing locally first
❌ **DON'T** push directly to main without reviewing
❌ **DON'T** share the service account JSON file

---

## ✅ What TO Do

✅ **Always test locally first** (`firebase serve` or `python3 -m http.server`)
✅ **Write clear commit messages**
✅ **Review your changes before pushing**
✅ **Use branches for big changes**
✅ **Create Pull Requests for team review**

---

## 🌿 Branch Strategy (Recommended)

### For New Features:

```bash
# 1. Create feature branch
git checkout -b feature/new-payment-method

# 2. Make changes and commit
git add .
git commit -m "Add new payment method"

# 3. Push feature branch
git push origin feature/new-payment-method

# 4. Create Pull Request on GitHub
# This creates a PREVIEW deployment (safe!)

# 5. After review, merge to main
# This triggers PRODUCTION deployment
```

### Why Use Branches?

- ✅ Safe to experiment
- ✅ Preview deployments for testing
- ✅ Code review before production
- ✅ Easy to rollback

---

## 🧪 Testing Before Deploy

### Local Testing:

```bash
# Option 1: Simple HTTP server
cd public
python3 -m http.server 9000
# Visit: http://localhost:9000

# Option 2: Firebase emulator
firebase serve --only hosting
# Visit: http://localhost:5000
```

### Preview Deployment (via PR):

1. Create a branch
2. Make changes
3. Push branch
4. Create Pull Request
5. GitHub Actions creates preview URL
6. Test preview before merging

---

## 📊 Monitoring Deployments

### See Deployment History:

```bash
# Via Firebase CLI
firebase hosting:channel:list

# Via Firebase Console
# https://console.firebase.google.com/project/vida-travel-vacation-credit/hosting
```

### Rollback if Needed:

```bash
# Via Firebase Console:
# Hosting → Release History → Click "..." → Rollback

# Via Git:
git revert HEAD
git push origin main
# This creates a new commit that undoes the last one
```

---

## 🎯 Quick Reference

### Safe Development Workflow:

```bash
# 1. Test locally
python3 -m http.server 9000

# 2. Commit changes
git add .
git commit -m "Description of changes"

# 3. Push (triggers deployment)
git push origin main

# 4. Wait 2-3 minutes

# 5. Check: https://vida-travel-vacation-credit.web.app
```

---

## 🔧 Cleanup Script

We also have a cleanup script that **only removes** old deployments without deploying:

```bash
cd /Users/syffs/.cursor/worktrees/VIDA_Travel/Z1yk9
./CLEANUP_ONLY.sh
```

This is useful when you want to:
- Remove old Cloud Functions
- Start fresh
- Not deploy anything yet

---

## 🚀 First Time Setup Checklist

- [ ] Firebase project created
- [ ] GitHub repository created
- [ ] Service account key generated
- [ ] `FIREBASE_SERVICE_ACCOUNT` secret added to GitHub
- [ ] Workflow file pushed to GitHub
- [ ] First deployment successful

---

## 📞 Troubleshooting

### Deployment Fails?

1. Check GitHub Actions logs
2. Look for red errors
3. Common issues:
   - Missing secret
   - Invalid service account
   - Build errors in functions
   - Firebase CLI version mismatch

### Fix:

```bash
# Update Firebase tools
npm install -g firebase-tools

# Rebuild functions
cd functions
npm install
npm run build
cd ..

# Try again
git add .
git commit -m "Fix build errors"
git push
```

---

## 🎉 Benefits of This Setup

✅ **No manual deploys** - Push and forget
✅ **Preview deployments** - Test before production
✅ **Deployment history** - Easy to track and rollback
✅ **Team friendly** - Multiple people can deploy safely
✅ **Consistent** - Same process every time
✅ **Fast** - Deploy in 2-3 minutes

---

**Your CI/CD is now ready!** 🚀

Just commit, push, and let GitHub Actions handle the rest!

