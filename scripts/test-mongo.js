const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://care-io:sVzwITHVuxYcBWPM@cluster0.5q9kkgs.mongodb.net/care-io?retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('🔗 Testing MongoDB connection...');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ MongoDB connected successfully!');
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📂 Collections:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    await mongoose.disconnect();
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('⚠️  Network issue. Check your internet connection.');
    } else if (error.code === 'ETIMEOUT') {
      console.log('⚠️  Connection timeout. Check MongoDB Atlas IP whitelist.');
    }
  }
}

testConnection();