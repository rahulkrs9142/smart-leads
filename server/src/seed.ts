import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import User from './models/User';
import Lead from './models/Lead';
import { UserRole, LeadStatus, LeadSource } from './types';

// Ensure reliable SRV record resolution for MongoDB Atlas on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Fallback to system DNS
}

dotenv.config();

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is not defined in server/.env');
      process.exit(1);
    }

    console.log('⏳ Connecting to MongoDB for seeding...');
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log('🧹 Cleaned existing users and leads');

    // Create Admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@smartleads.com',
      password: 'password123',
      role: UserRole.ADMIN,
    });

    // Create Sales user
    const salesUser = await User.create({
      name: 'Sales Executive',
      email: 'sales@smartleads.com',
      password: 'password123',
      role: UserRole.SALES,
    });

    console.log('👤 Created demo users:');
    console.log('   Admin: admin@smartleads.com / password123');
    console.log('   Sales: sales@smartleads.com / password123');

    // Create Sample Leads
    const sampleLeads = [
      {
        name: 'John Doe',
        email: 'john.doe@techcorp.io',
        status: LeadStatus.NEW,
        source: LeadSource.WEBSITE,
        assignedTo: salesUser._id,
      },
      {
        name: 'Sarah Connor',
        email: 'sarah.c@cyberdyne.net',
        status: LeadStatus.QUALIFIED,
        source: LeadSource.REFERRAL,
        assignedTo: salesUser._id,
      },
      {
        name: 'Alex Rivera',
        email: 'alex.rivera@innovate.co',
        status: LeadStatus.CONTACTED,
        source: LeadSource.INSTAGRAM,
        assignedTo: salesUser._id,
      },
      {
        name: 'Emma Watson',
        email: 'emma.w@acmeinc.org',
        status: LeadStatus.QUALIFIED,
        source: LeadSource.WEBSITE,
        assignedTo: adminUser._id,
      },
      {
        name: 'Michael Chang',
        email: 'm.chang@apexsolutions.com',
        status: LeadStatus.LOST,
        source: LeadSource.WEBSITE,
        assignedTo: salesUser._id,
      },
      {
        name: 'Jessica Alba',
        email: 'jessica@venturecapital.com',
        status: LeadStatus.NEW,
        source: LeadSource.REFERRAL,
        assignedTo: adminUser._id,
      },
      {
        name: 'David Kim',
        email: 'david.kim@nexusanalytics.dev',
        status: LeadStatus.CONTACTED,
        source: LeadSource.INSTAGRAM,
        assignedTo: salesUser._id,
      },
      {
        name: 'Olivia Rodrigo',
        email: 'olivia@soundwave.media',
        status: LeadStatus.QUALIFIED,
        source: LeadSource.WEBSITE,
        assignedTo: salesUser._id,
      },
    ];

    await Lead.insertMany(sampleLeads);
    console.log(`📋 Inserted ${sampleLeads.length} sample leads`);
    console.log('\n🎉 Database seeding completed successfully!\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
