import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  try {
    const normalizedDomain = domain.toLowerCase();
    
    // 1. Find the user by domain
    const domainRecord = await prisma.domain.findUnique({
      where: { name: normalizedDomain },
      select: {
        user: {
          select: {
            name: true,
            bio: true,
            skills: true,
            image: true,
            tools: true,
            resumeLink: true,
            contactEmail: true,
            socials: true,
            phoneNumber: true,
            background: true,
            backgroundBlur: true,
            backgroundMotion: true,
            customCursor: true,
            works: { orderBy: { createdAt: 'desc' } },
            testimonials: { orderBy: { createdAt: 'desc' } },
            experiences: { orderBy: { createdAt: 'desc' } },
          }
        }
      }
    });

    if (!domainRecord || !domainRecord.user) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    const { user } = domainRecord;

    return NextResponse.json({
      user: {
        name: user.name,
        bio: user.bio,
        skills: user.skills,
        image: user.image,
        tools: user.tools,
        resumeLink: user.resumeLink,
        contactEmail: user.contactEmail,
        socials: user.socials,
        phoneNumber: user.phoneNumber,
        background: user.background,
        backgroundBlur: user.backgroundBlur,
        backgroundMotion: user.backgroundMotion,
        customCursor: user.customCursor,
      },
      works: user.works,
      testimonials: user.testimonials,
      experiences: user.experiences,
    });
  } catch (error) {
    console.error("Public API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
