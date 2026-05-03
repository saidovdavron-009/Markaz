"use client";
import React, { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Clock, BookOpen, UserCircle, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";

const groupsData: Record<string, {
  id: string; name: string; subject: string; level: string; teacher: string; teacherId: string;
  status: string; schedule: string; room: string; monthlyFee: number;
  startDate: string; studentCount: number; maxStudents: number;
  students: Array<{ id: string; name: string; joinDate: string; status: string }>;
}> = {
  "1": {
    id: "1", name: "Ingliz tili A2", subject: "Ingliz tili", level: "A2", teacher: "Aziz Karimov", teacherId: "1",
    status: "ACTIVE", schedule: "Du, Ch, Ju — 09:00–11:00", room: "Xona 101", monthlyFee: 500000,
    startDate: "2025-01-06", studentCount: 10, maxStudents: 15,
    students: [
      { id: "1", name: "Alibek Karimov", joinDate: "2025-01-06", status: "ACTIVE" },
      { id: "2", name: "Malika Toshmatova", joinDate: "2025-01-06", status: "ACTIVE" },
      { id: "3", name: "Jasur Yusupov", joinDate: "2025-01-08", status: "ACTIVE" },
      { id: "4", name: "Zulfiya Abdullayeva", joinDate: "2025-01-10", status: "ACTIVE" },
      { id: "5", name: "Bobur Nazarov", joinDate: "2025-01-12", status: "ACTIVE" },
    ],
  },
  "2": {
    id: "2", name: "Ingliz tili B1", subject: "Ingliz tili", level: "B1", teacher: "Aziz Karimov", teacherId: "1",
    status: "ACTIVE", schedule: "Du, Ch, Ju — 11:00–13:00", room: "Xona 102", monthlyFee: 600000,
    startDate: "2025-01-06", studentCount: 8, maxStudents: 12,
    students: [
      { id: "6", name: "Sherzod Qodirov", joinDate: "2025-01-06", status: "ACTIVE" },
      { id: "7", name: "Nozima Tursunova", joinDate: "2025-01-07", status: "ACTIVE" },
      { id: "8", name: "Ulugbek Mirzaev", joinDate: "2025-01-09", status: "ACTIVE" },
    ],
  },
  "3": {
    id: "3", name: "Speaking Club", subject: "Ingliz tili", level: "B2", teacher: "Aziz Karimov", teacherId: "1",
    status: "ACTIVE", schedule: "Se, Pa — 14:00–16:00", room: "Xona 201", monthlyFee: 450000,
    startDate: "2025-01-07", studentCount: 6, maxStudents: 10,
    students: [
      { id: "9", name: "Hamza Nazarov", joinDate: "2025-01-07", status: "ACTIVE" },
      { id: "10", name: "Lobar Toshpulatova", joinDate: "2025-01-07", status: "ACTIVE" },
    ],
  },
};

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const group = groupsData[id] || groupsData["1"];

  const fillPct = Math.round((group.studentCount / group.maxStudents) * 100);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold">{group.name}</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{group.subject} • {group.level} darajasi</p>
        </div>
        <Badge variant={group.status === "ACTIVE" ? "success" : "secondary"}>
          {group.status === "ACTIVE" ? "Faol" : "Nofaol"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4 pb-4 text-center">
          <p className="text-2xl font-bold text-[#1E3A5F]">{group.studentCount}</p>
          <p className="text-xs text-[var(--muted-foreground)]">O'quvchilar</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{group.maxStudents - group.studentCount}</p>
          <p className="text-xs text-[var(--muted-foreground)]">Bo'sh joy</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center">
          <p className="text-2xl font-bold text-green-600">{fillPct}%</p>
          <p className="text-xs text-[var(--muted-foreground)]">To'lganlik</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center">
          <p className="text-lg font-bold text-[#1E3A5F]">{formatCurrency(group.monthlyFee)}</p>
          <p className="text-xs text-[var(--muted-foreground)]">Oylik to'lov</p>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Guruh ma'lumotlari</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <UserCircle className="h-4 w-4 text-[var(--muted-foreground)] shrink-0" />
              <span className="text-[var(--muted-foreground)]">O'qituvchi:</span>
              <button onClick={() => router.push(`/admin/teachers/${group.teacherId}`)}
                className="font-medium text-[#1E3A5F] hover:underline truncate">
                {group.teacher}
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-[var(--muted-foreground)] shrink-0" />
              <span className="text-[var(--muted-foreground)]">Jadval:</span>
              <span className="font-medium">{group.schedule}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-[var(--muted-foreground)] shrink-0" />
              <span className="text-[var(--muted-foreground)]">Xona:</span>
              <span className="font-medium">{group.room}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-[var(--muted-foreground)] shrink-0" />
              <span className="text-[var(--muted-foreground)]">Boshlangan:</span>
              <span className="font-medium">{group.startDate}</span>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--muted-foreground)]">Sig'im</span>
                <span className="font-medium">{group.studentCount}/{group.maxStudents}</span>
              </div>
              <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${fillPct >= 90 ? "bg-red-400" : fillPct >= 70 ? "bg-amber-400" : "bg-green-500"}`}
                  style={{ width: `${fillPct}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>O'quvchilar ({group.students.length})</span>
                <Button size="sm" variant="outline">
                  <Users className="h-4 w-4" />Qo'shish
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--border)]">
                {group.students.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--muted)]/40 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/students/${s.id}`)}>
                    <span className="text-xs text-[var(--muted-foreground)] w-5 shrink-0">{i + 1}</span>
                    <UserAvatar name={s.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{s.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">Qo'shilgan: {s.joinDate}</p>
                    </div>
                    <Badge variant="success" className="text-xs">{s.status === "ACTIVE" ? "Faol" : "Nofaol"}</Badge>
                  </div>
                ))}
                {group.students.length === 0 && (
                  <div className="py-12 text-center text-[var(--muted-foreground)] text-sm">
                    O'quvchilar yo'q
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
