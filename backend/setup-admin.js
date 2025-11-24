const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    // Update the first user to be admin
    const user = await prisma.user.findFirst();
    
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'admin' }
      });
      console.log(`Updated user ${user.email} to admin role`);
    } else {
      console.log('No users found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();