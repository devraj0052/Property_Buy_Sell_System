const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);
  
  // Seed Agent
  let agentRole = await prisma.role.findUnique({ where: { name: 'AGENT' } });
  if (!agentRole) agentRole = await prisma.role.create({ data: { name: 'AGENT' } });
  
  await prisma.user.upsert({
    where: { email: 'agent@propex.com' },
    update: { password },
    create: { email: 'agent@propex.com', password, firstName: 'Test', lastName: 'Agent', roleId: agentRole.id }
  });

  // Seed Super Admin
  let saRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
  if (!saRole) saRole = await prisma.role.create({ data: { name: 'SUPER_ADMIN' } });
  
  await prisma.user.upsert({
    where: { email: 'superadmin@propex.com' },
    update: { password },
    create: { email: 'superadmin@propex.com', password, firstName: 'Super', lastName: 'Admin', roleId: saRole.id }
  });

  // Ensure Admin
  let adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  if (!adminRole) adminRole = await prisma.role.create({ data: { name: 'ADMIN' } });
  
  await prisma.user.upsert({
    where: { email: 'admin@propex.com' },
    update: { password },
    create: { email: 'admin@propex.com', password, firstName: 'Site', lastName: 'Admin', roleId: adminRole.id }
  });

  console.log('Seeding complete.');
}
main().finally(() => prisma.$disconnect());
