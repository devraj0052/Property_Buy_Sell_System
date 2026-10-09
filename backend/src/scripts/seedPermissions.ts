import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_PERMISSIONS = [
  'DASHBOARD_ACCESS',
  'VIEW_ANALYTICS',
  'USER_MANAGEMENT',
  'CREATE_USER',
  'EDIT_USER',
  'DELETE_USER',
  'SUSPEND_USER',
  'ASSIGN_ROLES',
  'PROPERTY_MANAGEMENT',
  'ADD_PROPERTY',
  'EDIT_PROPERTY',
  'DELETE_PROPERTY',
  'APPROVE_PROPERTY',
  'REJECT_PROPERTY',
  'FEATURE_PROPERTY',
  'CATEGORY_CRUD',
  'PROPERTY_TYPE_CRUD',
  'AMENITY_CRUD',
  'COUNTRY_CRUD',
  'STATE_CRUD',
  'CITY_CRUD',
  'BLOG_CRUD',
  'BANNER_CRUD',
  'FAQ_CRUD',
  'TESTIMONIAL_CRUD',
  'CONTACT_MESSAGES',
  'INQUIRY_MANAGEMENT',
  'APPOINTMENT_MANAGEMENT',
  'PROPERTY_VISITS',
  'REVIEWS_MODERATION',
  'RATINGS_MODERATION',
  'WISHLIST_MANAGEMENT',
  'NOTIFICATION_MANAGEMENT',
  'EMAIL_BROADCAST',
  'PUSH_NOTIFICATIONS',
  'PAYMENT_MANAGEMENT',
  'TRANSACTION_MANAGEMENT',
  'REFUND_MANAGEMENT',
  'REPORT_GENERATION',
  'CSV_EXPORT',
  'PDF_EXPORT',
  'ACTIVITY_LOGS',
  'AUDIT_LOGS',
  'SEO_SETTINGS',
  'HOMEPAGE_SETTINGS',
  'SITE_SETTINGS'
];

async function main() {
  console.log('Seeding roles and permissions...');

  // 1. Ensure permissions exist
  for (const permName of ADMIN_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { name: permName },
      update: {},
      create: { name: permName }
    });
  }

  const allPermissions = await prisma.permission.findMany();

  // 2. Ensure ADMIN and USER roles exist
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {
      permissions: {
        set: allPermissions.map(p => ({ id: p.id })) // Admin gets ALL permissions
      }
    },
    create: {
      name: 'ADMIN',
      permissions: {
        connect: allPermissions.map(p => ({ id: p.id }))
      }
    }
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: { name: 'USER' }
  });

  // 3. Create default admin user if not exists
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@propex.com' },
    update: { roleId: adminRole.id },
    create: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@propex.com',
      password: hashedPassword,
      phone: '1234567890',
      roleId: adminRole.id,
      isVerified: true,
      status: 'ACTIVE'
    }
  });

  // 4. Create sample Locations (Countries, States, Cities)
  const usa = await prisma.country.upsert({
    where: { code: 'US' },
    update: {},
    create: { name: 'United States', code: 'US' }
  });

  const california = await prisma.state.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'California', countryId: usa.id }
  });

  const sf = await prisma.city.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'San Francisco', stateId: california.id }
  });

  await prisma.location.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Downtown SF', cityId: sf.id, zipCode: '94105' }
  });

  // 5. Create sample Categories & Amenities
  const residential = await prisma.propertyCategory.upsert({
    where: { slug: 'residential' },
    update: {},
    create: { name: 'Residential', slug: 'residential' }
  });

  await prisma.propertyType.upsert({
    where: { slug: 'apartment' },
    update: {},
    create: { name: 'Apartment', slug: 'apartment', categoryId: residential.id }
  });

  await prisma.amenity.upsert({
    where: { name: 'Swimming Pool' },
    update: {},
    create: { name: 'Swimming Pool', icon: 'pool' }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
