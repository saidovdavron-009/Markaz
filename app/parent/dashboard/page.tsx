"use client";
import React from "react";
import { BookOpen, ClipboardCheck, CreditCard, BookMarked, TrendingUp, TrendingDown } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const children = [
  {
    id: "1",
    name: "Alibek Karimov",
    age: 14,
    groups: ["Ingliz tili A2", "Speaking Club"],
    attendance: 87,
    avgGrade: 83,
    nextLesson: "2025-01-27 09:00",
    paymentStatus: "PAID",
  },
];

const recentActivity = [
  { type: "grade", text: "Ingliz tili A2 — Test: 85/100", date: "2025-01-25", positive: true },
  { type: "attendance", text: "Ingliz tili A2 — Darsga keldi", date: "2025-01-25", positive: true },
  { type: "grade", text: "Speaking Club — Quiz: 78/100", date: "2025-01-22", positive: true },
  { type: "attendance", text: "Ingliz tili A2 — Kech keldi", date: "2025-01-20", positive: false },
  { type: "payment", text: "Yanvar to'lovi — 500 000 so'm", date: "2025-01-05", positive: true },
];

const upcomingPayments = [
  { group: "Ingliz tili A2", amount: 500000, dueDate: "2025-02-10", status: "PENDING" },
  { group: "Speaking Club", amount: 400000, dueDate: "2025-02-10", status: "PENDING" },
];

export default function ParentDashboardPage() {
  const { user } = useAuthStore();
  const child = children[0];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Xush kelibsiz!</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          {new Date().toLocaleDateString("uz-UZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Child profile */}
      <Card className="bg-gradient-to-r from-[#1E3A5F] to-[#2d5a8e] text-white">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center gap-4">
            <UserAvatar name={child.name} size="lg" className="ring-2 ring-white/30" />
            <div>
              <h2 className="font-bold text-lg">{child.name}</h2>
              <p className="text-white/70 text-sm">{child.age} yosh • {child.groups.join(", ")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <StatCard title="Davomat" value={`${child.attendance}%`} icon={<ClipboardCheck className="h-5 w-5" />} iconBg="bg-green-100"
          trend={{ value: 2, label: "o'sish" }} />
        <StatCard title="O'rtacha ball" value={`${child.avgGrade}%`} icon={<BookMarked className="h-5 w-5" />} iconBg="bg-purple-100" />
        <StatCard title="Guruhlar" value={child.groups.length} icon={<BookOpen className="h-5 w-5" />} iconBg="bg-blue-100" />
        <StatCard title="To'lov" value="To'langan" icon={<CreditCard className="h-5 w-5" />} iconBg="bg-amber-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>So'nggi faoliyat</CardTitle>
              <a href="/parent/child" className="text-xs text-[#1E3A5F] hover:underline">Batafsil →</a>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border)]">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${a.positive ? "bg-green-500" : "bg-red-400"}`} />
                  <div className="flex-1">
                    <p className="text-sm">{a.text}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{formatDate(a.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming payments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Kelgusi to'lovlar</CardTitle>
              <a href="/parent/payments" className="text-xs text-[#1E3A5F] hover:underline">Barchasi →</a>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border)]">
              {upcomingPayments.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="font-medium text-sm">{p.group}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Muddat: {formatDate(p.dueDate)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm">{formatCurrency(p.amount)}</p>
                    <Badge variant="warning">Kutilmoqda</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
