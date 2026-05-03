"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type GradeType = "HOMEWORK" | "TEST" | "EXAM" | "QUIZ";

const grades = [
  { id: "1", group: "Ingliz tili A2", type: "TEST" as GradeType, score: 85, maxScore: 100, date: "2025-01-25" },
  { id: "2", group: "Ingliz tili A2", type: "HOMEWORK" as GradeType, score: 92, maxScore: 100, date: "2025-01-24" },
  { id: "3", group: "Speaking Club", type: "QUIZ" as GradeType, score: 78, maxScore: 100, date: "2025-01-22" },
  { id: "4", group: "Ingliz tili A2", type: "EXAM" as GradeType, score: 88, maxScore: 100, date: "2025-01-20" },
  { id: "5", group: "Ingliz tili A2", type: "HOMEWORK" as GradeType, score: 95, maxScore: 100, date: "2025-01-18" },
  { id: "6", group: "Speaking Club", type: "TEST" as GradeType, score: 72, maxScore: 100, date: "2025-01-15" },
];

const typeLabels: Record<GradeType, string> = {
  HOMEWORK: "Uyga vazifa", TEST: "Test", EXAM: "Imtihon", QUIZ: "Quiz"
};
const typeBadge: Record<GradeType, string> = {
  HOMEWORK: "secondary", TEST: "warning", EXAM: "destructive", QUIZ: "info"
};

const chartData = [
  { name: "Jan 15", ball: 72 },
  { name: "Jan 18", ball: 95 },
  { name: "Jan 20", ball: 88 },
  { name: "Jan 22", ball: 78 },
  { name: "Jan 24", ball: 92 },
  { name: "Jan 25", ball: 85 },
];

const getScoreColor = (pct: number) => {
  if (pct >= 90) return "text-green-600";
  if (pct >= 70) return "text-amber-600";
  return "text-red-500";
};

export default function ParentGradesPage() {
  const [groupFilter, setGroupFilter] = React.useState("ALL");

  const filtered = grades.filter(g => groupFilter === "ALL" || g.group === groupFilter);
  const avg = filtered.length
    ? Math.round(filtered.reduce((s, g) => s + (g.score / g.maxScore) * 100, 0) / filtered.length)
    : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Farzandim baholari</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Alibek Karimov — o'zlashtirish ko'rsatkichlari</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-5">
          <p className="text-xs text-[var(--muted-foreground)]">O'rtacha ball</p>
          <p className={`text-2xl font-bold mt-1 ${getScoreColor(avg)}`}>{avg}%</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-xs text-[var(--muted-foreground)]">Jami baholar</p>
          <p className="text-2xl font-bold mt-1">{grades.length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-xs text-[var(--muted-foreground)]">Guruhlar</p>
          <p className="text-2xl font-bold mt-1">2</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Ball dinamikasi</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v}%`, "Ball"]} />
              <Bar dataKey="ball" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Select value={groupFilter} onValueChange={setGroupFilter}>
          <SelectTrigger className="w-48 h-9"><SelectValue placeholder="Guruh" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Barcha guruhlar</SelectItem>
            <SelectItem value="Ingliz tili A2">Ingliz tili A2</SelectItem>
            <SelectItem value="Speaking Club">Speaking Club</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {filtered.map(g => {
              const pct = Math.round((g.score / g.maxScore) * 100);
              return (
                <div key={g.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{g.group}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant={typeBadge[g.type] as any}>{typeLabels[g.type]}</Badge>
                      <span className="text-xs text-[var(--muted-foreground)]">{formatDate(g.date)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${getScoreColor(pct)}`}>{g.score}/{g.maxScore}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{pct}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
