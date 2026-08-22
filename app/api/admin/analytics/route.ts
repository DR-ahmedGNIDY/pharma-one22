import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PageView from "@/models/PageView";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    await dbConnect();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const last30Days = new Date(startOfToday);
    last30Days.setDate(last30Days.getDate() - 29);

    const [
      visitorsTodayAgg,
      visitorsMonthAgg,
      totalVisitorsAgg,
      totalPageViews,
      avgDurationAgg,
      dailyAgg,
    ] = await Promise.all([
      PageView.distinct("visitorId", { createdAt: { $gte: startOfToday } }),
      PageView.distinct("visitorId", { createdAt: { $gte: startOfMonth } }),
      PageView.distinct("visitorId"),
      PageView.countDocuments(),
      PageView.aggregate([
        { $match: { duration: { $gt: 0 } } },
        { $group: { _id: null, avg: { $avg: "$duration" } } },
      ]),
      PageView.aggregate([
        { $match: { createdAt: { $gte: last30Days } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            visitors: { $addToSet: "$visitorId" },
            views: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        visitorsToday: visitorsTodayAgg.length,
        visitorsMonth: visitorsMonthAgg.length,
        totalVisitors: totalVisitorsAgg.length,
        totalPageViews,
        avgDuration: avgDurationAgg[0]?.avg || 0,
        dailyStats: dailyAgg.map((d) => ({
          date: d._id,
          visitors: d.visitors.length,
          views: d.views,
        })),
      },
    });
  } catch (error) {
    console.error("GET ANALYTICS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "فشل تحميل التحليلات" },
      { status: 500 }
    );
  }
}
