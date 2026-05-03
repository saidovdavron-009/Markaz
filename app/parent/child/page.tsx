"use client";
import React from "react";
import { BookOpen, ClipboardCheck, BookMarked, Calendar, User, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

const child = {
  id: "1",
  name: "Alibek Karimov",
  dob: "2011-05-15",
  phone: "+998 90 123 45 67",
  gender: "Erkak",
  groups: [
    { id: "1", name: "Ingliz tili A2", teacher: "Aziz Karimov", schedule: "Du, Ch, Ju — 09:00–11:00", attendance: 88, avgGrade: 84 },
    { id: "2", name: "Speaking Club", teacher: "Aziz Karimov", schedule: "Se, Pa — 14:00–16:00", attendance: 85, avgGrade: 79 },
  ],
};

const recentGrades = [
  { group: "Ingliz tili A2", type: "TEST", score: 85, max: 100, date: "2025-01-25" },
  { group: "Ingliz tili A2", type: "HOMEWORK", score: 92, max: 100, date: "2025-01-24" },
  { group: "Speaking Club", type: "QUIZ", score: 78, max: 100, date: "2025-01-22" },
  { group: "Ingliz tili A2", type: "EXAM", score: 88, max: 100, date: "2025-01-20" },
];

const recentAttendance = [
  { group: "Ingliz tili A2", date: "2025-01-27", status: "PRESENT" },
  { group: "Speaking Club", date: "2025-01-25", status: "PRESENT" },
  { group: "Ingliz tili A2", date: "2025-01-24", status: "LATE" },
  { group: "Speaking Club", date: "2025-01-22", status: "PRESENT" },
  { group: "Ingliz tili A2", date: "2025-01-20", status: "ABSENT" },
];

const attendanceBadge: Record<string, string> = {
  PRESENT: "success", ABSENT: "destructive", LATE: "warning", EXCUSED: "info"
};
const attendanceLabel: Record<string, string> = {
  PRESENT: "Keldi", ABSENT: "Kelmadi", LATE: "Kech keldi", EXCUSED: "Sababli"
};

const typeLabel: Record<string, string> = {
  TEST: "Test", HOMEWORK: "Uyga vazifa", EXAM: "Imtihon", QUIZ: "Quiz"
};

const getScoreColor = (score: number, max: number) => {
  const pct = (score / max) * 100;
  if (pct >= 90) return "text-green-600";
  if (pct >= 70) return "text-amber-600";
  return "text-red-500";
};

export default function ParentChildPage() {
  const [tab, setTab] = React.useState<"overview" | "grades" | "attendance">("overview");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Farzandim</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">O'quvchi profili va ko'rsatkichlari</p>
      </div>

      {/* Profile card */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-4">
            <UserAvatar name={child.name} size="xl" />
            <div className="flex-1">
              <h2 className="text-xl font-bold">{child.name}</h2>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{child.gender}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(child.dob)}</span>
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{child.phone}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border)]">
        {(["overview", "grades", "attendance"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t ? "border-[#1E3A5F] text-[#1E3A5F]" : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}>
            {t === "overview" ? "Umumiy" : t === "grades" ? "Baholar" : "Davomat"}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {child.groups.map(g => (
              <Card key={g.id}>
                <CardHeader>
                  <CardTitle className="text-sm">{g.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
                    <User className="h-3.5 w-3.5" />
                    <span>{g.teacher}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{g.schedule}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-[var(--muted-foreground)]">Davomat</p>
                      <p className="text-lg font-bold text-green-600 mt-0.5">{g.attendance}%</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-[var(--muted-foreground)]">O'rtacha ball</p>
                      <p className="text-lg font-bold text-blue-600 mt-0.5">{g.avgGrade}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "grades" && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border)]">
              {recentGrades.map((g, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{g.group}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{typeLabel[g.type]} • {formatDate(g.date)}</p>
                  </div>
                  <p className={`font-bold text-base ${getScoreColor(g.score, g.max)}`}>{g.score}/{g.max}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "attendance" && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border)]">
              {recentAttendance.map((a, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{a.group}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{formatDate(a.date)}</p>
                  </div>
                  <Badge variant={attendanceBadge[a.status] as any}>{attendanceLabel[a.status]}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
