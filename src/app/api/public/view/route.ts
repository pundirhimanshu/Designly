import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { domain } = await req.json();

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    // Find the domain record
    const domainRecord = await prisma.domain.findUnique({
      where: { name: domain },
      select: { userId: true }
    });

    if (!domainRecord) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    // Record the view
    await (prisma as any).pageView.create({
      data: {
        userId: domainRecord.userId,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("View Recording error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
