import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { domain } = await req.json();
    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    // Get user from DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Save or Update domain (One domain per user)
    try {
      await prisma.domain.upsert({
        where: { userId: user.id },
        update: { name: domain },
        create: {
          name: domain,
          userId: user.id
        }
      });

      return NextResponse.json({ success: true });
    } catch (dbError: any) {
      if (dbError.code === 'P2002') { // Unique constraint failed (domain name taken)
        return NextResponse.json({ error: 'Domain already takenrd' }, { status: 400 });
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Save Domain Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
