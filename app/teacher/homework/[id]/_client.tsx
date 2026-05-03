"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface Student {
  id: string;
  name: string;
  status: "SUBMITTED" | "PENDING" | "GRADED";
  grade?: number;
  submittedAt?: string;
}

const allHomework = [
  {
    id: "1", title: "Present Simple mashqlari", groupName: "Ingliz tili A2",
    dueDate: "2025-01-28", description: "1-50 mashqlarni bajaring",
    submittedCount: 7, totalStudents: 10, status: "ACTIVE",
    students: [
      { id: "s1", name: "Alibek Karimov", status: "SUBMITTED", submittedAt: "2025-01-27" },
      { id: "s2", name: "Zulfiya Rahimova", status: "GRADED", grade: 90, submittedAt: "2025-01-26" },
      { id: "s3", name: "Jasur Toshmatov", status: "SUBMITTED", submittedAt: "2025-01-27" },
      { id: "s4", name: "Malika Yusupova", status: "PENDING" },
      { id: "s5", name: "Bobur Nazarov", status: "GRADED", grade: 85, submittedAt: "2025-01-25" },
      { id: "s6", name: "Nilufar Hasanova", status: "SUBMITTED", submittedAt: "2025-01-28" },
      { id: "s7", name: "Sardor Alimov", status: "PENDING" },
      { id: "s8", name: "Dildora Mirzayeva", status: "SUBMITTED", submittedAt: "2025-01-27" },
      { id: "s9", name: "Firdavs Ergashev", status: "GRADED", grade: 95, submittedAt: "2025-01-26" },
      { id: "s10", name: "Kamola Sobirov", status: "PENDING" },
    ] as Student[],
  },
  {
    id: "2", title: "Reading comprehension", groupName: "Ingliz tili B1",
    dueDate: "2025-01-29", description: "Unit 5 matnini o'qib savollarni javoblang",
    submittedCount: 5, totalStudents: 8, status: "ACTIVE",
    students: [
      { id: "s1", name: "Sherzod Qodirov", status: "SUBMITTED", submittedAt: "2025-01-28" },
      { id: "s2", name: "Nozima Tursunova", status: "GRADED", grade: 88, submittedAt: "2025-01-27" },
      { id: "s3", name: "Ulugbek Mirzaev", status: "PENDING" },
      { id: "s4", name: "Feruza Xolmatova", status: "SUBMITTED", submittedAt: "2025-01-28" },
      { id: "s5", name: "Akbar Razzaqov", status: "PENDING" },
      { id: "s6", name: "Dilorom Yusupova", status: "SUBMITTED", submittedAt: "2025-01-27" },
      { id: "s7", name: "Muzaffar Holiqov", status: "GRADED", grade: 76, submittedAt: "2025-01-26" },
      { id: "s8", name: "Shahlo Nazarova", status: "SUBMITTED", submittedAt: "2025-01-29" },
    ] as Student[],
  },
  {
    id: "3", title: "Vocabulary list", groupName: "Ingliz tili A2",
    dueDate: "2025-01-22", description: "100 ta yangi so'zni yodlang",
    submittedCount: 9, totalStudents: 10, status: "EXPIRED",
    students: [
      { id: "s1", name: "Alibek Karimov", status: "GRADED", grade: 92, submittedAt: "2025-01-21" },
      { id: "s2", name: "Zulfiya Rahimova", status: "GRADED", grade: 87, submittedAt: "2025-01-20" },
      { id: "s3", name: "Jasur Toshmatov", status: "GRADED", grade: 79, submittedAt: "2025-01-22" },
      { id: "s4", name: "Malika Yusupova", status: "PENDING" },
      { id: "s5", name: "Bobur Nazarov", status: "GRADED", grade: 95, submittedAt: "2025-01-19" },
      { id: "s6", name: "Nilufar Hasanova", status: "GRADED", grade: 83, submittedAt: "2025-01-21" },
      { id: "s7", name: "Sardor Alimov", status: "GRADED", grade: 70, submittedAt: "2025-01-22" },
      { id: "s8", name: "Dildora Mirzayeva", status: "GRADED", grade: 88, submittedAt: "2025-01-20" },
      { id: "s9", name: "Firdavs Ergashev", status: "GRADED", grade: 100, submittedAt: "2025-01-18" },
      { id: "s10", name: "Kamola Sobirov", status: "GRADED", grade: 66, submittedAt: "2025-01-22" },
    ] as Student[],
  },
  {
    id: "4", title: "Speaking practice", groupName: "Speaking Club",
    dueDate: "2025-01-30", description: "2 daqiqalik nutq tayyorlang",
    submittedCount: 2, totalStudents: 6, status: "ACTIVE",
    students: [
      { id: "s1", name: "Hamza Nazarov", status: "SUBMITTED", submittedAt: "2025-01-29" },
      { id: "s2", name: "Lobar Toshpulatova", status: "PENDING" },
      { id: "s3", name: "Anvar Qosimov", status: "PENDING" },
      { id: "s4", name: "Mohira Abdullayeva", status: "SUBMITTED", submittedAt: "2025-01-28" },
      { id: "s5", name: "Ravshan Yo'ldoshev", status: "PENDING" },
      { id: "s6", name: "Barno Salimova", status: "PENDING" },
    ] as Student[],
  },
];

export default function TeacherHomeworkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const hw = allHomework.find(h => h.id === id);
  const [grades, setGrades] = React.useState<Record<string, string>>({});
  const [students, setStudents] = React.useState(hw?.students || []);

  if (!hw) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-[var(--muted-foreground)]">Vazifa topilmadi</p>
        <Button variant="outline" onClick={() => router.back()}><ArrowLeft className="h-4 w-4" />Orqaga</Button>
      </div>
    );
  }

  const pct = Math.round((hw.submittedCount / hw.totalStudents) * 100);
  const submittedStudents = students.filter(s => s.status === "SUBMITTED" || s.status === "GRADED");
  const pendingStudents = students.filter(s => s.status === "PENDING");

  const handleGrade = (studentId: string) => {
    const val = parseInt(grades[studentId] || "");
    if (isNaN(val) || val < 0 || val > 100) { toast.error("0–100 oraliqda ball kiriting"); return; }
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: "GRADED" as const, grade: val } : s));
    setGrades(prev => { const n = { ...prev }; delete n[studentId]; return n; });
    toast.success("Ball qo'yildi");
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-[var(--muted)] transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold truncate">{hw.title}</h1>
      </div>

      <Card>
        <CardContent className="pt-5 space-y-3">
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
            <Badge variant={hw.status === "ACTIVE" ? "success" : "secondary"}>
              {hw.status === "ACTIVE" ? "Faol" : "Tugagan"}
            </Badge>
          </div>
          <p className="text-sm text-[var(--foreground)]">{hw.description}</p>
          <div className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
            <Calendar className="h-4 w-4" />
            Muddat: {formatDate(hw.dueDate)}
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--muted-foreground)]">Topshirganlar</span>
              <span className="font-medium">{submittedStudents.length}/{hw.totalStudents}</span>
            </div>
            <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-400"}`}
                style={{ width: `${pct}%` }} />
            </div>
          </div>
        </CardContent>
      </Card>

      {submittedStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Topshirganlar ({submittedStudents.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {submittedStudents.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--muted)]/40 border border-[var(--border)]">
                <UserAvatar name={s.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  {s.submittedAt && <p className="text-xs text-[var(--muted-foreground)]">{formatDate(s.submittedAt)}</p>}
                </div>
                {s.status === "GRADED" ? (
                  <span className="text-sm font-bold text-green-600 shrink-0">{s.grade}/100</span>
                ) : (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      min={0} max={100}
                      placeholder="Ball"
                      value={grades[s.id] || ""}
                      onChange={e => setGrades(prev => ({ ...prev, [s.id]: e.target.value }))}
                      className="w-16 h-7 px-2 text-xs text-center border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                    />
                    <button
                      onClick={() => handleGrade(s.id)}
                      className="h-7 px-2.5 text-xs rounded-lg bg-[#1E3A5F] text-white hover:bg-[#162d4a] transition-colors"
                    >
                      Qo'y
                    </button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {pendingStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              Topshirmaganlar ({pendingStudents.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingStudents.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-200">
                <UserAvatar name={s.name} size="sm" />
                <p className="text-sm font-medium flex-1 truncate">{s.name}</p>
                <XCircle className="h-4 w-4 text-amber-400 shrink-0" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
