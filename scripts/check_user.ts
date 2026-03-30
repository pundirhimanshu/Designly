import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const email = 'ajaypanwar1234e@gmail.com';
  console.log(`Checking DB for email: ${email}`);

  const user = await prisma.user.findFirst({
    where: { email },
    include: { accounts: true }
  });

  if (user) {
    console.log('User found:', JSON.stringify(user, null, 2));
  } else {
    console.log('No user found with this email.');
    
    // Check if maybe there's a user WITH that email but it's linked to a different providerAccountId?
    // Or check ALL users to see if anyone has a confusing name?
  const allAccounts = await prisma.account.findMany({
    include: { user: true }
  });
  console.log('All Accounts in DB:', JSON.stringify(allAccounts, null, 2));

  const allUsers = await prisma.user.findMany({
    select: { id: true, email: true, name: true }
  });
  console.log('All Users in DB:', allUsers);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
