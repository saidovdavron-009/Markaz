"use client";
import React, { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Calendar, BookOpen, Edit, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";
import toast from "react-hot-toast";

const groupsData: Record<string, {
  id: string; name: string; subject: string; teacher: string; teacherId: string;
  capacity: number; studentCount: number; monthlyFee: number; status: string;
  schedule: string; room: string; startDate: string;
  students: Array<{ id: string; name: string; attendance: number; balance: number }>;
}> = {
  "1": {
    id: "1", name: "Ingliz tili A2", subject: "Ingliz tili", teacher: "Aziz Karimov", teacherId: "1",
    capacity: 12, studentCount: 10, monthlyFee: 500000, status: "ACTIVE",
    schedule: "Du, Ch, Ju — 09:00–11:00", room: "201-xona", startDate: "2024-09-01",
    students: [
      { id: "1", name: "Alibek Karimov",     attendance: 95, balance: 0 },
      { id: "2", name: "Malika Toshmatova",  attendance: 88, balance: 500000 },
      { id: "3", name: "Jasur Yusupov",      attendance: 72, balance: 0 },
      { id: "4", name: "Zulfiya Abdullayeva",attendance: 91, balance: 0 },
      { id: "5", name: "Bobur Nazarov",      attendance: 80, balance: 500000 },
      { id: "6", name: "Umida Yusupova",     attendance: 96, balance: 0 },
      { id: "7", name: "Sherzod Karimov",    attendance: 68, balance: 0 },
      { id: "8", name: "Nodira Tosheva",     attendance: 84, balance: 0 },
      { id: "9", name: "Dilnoza Rashidova",  attendance: 90, balance: 0 },
      { id: "10", name: "Eldor Mirzayev",    attendance: 77, balance: 500000 },
    ],
  },
};

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const group = groupsData[id] || groupsData["1"];

  const avgAttendance = Math.round(group.students.reduce((s, st) => s + st.attendance, 0) / group.students.length);
  const debtors = group.students.filter(s => s.balance > 0).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold">{group.name}</h1>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(group.status)}`}>
              {getStatusLabel(group.status)}
            </span>
          </div>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{group.subject} • {group.teacher}</p>
        </div>
        <Button variant="outline" size="sm"><Edit className="h-4 w-4" />Tahrirlash</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <Card><CardContent className="pt-5">
          <p className="text-xs text-[var(--muted-foreground)]">O'quvchilar</p>
          <p className="text-2xl font-bold mt-1">{group.studentCount}/{group.capacity}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-xs text-[var(--muted-foreground)]">Oylik to'lov</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(group.monthlyFee)}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-xs text-[var(--muted-foreground)]">O'rtacha davomat</p>
          <p className={`text-2xl font-bold mt-1 ${avgAttendance >= 80 ? "text-green-600" : "text-amber-500"}`}>{avgAttendance}%</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-xs text-[var(--muted-foreground)]">Qarzdorlar</p>
          <p className={`text-2xl font-bold mt-1 ${debtors > 0 ? "text-red-500" : "text-green-600"}`}>{debtors}</p>
        </CardContent></Card>
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Guruh ma'lumotlari</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Fan", value: group.subject },
              { label: "O'qituvchi", value: group.teacher },
              { label: "Jadval", value: group.schedule },
              { label: "Xona", value: group.room },
              { label: "Boshlangan sana", value: group.startDate },
              { label: "Sig'im", value: `${group.studentCount}/${group.capacity} o'quvchi` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
            <div className="w-full h-1.5 bg-[var(--muted)] rounded-full overflow-hidden mt-2">
              <div className="h-full bg-[#1E3A5F]" style={{ width: `${(group.studentCount / group.capacity) * 100}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tezkor amallar</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => router.push(`/admin/attendance?group=${id}`)}>
              <Calendar className="h-4 w-4" />Davomat belgilash
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => router.push(`/admin/grades?group=${id}`)}>
              <BookOpen className="h-4 w-4" />Baholar
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <UserPlus className="h-4 w-4" />O'quvchi qo'shish
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => { toast.success("Guruh o'chirildi"); router.push("/admin/groups"); }}>
              <Trash2 className="h-4 w-4" />Guruhni o'chirish
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Students */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>O'quvchilar ro'yxati</CardTitle>
            <Button size="sm"><UserPlus className="h-4 w-4" />Qo'shish</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {group.students.map((s, idx) => (
              <div key={s.id} className="flex items-center gap-3 px-5 py-3">
                <span className="text-xs text-[var(--muted-foreground)] w-5">{idx + 1}</span>
                <UserAvatar name={s.name} size="sm" />
                <span className="flex-1 text-sm font-medium">{s.name}</span>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-[var(--muted-foreground)]">Davomat</p>
                    <p className={`text-sm font-bold ${s.attendance >= 80 ? "text-green-600" : "text-red-500"}`}>{s.attendance}%</p>
                  </div>
                  {s.balance > 0 && (
                    <Badge variant="destructive">{formatCurrency(s.balance)} qarzi</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
