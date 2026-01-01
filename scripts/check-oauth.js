// Add this at the VERY TOP of the file
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking OAuth Configuration...\n');

// Debug: Show what dotenv loaded
console.log('📁 Loading .env.local from:', require('path').resolve('.env.local'));

const requiredEnvVars = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'MONGODB_URI'
];

console.log('✅ Environment Variables:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // Show first/last few chars for secrets
    if (varName.includes('SECRET') || varName.includes('KEY') || varName.includes('TOKEN')) {
      const masked = value.length > 8 
        ? value.substring(0, 4) + '***' + value.substring(value.length - 4)
        : '***';
      console.log(`   ${varName}: ${masked}`);
    } else {
      console.log(`   ${varName}: ${value}`);
    }
  } else {
    console.log(`   ❌ ${varName}: NOT SET`);
  }
});

console.log('\n🔗 OAuth Callback URLs:');
const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
console.log(`   Base URL: ${baseUrl}`);
console.log(`   Google Callback: ${baseUrl}/api/auth/callback/google`);

console.log('\n📋 Google Cloud Console Checklist:');
console.log('   1. ✅ Project created');
console.log('   2. ✅ OAuth consent screen configured');
console.log('   3. ✅ OAuth client ID created (Web application)');
console.log('   4. ✅ Authorized JavaScript origins:');
console.log(`        - ${baseUrl}`);
console.log('   5. ✅ Authorized redirect URIs:');
console.log(`        - ${baseUrl}/api/auth/callback/google`);

console.log('\n🔧 Next Steps:');
console.log('   1. Restart your Next.js server after changing env vars');
console.log('   2. Clear browser cookies/cache');
console.log('   3. Try incognito/private window');

// Additional debug
console.log('\n🔍 Debug Info:');
console.log('   Current directory:', process.cwd());
console.log('   NODE_ENV:', process.env.NODE_ENV);