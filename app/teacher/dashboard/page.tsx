"use client";
import React from "react";
import { BookOpen, Users, ClipboardCheck, BookMarked, Calendar } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, getStatusColor, getStatusLabel, getDayShort } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const myGroups = [
  { id: "1", name: "Ingliz tili A2", studentCount: 10, capacity: 12, nextLesson: "2025-01-27 09:00" },
  { id: "2", name: "Ingliz tili B1", studentCount: 8, capacity: 12, nextLesson: "2025-01-27 11:00" },
  { id: "3", name: "Speaking Club", studentCount: 6, capacity: 8, nextLesson: "2025-01-28 14:00" },
];

const todaySchedule = [
  { id: "1", time: "09:00–11:00", group: "Ingliz tili A2", room: "201-xona", studentCount: 10 },
  { id: "2", time: "11:00–13:00", group: "Ingliz tili B1", room: "201-xona", studentCount: 8 },
];

const recentGrades = [
  { studentName: "Alibek K.", type: "HOMEWORK", score: 85, maxScore: 100, date: "2025-01-25" },
  { studentName: "Malika T.", type: "TEST", score: 92, maxScore: 100, date: "2025-01-25" },
  { studentName: "Jasur Y.", type: "HOMEWORK", score: 70, maxScore: 100, date: "2025-01-24" },
];

export default function TeacherDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">
          Xush kelibsiz, {user?.profile?.fullName?.split(" ")[0] || "O'qituvchi"}! 👋
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          {new Date().toLocaleDateString("uz-UZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <StatCard title="Guruhlarim" value={myGroups.length} icon={<BookOpen className="h-5 w-5" />} iconBg="bg-blue-100" />
        <StatCard title="Jami o'quvchilar" value={myGroups.reduce((s, g) => s + g.studentCount, 0)} icon={<Users className="h-5 w-5" />} iconBg="bg-purple-100" />
        <StatCard title="Bugungi darslar" value={todaySchedule.length} icon={<Calendar className="h-5 w-5" />} iconBg="bg-amber-100" />
        <StatCard title="Davomat (o'rtacha)" value="87%" icon={<ClipboardCheck className="h-5 w-5" />} iconBg="bg-green-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's Schedule */}
        <Card>
          <CardHeader><CardTitle>Bugungi darslar</CardTitle></CardHeader>
          <CardContent className="p-0">
            {todaySchedule.length === 0 ? (
              <p className="text-[var(--muted-foreground)] text-sm text-center py-8">Bugun dars yo'q</p>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {todaySchedule.map((s) => (
                  <div key={s.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-20 text-xs font-medium text-[#1E3A5F] bg-[#1E3A5F]/10 rounded-lg px-2 py-1 text-center">
                      {s.time}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{s.group}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{s.room} • {s.studentCount} ta o'quvchi</p>
                    </div>
                    <a href="/teacher/attendance" className="text-xs text-[#1E3A5F] hover:underline">Davomat →</a>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Groups */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Guruhlarim</CardTitle>
              <a href="/teacher/groups" className="text-xs text-[#1E3A5F] hover:underline">Barchasi →</a>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border)]">
              {myGroups.map((g) => (
                <div key={g.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="font-medium text-sm">{g.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {g.studentCount}/{g.capacity} o'quvchi
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="w-20 h-1.5 bg-[var(--muted)] rounded-full overflow-hidden ml-auto">
                      <div className="h-full bg-[#1E3A5F]" style={{ width: `${(g.studentCount / g.capacity) * 100}%` }} />
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">{Math.round((g.studentCount / g.capacity) * 100)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Grades */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>So'nggi baholar</CardTitle>
            <a href="/teacher/grades" className="text-xs text-[#1E3A5F] hover:underline">Barchasi →</a>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {recentGrades.map((g, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3">
                <div className="flex-1">
                  <p className="font-medium text-sm">{g.studentName}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{getStatusLabel(g.type)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#1E3A5F]">{g.score}/{g.maxScore}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{formatDate(g.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
