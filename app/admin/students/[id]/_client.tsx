"use client";
import React, { use } from "react";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Pencil, Copy, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatCurrency, formatPhone, getStatusColor, getStatusLabel } from "@/lib/utils";
import type { Payment, Attendance, Grade } from "@/types";
import toast from "react-hot-toast";

function genPassword(seed: number) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  let n = seed * 9301 + 49297;
  for (let i = 0; i < 8; i++) {
    n = (n * 9301 + 49297) % 233280;
    result += chars[n % chars.length];
  }
  return result;
}

const mockPayments: Payment[] = [
  { id: "1", studentId: "1", amount: 500000, method: "CLICK", status: "PAID", paidAt: "2025-01-15", createdAt: "2025-01-15T00:00:00Z" },
  { id: "2", studentId: "1", amount: 500000, method: "PAYME", status: "PAID", paidAt: "2024-12-15", createdAt: "2024-12-15T00:00:00Z" },
  { id: "3", studentId: "1", amount: 500000, method: "CASH", status: "OVERDUE", createdAt: "2025-02-01T00:00:00Z" },
];

const mockAttendances: Attendance[] = [
  { id: "1", scheduleId: "1", studentId: "1", status: "PRESENT", date: "2025-01-20" },
  { id: "2", scheduleId: "2", studentId: "1", status: "PRESENT", date: "2025-01-22" },
  { id: "3", scheduleId: "3", studentId: "1", status: "ABSENT", date: "2025-01-24", note: "Kasal" },
  { id: "4", scheduleId: "4", studentId: "1", status: "LATE", date: "2025-01-27" },
];

const mockGrades: Grade[] = [
  { id: "1", studentId: "1", teacherId: "1", type: "HOMEWORK", score: 85, maxScore: 100, date: "2025-01-20", createdAt: "2025-01-20T00:00:00Z" },
  { id: "2", studentId: "1", teacherId: "1", type: "TEST", score: 78, maxScore: 100, comment: "Yaxshi ishladi", date: "2025-01-25", createdAt: "2025-01-25T00:00:00Z" },
  { id: "3", studentId: "1", teacherId: "1", type: "CLASSWORK", score: 4, maxScore: 5, date: "2025-01-28", createdAt: "2025-01-28T00:00:00Z" },
];

const names = ["Alibek Karimov", "Malika Toshmatova", "Jasur Yusupov", "Zulfiya Abdullayeva", "Bobur Nazarov"];

type TabValue = "payments" | "attendance" | "grades" | "groups";

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = React.useState<TabValue>("payments");
  const [showPassword, setShowPassword] = React.useState(false);

  const numericId = parseInt(id) || 1;
  const studentId = `ID${String(numericId).padStart(3, "0")}`;
  const password = genPassword(numericId);
  const fullName = names[(numericId - 1) % names.length];

  const attendanceRate = Math.round(
    (mockAttendances.filter(a => a.status === "PRESENT").length / mockAttendances.length) * 100
  );

  const copyCredentials = () => {
    navigator.clipboard.writeText(`Login: ${studentId}\nParol: ${password}`);
    toast.success("Kirish ma'lumotlari nusxalandi!");
  };

  const tabs: { value: TabValue; label: string }[] = [
    { value: "payments", label: "To'lovlar" },
    { value: "attendance", label: "Davomat" },
    { value: "grades", label: "Baholar" },
    { value: "groups", label: "Guruhlar" },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/students">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold">O'quvchi profili</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <UserAvatar name={fullName} size="xl" />
              <div>
                <h2 className="font-bold text-lg">{fullName}</h2>
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800">Aktiv</span>
              </div>
              <Link href={`/admin/students/${id}/edit`} className="w-full">
                <Button variant="outline" size="sm" className="w-full"><Pencil className="h-3.5 w-3.5" />Tahrirlash</Button>
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-[var(--muted-foreground)] shrink-0" /><span>+998 90 {100 + numericId} {200 + numericId} 30</span></div>
              <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-[var(--muted-foreground)] shrink-0" /><span className="text-[var(--muted-foreground)]">Ota-ona:</span><span>+998 91 234 56 78</span></div>
              <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-[var(--muted-foreground)] shrink-0" /><span>Toshkent sh., Yunusobod</span></div>
              <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-[var(--muted-foreground)] shrink-0" /><span>15 Mart 2005</span></div>
            </div>
            <div className="mt-5 pt-4 border-t border-[var(--border)]">
              <p className="text-xs font-semibold text-[var(--muted-foreground)] mb-2">Kirish ma'lumotlari</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--muted-foreground)]">Login:</span>
                  <span className="font-mono font-bold text-[#1E3A5F] text-sm bg-[#1E3A5F]/10 px-2 py-0.5 rounded">{studentId}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[var(--muted-foreground)]">Parol:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-sm">{showPassword ? password : "••••••••"}</span>
                    <button onClick={() => setShowPassword(v => !v)} className="text-[var(--muted-foreground)] hover:text-[#1E3A5F]">
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3" onClick={copyCredentials}><Copy className="h-3.5 w-3.5" />Nusxalash</Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-2xl font-bold text-[#1E3A5F]">{(numericId % 3) + 1}</p><p className="text-xs text-[var(--muted-foreground)]">Guruhlar</p></CardContent></Card>
            <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-2xl font-bold text-green-600">{attendanceRate}%</p><p className="text-xs text-[var(--muted-foreground)]">Davomat</p></CardContent></Card>
            <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-2xl font-bold text-amber-600">{mockPayments.filter(p => p.status === "OVERDUE").length}</p><p className="text-xs text-[var(--muted-foreground)]">Qarzdorlik</p></CardContent></Card>
          </div>
          <Card>
            <CardContent className="pt-5">
              <div className="flex gap-1 border-b border-[var(--border)] mb-4">
                {tabs.map(t => (
                  <button key={t.value} onClick={() => setActiveTab(t.value)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === t.value ? "border-[#1E3A5F] text-[#1E3A5F]" : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}>
                    {t.label}
                  </button>
                ))}
              </div>
              {activeTab === "payments" && (
                <Table><TableHeader><TableRow><TableHead>Sana</TableHead><TableHead>Miqdor</TableHead><TableHead>Usul</TableHead><TableHead>Holat</TableHead></TableRow></TableHeader>
                  <TableBody>{mockPayments.map(p => (<TableRow key={p.id}><TableCell>{p.paidAt ? formatDate(p.paidAt) : "—"}</TableCell><TableCell className="font-medium">{formatCurrency(p.amount)}</TableCell><TableCell>{getStatusLabel(p.method)}</TableCell><TableCell><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(p.status)}`}>{getStatusLabel(p.status)}</span></TableCell></TableRow>))}</TableBody>
                </Table>
              )}
              {activeTab === "attendance" && (
                <Table><TableHeader><TableRow><TableHead>Sana</TableHead><TableHead>Holat</TableHead><TableHead>Izoh</TableHead></TableRow></TableHeader>
                  <TableBody>{mockAttendances.map(a => (<TableRow key={a.id}><TableCell>{formatDate(a.date)}</TableCell><TableCell><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(a.status)}`}>{getStatusLabel(a.status)}</span></TableCell><TableCell className="text-[var(--muted-foreground)]">{a.note || "—"}</TableCell></TableRow>))}</TableBody>
                </Table>
              )}
              {activeTab === "grades" && (
                <Table><TableHeader><TableRow><TableHead>Sana</TableHead><TableHead>Tur</TableHead><TableHead>Ball</TableHead><TableHead>Izoh</TableHead></TableRow></TableHeader>
                  <TableBody>{mockGrades.map(g => (<TableRow key={g.id}><TableCell>{formatDate(g.date)}</TableCell><TableCell>{getStatusLabel(g.type)}</TableCell><TableCell className="font-medium">{g.score}/{g.maxScore}</TableCell><TableCell className="text-[var(--muted-foreground)]">{g.comment || "—"}</TableCell></TableRow>))}</TableBody>
                </Table>
              )}
              {activeTab === "groups" && (
                <div className="space-y-2">
                  {[{ id: "1", name: "Ingliz tili — A2", monthlyFee: 500000, status: "ACTIVE" as const }, { id: "2", name: "Matematika — B1", monthlyFee: 450000, status: "ACTIVE" as const }].slice(0, (numericId % 3) + 1).map(g => (
                    <div key={g.id} className="flex items-center justify-between p-3 border border-[var(--border)] rounded-lg">
                      <div><p className="font-medium text-sm">{g.name}</p><p className="text-xs text-[var(--muted-foreground)]">{formatCurrency(g.monthlyFee)}/oy</p></div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(g.status)}`}>{getStatusLabel(g.status)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
