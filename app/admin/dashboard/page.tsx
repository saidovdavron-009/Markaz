"use client";
import React from "react";
import {
  Users, GraduationCap, BookOpen, CreditCard, ClipboardCheck,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";

const mockRevenueData = [
  { month: "Yan", revenue: 15000000, profit: 7000000 },
  { month: "Fev", revenue: 18000000, profit: 9000000 },
  { month: "Mar", revenue: 22000000, profit: 12000000 },
  { month: "Apr", revenue: 20000000, profit: 10500000 },
  { month: "May", revenue: 25000000, profit: 14000000 },
  { month: "Iyn", revenue: 23000000, profit: 12500000 },
];

const mockAttendanceData = [
  { name: "Keldi", value: 78, color: "#22c55e" },
  { name: "Kelmadi", value: 12, color: "#ef4444" },
  { name: "Kech", value: 7, color: "#f59e0b" },
  { name: "Sababli", value: 3, color: "#8b5cf6" },
];

const mockRecentStudents = [
  { id: "1", fullName: "Alibek Karimov", phone: "+998 90 123 45 67", status: "ACTIVE", createdAt: "2025-01-15" },
  { id: "2", fullName: "Malika Toshmatova", phone: "+998 91 234 56 78", status: "ACTIVE", createdAt: "2025-01-14" },
  { id: "3", fullName: "Jasur Yusupov", phone: "+998 93 345 67 89", status: "FROZEN", createdAt: "2025-01-13" },
  { id: "4", fullName: "Zulfiya Abdullayeva", phone: "+998 94 456 78 90", status: "ACTIVE", createdAt: "2025-01-12" },
];

const mockRecentPayments = [
  { id: "1", studentName: "Alibek Karimov", amount: 500000, method: "CLICK", status: "PAID", paidAt: "2025-01-15" },
  { id: "2", studentName: "Malika Toshmatova", amount: 600000, method: "PAYME", status: "PAID", paidAt: "2025-01-14" },
  { id: "3", studentName: "Jasur Yusupov", amount: 500000, method: "CASH", status: "PENDING", paidAt: null },
  { id: "4", studentName: "Bobur Nazarov", amount: 500000, method: "CASH", status: "OVERDUE", paidAt: null },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-2 shadow-lg text-xs">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-xl sm:text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
          {new Date().toLocaleDateString("uz-UZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <StatCard
          title="Jami o'quvchilar"
          value={247}
          subtitle="228 aktiv"
          icon={<Users className="h-5 w-5" />}
          iconBg="bg-blue-100"
          trend={{ value: 8, label: "o'tgan oydan" }}
        />
        <StatCard
          title="O'qituvchilar"
          value={18}
          subtitle="24 guruh"
          icon={<GraduationCap className="h-5 w-5" />}
          iconBg="bg-purple-100"
        />
        <StatCard
          title="Oylik daromad"
          value={formatCurrency(25000000)}
          subtitle="12 ta kutilmoqda"
          icon={<CreditCard className="h-5 w-5" />}
          iconBg="bg-green-100"
          trend={{ value: 12, label: "o'tgan oydan" }}
        />
        <StatCard
          title="Davomat bugun"
          value="89%"
          subtitle="O'rtacha: 87%"
          icon={<ClipboardCheck className="h-5 w-5" />}
          iconBg="bg-amber-100"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm sm:text-base">Daromad dinamikasi</CardTitle>
              <Badge variant="success">2025</Badge>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:px-5">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={mockRevenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="revenue" name="Daromad" stroke="#1E3A5F" fill="url(#colorRevenue)" strokeWidth={2} />
                <Area type="monotone" dataKey="profit" name="Foyda" stroke="#22c55e" fill="url(#colorProfit)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Davomat holati</CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-5">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={mockAttendanceData}
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {mockAttendanceData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, ""]} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Recent Students */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm sm:text-base">Yangi o'quvchilar</CardTitle>
              <a href="/admin/students" className="text-xs text-[#1E3A5F] hover:underline">Barchasi →</a>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border)]">
              {mockRecentStudents.map((student) => (
                <div key={student.id} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3">
                  <UserAvatar name={student.fullName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{student.fullName}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{student.phone}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(student.status)}`}>
                      {getStatusLabel(student.status)}
                    </span>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5 hidden sm:block">{formatDate(student.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm sm:text-base">So'nggi to'lovlar</CardTitle>
              <a href="/admin/finance" className="text-xs text-[#1E3A5F] hover:underline">Barchasi →</a>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border)]">
              {mockRecentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-[var(--muted)]">
                    <CreditCard className="h-4 w-4 text-[var(--muted-foreground)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{payment.studentName}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{getStatusLabel(payment.method)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold">{formatCurrency(payment.amount)}</p>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusLabel(payment.status)}
                    </span>
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
