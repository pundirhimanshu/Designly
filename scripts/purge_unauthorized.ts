import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const ALLOWED_EMAILS = [
  "himanshupundir506@gmail.com",
  "himahsu1243@gmail.com"
];

async function main() {
  // Find all users NOT in the allowed list
  const allUsers = await prisma.user.findMany({
    select: { id: true, email: true, name: true }
  });

  console.log("All users in DB:", allUsers);

  const unauthorizedUsers = allUsers.filter(u => 
    u.email && !ALLOWED_EMAILS.includes(u.email.toLowerCase().trim())
  );

  console.log("Unauthorized users to purge:", unauthorizedUsers);

  for (const user of unauthorizedUsers) {
    console.log(`\nPurging user: ${user.email} (${user.id})`);

    // Delete sessions first
    const deletedSessions = await prisma.session.deleteMany({
      where: { userId: user.id }
    });
    console.log(`  Deleted ${deletedSessions.count} sessions`);

    // Delete accounts
    const deletedAccounts = await prisma.account.deleteMany({
      where: { userId: user.id }
    });
    console.log(`  Deleted ${deletedAccounts.count} accounts`);

    // Delete the user (cascades experiences, works, etc.)
    await prisma.user.delete({
      where: { id: user.id }
    });
    console.log(`  Deleted user record`);
  }

  // Also purge any orphaned sessions (sessions whose token doesn't belong to allowed users)
  const allSessions = await prisma.session.findMany({
    include: { user: true }
  });

  for (const sess of allSessions) {
    if (sess.user.email && !ALLOWED_EMAILS.includes(sess.user.email.toLowerCase().trim())) {
      await prisma.session.delete({ where: { id: sess.id } });
      console.log(`Purged orphaned session ${sess.id} for ${sess.user.email}`);
    }
  }

  console.log("\n✅ Purge complete! Only authorized users remain.");
  
  // Verify
  const remaining = await prisma.user.findMany({
    select: { id: true, email: true, name: true }
  });
  console.log("Remaining users:", remaining);
}

main().catch(console.error).finally(() => prisma.$disconnect());
