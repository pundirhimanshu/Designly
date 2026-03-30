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
    const { resumeLink, contactEmail, socials, phoneNumber } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        resumeLink,
        contactEmail,
        socials,
        phoneNumber,
      },
    });

    return NextResponse.json({ message: "Contact details updated successfully", user: updatedUser });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
