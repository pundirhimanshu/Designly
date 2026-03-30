import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "week"; // week, month

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    // Range calculation
    const days = range === "month" ? 30 : 7;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const views = await (prisma as any).pageView.findMany({
      where: {
        userId,
        viewDate: {
          gte: startDate,
        },
      },
      orderBy: {
        viewDate: 'asc',
      },
    });

    // Process counts by day
    const stats: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      stats[dateStr] = 0;
    }

    views.forEach((v: any) => {
      const dateStr = v.viewDate.toISOString().split('T')[0];
      // Note: we only count views that fall exactly within our generated range keys
      if (stats[dateStr] !== undefined) {
        stats[dateStr]++;
      }
    });

    const result = Object.entries(stats).map(([date, count]) => ({
      date,
      count,
    }));

    return NextResponse.json({
      success: true,
      stats: result,
      range,
      totalViews: result.reduce((acc, curr) => acc + curr.count, 0)
    });
  } catch (error) {
    console.error("Insights API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
