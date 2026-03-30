import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { accounts: true }
  });

  return NextResponse.json({
    authenticated: true,
    session: {
      user: session.user,
      expires: session.expires
    },
    database_user: user
  });
}
