# 🔧 Manual CI/CD Setup (Step by Step)

Since `firebase init hosting:github` requires browser authentication, follow these manual steps:

---

## Option A: Quick Setup (Recommended)

### Step 1: Run This Command Manually

Open your terminal and run:

```bash
cd /Users/syffs/.cursor/worktrees/VIDA_Travel/Z1yk9
firebase init hosting:github
```

**Follow the prompts:**
1. It will open a browser for GitHub authentication
2. Authorize Firebase
3. Enter your repository name (e.g., `your-username/VIDA_Travel`)
4. Answer questions:
   - Set up workflow? **Yes**
   - Overwrite existing? **No** (we have a custom one)

Done! ✅

---

## Option B: Manual Secret Setup

If Option A doesn't work, do this:

### Step 1: Generate Service Account Key

```bash
cd /Users/syffs/.cursor/worktrees/VIDA_Travel/Z1yk9

# Login to Firebase
firebase login

# Get service account
firebase projects:list
```

### Step 2: Get Service Account JSON

1. Go to: https://console.firebase.google.com/project/vida-travel-vacation-credit/settings/serviceaccounts/adminsdk
2. Click **"Generate new private key"**
3. Download the JSON file
4. **Keep it secret!**

### Step 3: Add Secret to GitHub

1. Go to your GitHub repository settings
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: `FIREBASE_SERVICE_ACCOUNT`
5. Value: Copy and paste **entire contents** of the JSON file
6. Click **"Add secret"**

### Step 4: Commit and Push

```bash
cd /Users/syffs/.cursor/worktrees/VIDA_Travel/Z1yk9

git add .
git commit -m "feat: Add CI/CD pipeline and new landing page"
git push origin main
```

✅ Done! GitHub Actions will now auto-deploy!

---

## Verify Setup

1. Push your code to GitHub
2. Go to repository → **Actions** tab
3. Watch the workflow run
4. Should see green checkmark ✅

---

## Test the Workflow

```bash
# Make a small change
echo "<!-- Test -->" >> public/index.html

# Commit and push
git add .
git commit -m "test: CI/CD deployment"
git push origin main

# Watch GitHub Actions deploy it!
```

---

## What's Already Set Up

✅ **Workflow file**: `.github/workflows/firebase-hosting-deploy.yml`
✅ **Cleanup script**: `CLEANUP_ONLY.sh`
✅ **Documentation**: `CI_CD_SETUP.md` and `DEPLOYMENT_WORKFLOW.md`

**All you need**: Add the `FIREBASE_SERVICE_ACCOUNT` secret to GitHub!

---

## Quick Commit Now

Want to commit everything now? Run:

```bash
cd /Users/syffs/.cursor/worktrees/VIDA_Travel/Z1yk9

git add .
git commit -m "feat: Complete landing page redesign with CI/CD pipeline"
git push origin main
```

(This will fail to deploy until you add the secret, but your code will be safe in GitHub)

