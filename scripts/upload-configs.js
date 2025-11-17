// Script to upload pricing-config.json and rag-context.json to Cloud Storage
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
admin.initializeApp({
  projectId: 'vida-travel-vacation-credit',
  storageBucket: 'vida-travel-vacation-credit.appspot.com'
});

const bucket = admin.storage().bucket();

async function uploadFile(localPath, remotePath) {
  try {
    await bucket.upload(localPath, {
      destination: remotePath,
      metadata: {
        contentType: 'application/json',
        cacheControl: 'public, max-age=3600'
      }
    });
    console.log(`✓ Uploaded ${localPath} to ${remotePath}`);
    return true;
  } catch (error) {
    console.error(`✗ Error uploading ${localPath}:`, error.message);
    return false;
  }
}

async function main() {
  const rootDir = path.join(__dirname, '..');
  
  console.log('Uploading configuration files to Cloud Storage...\n');
  
  // Upload pricing-config.json
  const pricingPath = path.join(rootDir, 'pricing-config.json');
  if (fs.existsSync(pricingPath)) {
    await uploadFile(pricingPath, 'pricing-config.json');
  } else {
    console.error('✗ pricing-config.json not found');
  }
  
  // Upload rag-context.json
  const ragPath = path.join(rootDir, 'rag-context.json');
  if (fs.existsSync(ragPath)) {
    await uploadFile(ragPath, 'rag-context.json');
  } else {
    console.error('✗ rag-context.json not found');
  }
  
  console.log('\n✓ Upload complete!');
  process.exit(0);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});


