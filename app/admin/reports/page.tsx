"use client";
import React from "react";
import { Download, TrendingUp, Users, CreditCard, ClipboardCheck } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

const revenueData = [
  { month: "Yanvar", revenue: 15000000, expenses: 8000000, profit: 7000000 },
  { month: "Fevral", revenue: 18000000, expenses: 9000000, profit: 9000000 },
  { month: "Mart", revenue: 22000000, expenses: 10000000, profit: 12000000 },
  { month: "Aprel", revenue: 20000000, expenses: 9500000, profit: 10500000 },
  { month: "May", revenue: 25000000, expenses: 11000000, profit: 14000000 },
  { month: "Iyun", revenue: 23000000, expenses: 10500000, profit: 12500000 },
];

const attendanceData = [
  { week: "1-hafta", rate: 88 },
  { week: "2-hafta", rate: 85 },
  { week: "3-hafta", rate: 90 },
  { week: "4-hafta", rate: 87 },
];

const subjectPopularity = [
  { name: "Ingliz tili", students: 78, color: "#1E3A5F" },
  { name: "Matematika", students: 52, color: "#22c55e" },
  { name: "IT", students: 45, color: "#f59e0b" },
  { name: "Fizika", students: 38, color: "#ef4444" },
  { name: "Rus tili", students: 34, color: "#8b5cf6" },
];

const topStudents = [
  { rank: 1, name: "Alibek Karimov", group: "Ingliz tili A2", avgScore: 95 },
  { rank: 2, name: "Malika Toshmatova", group: "Matematika B1", avgScore: 92 },
  { rank: 3, name: "Zulfiya Abdullayeva", group: "IT Asoslari", avgScore: 89 },
  { rank: 4, name: "Jasur Yusupov", group: "Fizika A1", avgScore: 87 },
  { rank: 5, name: "Bobur Nazarov", group: "Ingliz tili A2", avgScore: 85 },
];

export default function ReportsPage() {
  const [period, setPeriod] = React.useState("6months");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Hisobotlar va Analitika</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Tizim statistikasi va hisobotlar</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 oy</SelectItem>
              <SelectItem value="3months">3 oy</SelectItem>
              <SelectItem value="6months">6 oy</SelectItem>
              <SelectItem value="1year">1 yil</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm"><Download className="h-4 w-4" />PDF</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4" />Excel</Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <StatCard title="Jami daromad" value={formatCurrency(123000000)} icon={<CreditCard className="h-5 w-5" />} iconBg="bg-green-100" trend={{ value: 18, label: "o'tgan yildan" }} />
        <StatCard title="Yangi o'quvchilar" value={47} icon={<Users className="h-5 w-5" />} iconBg="bg-blue-100" trend={{ value: 12, label: "o'tgan oydan" }} />
        <StatCard title="O'rtacha davomat" value="87%" icon={<ClipboardCheck className="h-5 w-5" />} iconBg="bg-amber-100" />
        <StatCard title="Sof foyda" value={formatCurrency(62000000)} icon={<TrendingUp className="h-5 w-5" />} iconBg="bg-purple-100" trend={{ value: 22, label: "o'tgan yildan" }} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue */}
        <Card>
          <CardHeader><CardTitle>Moliyaviy ko'rsatkichlar</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(v: unknown) => formatCurrency(v as number)} />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Daromad" stroke="#1E3A5F" fill="url(#rev)" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" name="Foyda" stroke="#22c55e" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Popularity */}
        <Card>
          <CardHeader><CardTitle>Fan mashhurligi</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={subjectPopularity} innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="students">
                  {subjectPopularity.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v} o'quvchi`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Trend */}
        <Card>
          <CardHeader><CardTitle>Davomat tendensiyasi</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} unit="%" />
                <Tooltip formatter={(v) => [`${v}%`, "Davomat"]} />
                <Line type="monotone" dataKey="rate" stroke="#1E3A5F" strokeWidth={2} dot={{ fill: "#1E3A5F" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Students */}
        <Card>
          <CardHeader><CardTitle>Eng yaxshi o'quvchilar</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border)]">
              {topStudents.map((s) => (
                <div key={s.rank} className="flex items-center gap-3 px-5 py-3">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${s.rank === 1 ? "bg-amber-100 text-amber-700" : s.rank === 2 ? "bg-gray-100 text-gray-600" : s.rank === 3 ? "bg-orange-100 text-orange-700" : "bg-[var(--muted)] text-[var(--muted-foreground)]"}`}>
                    {s.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{s.group}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#1E3A5F]">{s.avgScore}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">o'rtacha</p>
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
