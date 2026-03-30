import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, skills } = await req.json();

    if (!role || !skills || !Array.isArray(skills)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        role,
        skills,
      },
    });

    console.log(`✅ Onboarding complete for user: ${session.user.email} (Role: ${role})`);

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
