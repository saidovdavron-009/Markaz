"use client";
import React from "react";
import { BookOpen, ClipboardCheck, CreditCard, BookMarked, Calendar } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const myGroups = [
  { id: "1", name: "Ingliz tili A2", teacher: "Aziz Karimov", schedule: "Du, Ch, Ju — 09:00–11:00", room: "201-xona" },
  { id: "2", name: "Speaking Club", teacher: "Aziz Karimov", schedule: "Se, Pa — 14:00–16:00", room: "205-xona" },
];

const recentGrades = [
  { subject: "Ingliz tili A2", type: "TEST", score: 85, maxScore: 100, date: "2025-01-25" },
  { subject: "Ingliz tili A2", type: "HOMEWORK", score: 92, maxScore: 100, date: "2025-01-24" },
  { subject: "Speaking Club", type: "QUIZ", score: 78, maxScore: 100, date: "2025-01-22" },
];

const upcomingPayments = [
  { group: "Ingliz tili A2", amount: 500000, dueDate: "2025-02-01", status: "PENDING" },
  { group: "Speaking Club", amount: 400000, dueDate: "2025-02-01", status: "PAID" },
];

const todaySchedule = [
  { time: "09:00–11:00", group: "Ingliz tili A2", room: "201-xona", teacher: "Aziz Karimov" },
];

const getScoreColor = (score: number, max: number) => {
  const pct = (score / max) * 100;
  if (pct >= 90) return "text-green-600";
  if (pct >= 70) return "text-amber-600";
  return "text-red-500";
};

const typeLabels: Record<string, string> = { TEST: "Test", HOMEWORK: "Uyga vazifa", QUIZ: "Quiz", EXAM: "Imtihon" };

export default function StudentDashboardPage() {
  const { user } = useAuthStore();
  const firstName = user?.profile?.fullName?.split(" ")[0] || "O'quvchi";

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Xush kelibsiz, {firstName}!</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          {new Date().toLocaleDateString("uz-UZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <StatCard title="Guruhlarim" value={myGroups.length} icon={<BookOpen className="h-5 w-5" />} iconBg="bg-blue-100" />
        <StatCard title="Davomat" value="87%" icon={<ClipboardCheck className="h-5 w-5" />} iconBg="bg-green-100" trend={{ value: 2, label: "o'sish" }} />
        <StatCard title="O'rtacha ball" value="83%" icon={<BookMarked className="h-5 w-5" />} iconBg="bg-purple-100" />
        <StatCard title="To'lov holati" value="To'langan" icon={<CreditCard className="h-5 w-5" />} iconBg="bg-amber-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's schedule */}
        <Card>
          <CardHeader><CardTitle>Bugungi darslar</CardTitle></CardHeader>
          <CardContent className="p-0">
            {todaySchedule.length === 0 ? (
              <p className="text-center text-[var(--muted-foreground)] text-sm py-8">Bugun dars yo'q</p>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {todaySchedule.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-20 text-xs font-medium text-[#1E3A5F] bg-[#1E3A5F]/10 rounded-lg px-2 py-1 text-center">
                      {s.time}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{s.group}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{s.room} • {s.teacher}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming payments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>To'lovlar</CardTitle>
              <a href="/student/payments" className="text-xs text-[#1E3A5F] hover:underline">Barchasi →</a>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border)]">
              {upcomingPayments.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="font-medium text-sm">{p.group}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Muddat: {formatDate(p.dueDate)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm">{formatCurrency(p.amount)}</p>
                    <Badge variant={p.status === "PAID" ? "success" : "warning"}>
                      {p.status === "PAID" ? "To'langan" : "Kutilmoqda"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent grades */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>So'nggi baholar</CardTitle>
            <a href="/student/grades" className="text-xs text-[#1E3A5F] hover:underline">Barchasi →</a>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {recentGrades.map((g, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3">
                <div className="flex-1">
                  <p className="font-medium text-sm">{g.subject}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{typeLabels[g.type] || g.type} • {formatDate(g.date)}</p>
                </div>
                <p className={`font-bold text-base ${getScoreColor(g.score, g.maxScore)}`}>{g.score}/{g.maxScore}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
