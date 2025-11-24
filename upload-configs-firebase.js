// Upload config files using Firebase Admin (requires authentication)
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize with explicit credentials or use Application Default Credentials
try {
  admin.initializeApp({
    projectId: 'vida-travel-vacation-credit',
    storageBucket: 'vida-travel-vacation-credit.appspot.com'
  });
} catch (e) {
  console.log('Firebase already initialized');
}

const bucket = admin.storage().bucket();

async function uploadFile(localPath, remotePath) {
  try {
    const filePath = path.join(__dirname, localPath);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    await bucket.upload(filePath, {
      destination: remotePath,
      metadata: {
        contentType: 'application/json',
        cacheControl: 'public, max-age=3600'
      }
    });
    console.log(`✓ Uploaded ${localPath} to gs://${bucket.name}/${remotePath}`);
    return true;
  } catch (error) {
    console.error(`✗ Error uploading ${localPath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('Uploading configuration files to Cloud Storage...\n');
  
  const results = await Promise.all([
    uploadFile('pricing-config.json', 'pricing-config.json'),
    uploadFile('rag-context.json', 'rag-context.json')
  ]);
  
  if (results.every(r => r)) {
    console.log('\n✅ All files uploaded successfully!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some files failed to upload. Please upload manually via Firebase Console.');
    console.log('   Go to: https://console.firebase.google.com/project/vida-travel-vacation-credit/storage');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  console.log('\n💡 Alternative: Upload files manually via Firebase Console > Storage');
  process.exit(1);
});


