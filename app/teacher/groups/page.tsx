"use client";
import React from "react";
import { Users, Calendar, BookOpen, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";
import Link from "next/link";

const myGroups = [
  { id: "1", name: "Ingliz tili A2", subject: "Ingliz tili", studentCount: 10, capacity: 12, monthlyFee: 500000, status: "ACTIVE", schedule: "Du, Ch, Ju — 09:00–11:00", room: "201-xona" },
  { id: "2", name: "Ingliz tili B1", subject: "Ingliz tili", studentCount: 8, capacity: 12, monthlyFee: 600000, status: "ACTIVE", schedule: "Du, Ch, Ju — 11:00–13:00", room: "201-xona" },
  { id: "3", name: "Speaking Club", subject: "Ingliz tili", studentCount: 6, capacity: 8, monthlyFee: 400000, status: "FULL", schedule: "Se, Pa — 14:00–16:00", room: "205-xona" },
];

const groupStudents: Record<string, Array<{ id: string; name: string; attendance: number }>> = {
  "1": [
    { id: "1", name: "Alibek Karimov", attendance: 95 },
    { id: "2", name: "Malika Toshmatova", attendance: 88 },
    { id: "3", name: "Jasur Yusupov", attendance: 72 },
    { id: "4", name: "Zulfiya Abdullayeva", attendance: 91 },
  ],
};

export default function TeacherGroupsPage() {
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Guruhlarim</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Mening guruhlarim ro'yxati</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {myGroups.map((g) => (
          <Card key={g.id} className={`hover:shadow-md transition-shadow cursor-pointer ${selectedGroup === g.id ? "ring-2 ring-[#1E3A5F]" : ""}`}
            onClick={() => setSelectedGroup(selectedGroup === g.id ? null : g.id)}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#1E3A5F]/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-[#1E3A5F]" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{g.name}</CardTitle>
                    <p className="text-xs text-[var(--muted-foreground)]">{g.subject}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(g.status)}`}>
                  {getStatusLabel(g.status)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
                  <Users className="h-3.5 w-3.5" />
                  <span>{g.studentCount}/{g.capacity} o'quvchi</span>
                </div>
                <span className="font-medium">{formatCurrency(g.monthlyFee)}/oy</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
                <div className="h-full bg-[#1E3A5F]" style={{ width: `${(g.studentCount / g.capacity) * 100}%` }} />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                <Calendar className="h-3.5 w-3.5" />
                <span>{g.schedule}</span>
              </div>
              <div className="flex gap-2 pt-1">
                <Link href={`/teacher/attendance?group=${g.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full h-7 text-xs">Davomat</Button>
                </Link>
                <Link href={`/teacher/grades?group=${g.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full h-7 text-xs">Baholar</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedGroup && groupStudents[selectedGroup] && (
        <Card>
          <CardHeader>
            <CardTitle>
              {myGroups.find(g => g.id === selectedGroup)?.name} — O'quvchilar ro'yxati
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {groupStudents[selectedGroup].map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)]">
                  <span className="text-sm font-medium">{s.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[var(--muted-foreground)]">Davomat:</span>
                      <span className={`font-bold ${s.attendance >= 80 ? "text-green-600" : "text-red-500"}`}>{s.attendance}%</span>
                    </div>
                    <Button variant="ghost" size="icon-sm">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
