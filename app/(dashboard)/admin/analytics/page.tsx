"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, CalendarDays, Eye, Clock } from "lucide-react";
import toast from "react-hot-toast";

interface DailyStat {
  date: string;
  visitors: number;
  views: number;
}

interface AnalyticsStats {
  visitorsToday: number;
  visitorsMonth: number;
  totalVisitors: number;
  totalPageViews: number;
  avgDuration: number;
  dailyStats: DailyStat[];
}

function formatDuration(seconds: number) {
  const s = Math.round(seconds);
  if (s < 60) return `${s} ث`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m} د ${rem} ث`;
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/analytics");
      const data = await res.json();

      if (data.success) {
        setStats(data.stats);
      } else {
        toast.error(data.message || "فشل تحميل التحليلات");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء تحميل التحليلات");
    } finally {
      setLoading(false);
    }
  };

  const maxViews = stats ? Math.max(...stats.dailyStats.map((d) => d.views), 1) : 1;

  const cards = stats
    ? [
        { label: "زوار اليوم", value: stats.visitorsToday, icon: Users },
        { label: "زوار الشهر", value: stats.visitorsMonth, icon: CalendarDays },
        { label: "إجمالي المشاهدات", value: stats.totalPageViews, icon: Eye },
        { label: "متوسط وقت الزيارة", value: formatDuration(stats.avgDuration), icon: Clock },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-cream mb-1">التحليلات</h1>
        <p className="text-gold-muted">إحصائيات زوار الموقع ووقت الزيارة</p>
      </div>

      {loading || !stats ? (
        <div className="text-gold">جاري التحميل...</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="luxury-card p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                  <card.icon className="text-gold" size={20} />
                </div>
                <p className="text-2xl font-bold text-cream mb-1">{card.value}</p>
                <p className="text-sm text-gold-muted">{card.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Daily visits chart */}
          <div className="luxury-card p-6">
            <h2 className="text-lg font-bold text-cream mb-6">الزيارات خلال آخر 30 يوم</h2>

            {stats.dailyStats.length === 0 ? (
              <p className="text-gold-muted">لا توجد بيانات كافية بعد</p>
            ) : (
              <div className="flex items-end gap-1 h-48 overflow-x-auto">
                {stats.dailyStats.map((day) => (
                  <div
                    key={day.date}
                    className="flex flex-col items-center justify-end h-full min-w-[10px] flex-1 group relative"
                  >
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-gold whitespace-nowrap bg-black border border-gold/20 rounded px-2 py-1 z-10">
                      {day.date}: {day.views} مشاهدة
                    </div>
                    <div
                      className="w-full bg-gold/70 hover:bg-gold rounded-t transition-all"
                      style={{ height: `${(day.views / maxViews) * 100}%`, minHeight: 2 }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
