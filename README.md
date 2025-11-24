# VIDA Travel - Vacation Credit Platform

A bilingual (Spanish/English) vacation credit platform that helps Mexican families save for their dream vacations with transparent, interest-free payment plans.

## 🌟 Features

- **Bilingual Interface**: Full Spanish and English support
- **Smart Calculator**: Real-time payment plan calculations
- **Email Verification**: OTP-based secure enrollment
- **Beautiful UI**: Modern, responsive design with video destinations
- **Firebase Backend**: Cloud Functions, Firestore, and Hosting
- **Meta Pixel Integration**: Conversion tracking for marketing

## 🚀 Tech Stack

- **Frontend**: Vanilla JavaScript (ES6 modules), HTML5, CSS3
- **Backend**: Firebase Cloud Functions (TypeScript)
- **Database**: Cloud Firestore
- **Hosting**: Firebase Hosting
- **Email**: Resend API
- **Analytics**: Firebase Analytics, Meta Pixel

## 📁 Project Structure

```
VIDA Travel/
├── public/                 # Frontend files
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript modules
│   ├── destinations/      # Destination videos
│   ├── index.html         # Main landing page
│   └── enrollment-form.html
├── functions/             # Cloud Functions
│   ├── src/              # TypeScript source
│   └── lib/              # Compiled JavaScript
├── .github/              # GitHub Actions workflows
└── firebase.json         # Firebase configuration
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 20.x or higher
- Firebase CLI
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/vida-travel.git
cd vida-travel
```

2. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

3. Install function dependencies:
```bash
cd functions
npm install
cd ..
```

4. Login to Firebase:
```bash
firebase login
```

### Local Development

1. Build functions:
```bash
cd functions
npm run build
cd ..
```

2. Serve locally:
```bash
firebase serve
```

3. Access at: http://localhost:5000

### Deploy to Firebase

```bash
# Deploy hosting only
firebase deploy --only hosting

# Deploy functions only
firebase deploy --only functions

# Deploy everything
firebase deploy
```

## 🔄 Git Workflow

### Branch Strategy

- `main` - Production branch (auto-deploys to Firebase)
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches

### Standard Workflow

1. **Create a new branch:**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes and commit:**
```bash
git add .
git commit -m "feat: add your feature description"
```

3. **Push to GitHub:**
```bash
git push origin feature/your-feature-name
```

4. **Create a Pull Request on GitHub**

5. **Merge to main** → Auto-deploys to Firebase

### Commit Message Convention

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## 🌐 Deployment

### Automatic Deployment

- Push to `main` branch triggers automatic deployment via GitHub Actions
- Deploys both hosting and functions
- Runs build checks before deployment

### Manual Deployment

```bash
firebase deploy --only hosting,functions
```

## 📧 Environment Variables

Required for Cloud Functions:

```bash
# Set Resend API key
firebase functions:config:set resend.api_key="YOUR_RESEND_API_KEY"
```

## 🧪 Testing

Visit the test pages:
- Main site: https://vida-travel-vacation-credit.web.app
- Meta Pixel test: https://vida-travel-vacation-credit.web.app/test-pixel.html

## 📝 Key Files

- `public/js/app.js` - Main application logic
- `public/js/i18n.js` - Internationalization module
- `public/js/enrollment-form.js` - Enrollment form handler
- `functions/src/sendVerificationOTP.ts` - Email verification function
- `functions/src/verifyOTP.ts` - OTP verification function

## 🎨 Customization

### Colors (CSS Variables)

Edit in `public/css/styles.css`:
```css
--color-primary: #006B5E;
--color-secondary: #D4AF37;
--color-primary-light: #008C7A;
```

### Translations

Add/edit translations in:
- `public/js/i18n.js` - Frontend translations
- `functions/src/sendVerificationOTP.ts` - Email translations

## 🔒 Security

- OTP codes expire in 10 minutes
- Email validation on frontend and backend
- CORS enabled for API endpoints
- Firebase security rules configured

## 📊 Analytics

- Firebase Analytics for user behavior
- Meta Pixel for conversion tracking
- Custom events for key actions

## 🐛 Troubleshooting

### Functions not deploying
```bash
cd functions
npm run build
cd ..
firebase deploy --only functions
```

### Cache issues
Update version parameter in `index.html`:
```html
<link rel="stylesheet" href="/css/styles.css?v=NEWVERSION">
<script src="/js/app.js?v=NEWVERSION"></script>
```

## 📄 License

All rights reserved © 2025 VIDA Travel

## 👥 Contributors

- Development Team

## 🔗 Links

- Production: https://vida-travel-vacation-credit.web.app
- Firebase Console: https://console.firebase.google.com/project/vida-travel-vacation-credit
