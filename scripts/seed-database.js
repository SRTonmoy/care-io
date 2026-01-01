const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

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
    },
    {
      name: "Elderly Care",
      slug: "elderly-care",
      description: "Compassionate elderly care with medication management, mobility assistance, meal preparation, and companionship.",
      longDescription: "Our elderly care service focuses on providing dignified and respectful care for seniors. We help with daily activities while promoting independence and ensuring their well-being through regular health monitoring and engaging activities.",
      price: 30.00,
      category: "ELDERLY",
      features: ["Medication management", "Mobility assistance", "Meal preparation", "Companionship", "Doctor appointment coordination", "Light housekeeping"],
    },
    {
      name: "Sick Care",
      slug: "sick-care",
      description: "Professional nursing care for patients recovering from illness or surgery, including medication administration and vital monitoring.",
      longDescription: "Our sick care service provides professional medical assistance for patients recovering from illness, surgery, or managing chronic conditions. Our trained nurses and caregivers ensure proper medication management, wound care, and regular health monitoring.",
      price: 35.00,
      category: "SICK",
      features: ["Nursing care", "Vital signs monitoring", "Medication administration", "Post-operative care", "Physiotherapy assistance", "Emergency response"],
    },
  ];

  for (const serviceData of services) {
    const existingService = await prisma.service.findUnique({
      where: { slug: serviceData.slug },
    });

    if (!existingService) {
      await prisma.service.create({
        data: serviceData,
      });
      console.log(`✅ Created service: ${serviceData.name}`);
    } else {
      console.log(`⚠️ Service already exists: ${serviceData.name}`);
    }
  }

  // Create admin user
  const adminEmail = 'admin@care.io';
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: adminPassword,
        name: 'Admin User',
        role: 'ADMIN',
        emailVerified: true,
      },
    });
    console.log('✅ Created admin user');
  }

  // Create demo user
  const demoEmail = 'demo@care.io';
  const demoPassword = await bcrypt.hash('demo123', 10);
  
  const existingDemo = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (!existingDemo) {
    await prisma.user.create({
      data: {
        email: demoEmail,
        password: demoPassword,
        name: 'Demo User',
        role: 'USER',
        emailVerified: true,
      },
    });
    console.log('✅ Created demo user');
  }

  // Create system settings
  const settings = [
    { key: 'APP_NAME', value: 'CARE-IO', description: 'Application name' },
    { key: 'SUPPORT_EMAIL', value: 'support@care.io', description: 'Support email address' },
    { key: 'SUPPORT_PHONE', value: '+1 (555) 123-4567', description: 'Support phone number' },
    { key: 'TAX_RATE', value: '8.0', description: 'Tax rate percentage' },
    { key: 'CANCELLATION_HOURS', value: '24', description: 'Cancellation notice in hours' },
    { key: 'MIN_BOOKING_HOURS', value: '4', description: 'Minimum booking hours' },
    { key: 'MAX_BOOKING_HOURS', value: '24', description: 'Maximum booking hours' },
  ];

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, description: setting.description },
      create: setting,
    });
  }
  console.log('✅ Created system settings');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });