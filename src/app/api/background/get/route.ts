import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await (prisma as any).user.findUnique({
      where: { id: session.user.id },
      select: { 
        background: true, 
        backgroundBlur: true, 
        backgroundMotion: true,
        customCursor: true
      },
    });

    return NextResponse.json({ 
      background: user?.background || null,
      blur: user?.backgroundBlur || 0,
      motion: user?.backgroundMotion || false,
      cursor: user?.customCursor || "default"
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
