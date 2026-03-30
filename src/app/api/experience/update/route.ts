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
    const { id, company, designation, fromDate, toDate, currentlyWorking } = await req.json();

    if (!id || !company) {
      return NextResponse.json({ error: "ID and company name are required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await (prisma as any).experience.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const experience = await (prisma as any).experience.update({
      where: { id },
      data: {
        company,
        designation,
        fromDate,
        toDate: currentlyWorking ? null : toDate,
        currentlyWorking: currentlyWorking || false,
      },
    });

    return NextResponse.json({ success: true, experience });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
