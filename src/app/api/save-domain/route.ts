import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "../../../lib/email";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { domain } = await req.json();
    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    // Get user from DB with current launch status
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const normalizedDomain = domain.toLowerCase();
    const publicUrl = process.env.NODE_ENV === 'production' 
      ? `https://${normalizedDomain}.designly.co.in` 
      : `http://${normalizedDomain}.localhost:3000`;
    
    // Save or Update domain (One domain per user)
    try {
      await prisma.domain.upsert({
        where: { userId: user.id },
        update: { name: normalizedDomain },
        create: {
          name: normalizedDomain,
          userId: user.id
        }
      });

      // TRIGGER: If this is the first launch, send the congratulations email
      if (!user.welcomeEmailSent) {
        const userEmail = user.email!;
        const userName = user.name || "Designer";
        
        console.log(`Sending first-time launch email to ${userEmail} for domain ${normalizedDomain}`);
        
        await sendWelcomeEmail(userEmail, userName, publicUrl);
        
        // Update flag to true so we don't send it again
        await prisma.user.update({
          where: { id: user.id },
          data: { welcomeEmailSent: true }
        });
      }

      return NextResponse.json({ success: true, url: publicUrl });
    } catch (dbError: any) {
      if (dbError.code === 'P2002') { // Unique constraint failed (domain name taken)
        return NextResponse.json({ error: 'Domain already taken' }, { status: 400 });
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Save Domain Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
