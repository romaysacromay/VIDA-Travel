# 🚀 Setup Auto-Deploy to Firebase

## Current Status: ❌ NOT ENABLED

Right now, when you push to GitHub, it does **NOT** automatically deploy to Firebase.

You need to set up a Firebase Service Account secret first.

---

## ⚙️ How to Enable Auto-Deploy

Follow these steps to enable automatic deployment when you push to `main`:

### Step 1: Get Firebase Service Account Key

1. Go to Firebase Console: https://console.firebase.google.com/project/vida-travel-vacation-credit/settings/serviceaccounts/adminsdk

2. Click the **"Service accounts"** tab (if not already there)

3. Click **"Generate new private key"** button

4. A warning dialog will appear → Click **"Generate key"**

5. A JSON file will download to your computer (e.g., `vida-travel-vacation-credit-firebase-adminsdk-xxxxx.json`)

6. **IMPORTANT:** Keep this file secure! Never share it publicly or commit it to Git.

7. Open the file with a text editor and **copy ALL the contents** (it should look like this):
   ```json
   {
     "type": "service_account",
     "project_id": "vida-travel-vacation-credit",
     "private_key_id": "xxxxx...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...",
     "client_email": "firebase-adminsdk-xxxxx@vida-travel-vacation-credit.iam.gserviceaccount.com",
     ...
   }
   ```

---

### Step 2: Add Secret to GitHub

1. Go to your GitHub repository: https://github.com/romaysacromay/VIDA-Travel

2. Click **"Settings"** (top menu bar)

3. In the left sidebar, click **"Secrets and variables"** → **"Actions"**

4. Click the green **"New repository secret"** button

5. Fill in the form:
   - **Name:** `FIREBASE_SERVICE_ACCOUNT`
   - **Value:** Paste the ENTIRE JSON content from the file (all of it!)

6. Click **"Add secret"**

---

### Step 3: Commit and Push the Workflow File

The workflow file is already created. Now commit and push it:

```bash
cd "/Users/m1/Desktop/VIDA Travel"

# Check what's changed
git status

# Add the workflow file
git add .github/workflows/firebase-deploy.yml

# Commit
git commit -m "feat: add GitHub Actions auto-deploy workflow"

# Push to GitHub
git push origin main
```

**NOTE:** You'll need to authenticate GitHub CLI with workflow permissions. If the push fails, run:

```bash
# Re-authenticate with workflow scope
gh auth login --scopes repo,workflow

# Or manually push via GitHub web interface
```

---

### Step 4: Test Auto-Deploy

Make a small test change:

```bash
cd "/Users/m1/Desktop/VIDA Travel"

# Create test branch
git checkout -b test/auto-deploy

# Make a small change
echo "\n## Auto-deploy test" >> README.md

# Commit and push
git add README.md
git commit -m "test: verify auto-deploy"
git push origin test/auto-deploy
```

Then:
1. Go to GitHub: https://github.com/romaysacromay/VIDA-Travel
2. Create a Pull Request
3. Merge the PR to `main`
4. Go to **Actions** tab and watch the deployment! 🎉

---

## 🔍 How to Check Deployment Status

### On GitHub:
1. Go to: https://github.com/romaysacromay/VIDA-Travel/actions
2. You'll see all deployment runs
3. Click on any run to see logs
4. Green checkmark ✅ = Success
5. Red X ❌ = Failed (click to see error logs)

### Workflow Triggers:
The workflow runs when:
- ✅ You push commits to `main` branch
- ✅ You merge a Pull Request to `main`
- ✅ You manually trigger it from Actions tab

---

## 🎯 What Happens During Auto-Deploy?

When you push to `main`:

1. **GitHub Actions starts** 🤖
2. **Checks out your code** 📥
3. **Installs Node.js 20** 
4. **Installs function dependencies** (`npm ci`)
5. **Builds TypeScript functions** (`npm run build`)
6. **Deploys to Firebase Hosting** 🚀
7. **Deploys Cloud Functions** ☁️
8. **Shows success or failure** ✅❌

Total time: ~2-5 minutes

---

## 🔧 Manual Deploy (Still Works!)

You can always deploy manually:

```bash
cd "/Users/m1/Desktop/VIDA Travel"
firebase deploy
```

This is useful for:
- Quick hotfixes
- Testing before pushing
- When auto-deploy fails

---

## 🆘 Troubleshooting

### Workflow file won't push?

**Error:** "refusing to allow an OAuth App to create or update workflow"

**Solution:** Re-authenticate with workflow scope:
```bash
gh auth login --scopes repo,workflow
```

Or manually create the file on GitHub:
1. Go to: https://github.com/romaysacromay/VIDA-Travel
2. Click "Add file" → "Create new file"
3. Name: `.github/workflows/firebase-deploy.yml`
4. Paste the workflow content
5. Commit directly to `main`

---

### Secret not found?

**Error:** "Secret FIREBASE_SERVICE_ACCOUNT not found"

**Solution:** 
1. Check secret name exactly: `FIREBASE_SERVICE_ACCOUNT`
2. Make sure you added it to "Actions" secrets (not "Codespaces" or "Dependabot")
3. Re-add the secret if needed

---

### Deployment fails?

**Check:**
1. Is the service account JSON valid?
2. Does the Firebase project exist?
3. Are there any function errors in the logs?

**View logs:**
- GitHub: Actions tab → Click on failed workflow
- Firebase: https://console.firebase.google.com/project/vida-travel-vacation-credit/functions/logs

---

## ✅ Once Setup is Complete

After adding the secret and pushing the workflow:

✨ **Auto-deploy is ENABLED!**

Your workflow:
```bash
# 1. Make changes
git checkout -b feature/new-feature
# ... edit files ...

# 2. Commit and push
git add .
git commit -m "feat: new feature"
git push origin feature/new-feature

# 3. Create PR and merge to main

# 4. ✅ AUTO-DEPLOYS TO FIREBASE!
```

No need to run `firebase deploy` manually! 🎉

---

## 📚 Resources

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Firebase Deploy Action:** https://github.com/FirebaseExtended/action-hosting-deploy
- **Your Workflows:** https://github.com/romaysacromay/VIDA-Travel/actions

---

**Current Status:** Follow Steps 1-3 above to enable auto-deploy! 🚀

