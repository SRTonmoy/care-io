// Initialize MongoDB with users and indexes
db = db.getSiblingDB('careio');

// Create collections if they don't exist
const collections = ['users', 'services', 'bookings', 'payments', 'reviews', 'notifications', 'messages', 'systemsettings'];

collections.forEach(col => {
  if (!db.getCollectionNames().includes(col)) {
    db.createCollection(col);
  }
});

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ 'caregiverProfile.isAvailable': 1 });

db.services.createIndex({ slug: 1 }, { unique: true });
db.services.createIndex({ category: 1 });

db.bookings.createIndex({ bookingNumber: 1 }, { unique: true });
db.bookings.createIndex({ userId: 1 });
db.bookings.createIndex({ status: 1 });
db.bookings.createIndex({ date: 1 });

db.payments.createIndex({ stripePaymentId: 1 }, { sparse: true });

db.reviews.createIndex({ bookingId: 1 }, { unique: true });
db.reviews.createIndex({ caregiverId: 1 });

console.log('✅ MongoDB initialized successfully');