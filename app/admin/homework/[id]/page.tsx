"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, FileText, CheckCircle, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

const allHomework = [
  { id: "1", groupId: "1", groupName: "Ingliz tili A2", teacherName: "Aziz Karimov", title: "Unit 5 - Grammar mashqlari", description: "Past Simple va Present Perfect farqi. Darslikdan 1-30 mashqlarni bajaring.", dueDate: "2025-01-25", createdAt: "2025-01-20T00:00:00Z", submittedCount: 8, totalStudents: 10 },
  { id: "2", groupId: "2", groupName: "Matematika B1", teacherName: "Sardor Toshmatov", title: "Kvadrat tenglamalar", description: "1-10 mashqlar, formula bilan yechish. Javoblarni tekshiring.", dueDate: "2025-01-26", createdAt: "2025-01-21T00:00:00Z", submittedCount: 5, totalStudents: 12 },
  { id: "3", groupId: "3", groupName: "Fizika A1", teacherName: "Malika Yusupova", title: "Nyuton qonunlari", description: "Misollar 15-25. Har bir misolni tushuntiring.", dueDate: "2025-01-27", createdAt: "2025-01-22T00:00:00Z", submittedCount: 10, totalStudents: 10 },
  { id: "4", groupId: "1", groupName: "Ingliz tili A2", teacherName: "Aziz Karimov", title: "Speaking practice", description: "3 daqiqa ovozli xabar. O'zingiz haqingizda gapirib bering.", dueDate: "2025-01-30", createdAt: "2025-01-23T00:00:00Z", submittedCount: 3, totalStudents: 10 },
];

export default function AdminHomeworkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const hw = allHomework.find(h => h.id === id);

  if (!hw) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-[var(--muted-foreground)]">Vazifa topilmadi</p>
        <Button variant="outline" onClick={() => router.back()}><ArrowLeft className="h-4 w-4" />Orqaga</Button>
      </div>
    );
  }

  const isOverdue = new Date(hw.dueDate) < new Date();
  const pct = Math.round((hw.submittedCount / hw.totalStudents) * 100);

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-[var(--muted)] transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold truncate">{hw.title}</h1>
      </div>

      {/* Main info */}
      <Card>
        <CardContent className="pt-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#1E3A5F]/10 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-[#1E3A5F]" />
              </div>
              <div>
                <p className="font-semibold">{hw.title}</p>
                <p className="text-sm text-[var(--muted-foreground)]">{hw.groupName}</p>
              </div>
            </div>
            <Badge variant={isOverdue ? "destructive" : "success"}>
              {isOverdue ? "Muddati o'tgan" : "Aktiv"}
            </Badge>
          </div>

          <p className="text-sm leading-relaxed">{hw.description}</p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>Muddat: {formatDate(hw.dueDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
              <Users className="h-4 w-4 shrink-0" />
              <span>O'qituvchi: {hw.teacherName}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-2xl font-bold text-[#1E3A5F]">{hw.totalStudents}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Jami o'quvchi</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-2xl font-bold text-green-600">{hw.submittedCount}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Topshirdi</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-2xl font-bold text-amber-500">{hw.totalStudents - hw.submittedCount}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Topshirmadi</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Topshirish holati</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--muted-foreground)]">Bajarilish foizi</span>
            <span className="font-bold text-[#1E3A5F]">{pct}%</span>
          </div>
          <div className="w-full h-3 bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-400"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5 text-green-500" />{hw.submittedCount} topshirdi</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-amber-500" />{hw.totalStudents - hw.submittedCount} kutilmoqda</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
