import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { company, designation, fromDate, toDate, currentlyWorking } = await req.json();

    if (!company) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    const experience = await (prisma as any).experience.create({
      data: {
        company,
        designation,
        fromDate,
        toDate: currentlyWorking ? null : toDate,
        currentlyWorking: currentlyWorking || false,
        user: { connect: { id: session.user.id } },
      },
    });

    return NextResponse.json({ success: true, experience });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
