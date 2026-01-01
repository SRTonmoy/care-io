const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/care-io';

// Models
const User = require('../src/models/User');
const Service = require('../src/models/Service');
const SystemSetting = require('../src/models/SystemSetting');

async function seedDatabase() {
  console.log('🌱 Starting MongoDB database seeding...');

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out in production)
    if (process.env.NODE_ENV !== 'production') {
      await User.deleteMany({});
      await Service.deleteMany({});
      await SystemSetting.deleteMany({});
      console.log('🗑️  Cleared existing data');
    }

    // Create default services
    const services = [
      {
        name: "Baby Care",
        slug: "baby-care",
        description: "Professional baby care services including feeding, diaper changing, sleep routine, and educational activities.",
        longDescription: "Our baby care service provides professional and loving care for your little ones. We understand that every baby is unique, and our caregivers are trained to provide personalized attention to ensure your baby's comfort, safety, and development.",
        price: 25.00,
        category: "BABY",
        features: ["24/7 availability", "Certified caregivers", "Educational activities", "Feeding & diaper changing", "Sleep routine management", "Regular updates to parents"],
        isActive: true,
      },
      {
        name: "Elderly Care",
        slug: "elderly-care",
        description: "Compassionate elderly care with medication management, mobility assistance, meal preparation, and companionship.",
        longDescription: "Our elderly care service focuses on providing dignified and respectful care for seniors. We help with daily activities while promoting independence and ensuring their well-being through regular health monitoring and engaging activities.",
        price: 30.00,
        category: "ELDERLY",
        features: ["Medication management", "Mobility assistance", "Meal preparation", "Companionship", "Doctor appointment coordination", "Light housekeeping"],
        isActive: true,
      },
      {
        name: "Sick Care",
        slug: "sick-care",
        description: "Professional nursing care for patients recovering from illness or surgery, including medication administration and vital monitoring.",
        longDescription: "Our sick care service provides professional medical assistance for patients recovering from illness, surgery, or managing chronic conditions. Our trained nurses and caregivers ensure proper medication management, wound care, and regular health monitoring.",
        price: 35.00,
        category: "SICK",
        features: ["Nursing care", "Vital signs monitoring", "Medication administration", "Post-operative care", "Physiotherapy assistance", "Emergency response"],
        isActive: true,
      },
    ];

    for (const serviceData of services) {
      const existingService = await Service.findOne({ slug: serviceData.slug });
      
      if (!existingService) {
        await Service.create(serviceData);
        console.log(`✅ Created service: ${serviceData.name}`);
      } else {
        console.log(`⚠️ Service already exists: ${serviceData.name}`);
      }
    }

    // Create admin user
    const adminEmail = 'admin@care.io';
    const adminPassword = 'Admin123!'; // Will be hashed by User model
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const adminUser = new User({
        email: adminEmail,
        password: adminPassword,
        name: 'Admin User',
        role: 'ADMIN',
        emailVerified: true,
      });
      await adminUser.save();
      console.log('✅ Created admin user');
    } else {
      console.log('⚠️ Admin user already exists');
    }

    // Create demo user
    const demoEmail = 'demo@care.io';
    const demoPassword = 'demo123'; // Will be hashed by User model
    
    const existingDemo = await User.findOne({ email: demoEmail });
    
    if (!existingDemo) {
      const demoUser = new User({
        email: demoEmail,
        password: demoPassword,
        name: 'Demo User',
        role: 'USER',
        emailVerified: true,
      });
      await demoUser.save();
      console.log('✅ Created demo user');
    } else {
      console.log('⚠️ Demo user already exists');
    }

    // Create system settings
    const settings = [
      { key: 'APP_NAME', value: 'CARE-IO', type: 'STRING', description: 'Application name', category: 'GENERAL', isPublic: true },
      { key: 'SUPPORT_EMAIL', value: 'support@care.io', type: 'STRING', description: 'Support email address', category: 'CONTACT', isPublic: true },
      { key: 'SUPPORT_PHONE', value: '+1 (555) 123-4567', type: 'STRING', description: 'Support phone number', category: 'CONTACT', isPublic: true },
      { key: 'TAX_RATE', value: 8.0, type: 'NUMBER', description: 'Tax rate percentage', category: 'FINANCE' },
      { key: 'CANCELLATION_HOURS', value: 24, type: 'NUMBER', description: 'Cancellation notice in hours', category: 'BOOKING', isPublic: true },
      { key: 'MIN_BOOKING_HOURS', value: 4, type: 'NUMBER', description: 'Minimum booking hours', category: 'BOOKING', isPublic: true },
      { key: 'MAX_BOOKING_HOURS', value: 24, type: 'NUMBER', description: 'Maximum booking hours', category: 'BOOKING', isPublic: true },
      { key: 'STRIPE_ENABLED', value: true, type: 'BOOLEAN', description: 'Enable Stripe payments', category: 'PAYMENT' },
      { key: 'SMS_NOTIFICATIONS', value: true, type: 'BOOLEAN', description: 'Enable SMS notifications', category: 'NOTIFICATION' },
      { key: 'EMAIL_NOTIFICATIONS', value: true, type: 'BOOLEAN', description: 'Enable email notifications', category: 'NOTIFICATION' },
    ];

    for (const setting of settings) {
      await SystemSetting.findOneAndUpdate(
        { key: setting.key },
        setting,
        { upsert: true, new: true }
      );
    }
    console.log('✅ Created/updated system settings');

    // Create sample caregiver
    const caregiverEmail = 'caregiver@care.io';
    const existingCaregiver = await User.findOne({ email: caregiverEmail });
    
    if (!existingCaregiver) {
      const caregiver = new User({
        email: caregiverEmail,
        password: 'caregiver123',
        name: 'Emma Wilson',
        role: 'CAREGIVER',
        emailVerified: true,
        phone: '+1 (555) 987-6543',
        caregiverProfile: {
          bio: 'Certified caregiver with 8 years of experience in pediatric care. Passionate about providing loving and professional care for children.',
          experience: 8,
          hourlyRate: 28.00,
          rating: 4.9,
          totalJobs: 127,
          isAvailable: true,
          specialties: ['BABY', 'SICK'],
          certifications: [
            {
              name: 'CPR & First Aid',
              issuer: 'American Red Cross',
              issuedDate: new Date('2023-01-15'),
              expiryDate: new Date('2025-01-15'),
            },
            {
              name: 'Pediatric Care Specialist',
              issuer: 'National Caregiver Association',
              issuedDate: new Date('2022-06-10'),
            },
          ],
          schedule: [
            { dayOfWeek: 1, startTime: '08:00', endTime: '18:00', isAvailable: true },
            { dayOfWeek: 2, startTime: '08:00', endTime: '18:00', isAvailable: true },
            { dayOfWeek: 3, startTime: '08:00', endTime: '18:00', isAvailable: true },
            { dayOfWeek: 4, startTime: '08:00', endTime: '18:00', isAvailable: true },
            { dayOfWeek: 5, startTime: '08:00', endTime: '18:00', isAvailable: true },
          ],
        },
      });
      await caregiver.save();
      console.log('✅ Created sample caregiver');
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n🔑 Demo Credentials:');
    console.log('   Admin: admin@care.io / Admin123!');
    console.log('   User: demo@care.io / demo123');
    console.log('   Caregiver: caregiver@care.io / caregiver123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seedDatabase();