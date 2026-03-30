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
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Work ID is required" }, { status: 400 });
    }

    if (id.startsWith('def')) {
       return NextResponse.json({ message: "Placeholder hidden" });
    }

    // Optimization: Single query to check ownership and delete
    const result = await prisma.work.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Work not found or unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ message: "Work deleted successfully" });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
