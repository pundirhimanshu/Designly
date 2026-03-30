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
    const { tools } = await req.json();

    if (!Array.isArray(tools)) {
      return NextResponse.json({ error: "Tools must be an array" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { tools: JSON.stringify(tools) } as any,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
