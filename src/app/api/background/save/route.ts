import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { background, blur, motion, cursor } = body;

    const data: any = {};
    if (background !== undefined) data.background = background;
    if (blur !== undefined) data.backgroundBlur = Number(blur);
    if (motion !== undefined) data.backgroundMotion = Boolean(motion);
    if (cursor !== undefined) data.customCursor = cursor;

    await (prisma as any).user.update({
      where: { id: session.user.id },
      data,
    });

    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error("Background Save API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
