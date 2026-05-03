"use client";
import React from "react";
import { FileText, Calendar, CheckCircle, Clock, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

type HomeworkStatus = "PENDING" | "SUBMITTED" | "GRADED" | "LATE";

interface Homework {
  id: string;
  title: string;
  group: string;
  teacher: string;
  dueDate: string;
  description: string;
  status: HomeworkStatus;
  grade?: number;
  maxGrade?: number;
}

const initialHomework: Homework[] = [
  { id: "1", title: "Present Simple mashqlari", group: "Ingliz tili A2", teacher: "Aziz Karimov", dueDate: "2025-01-28", description: "Darslikdan 1-50 mashqlarni bajaring va daftaringizga yozing.", status: "PENDING" },
  { id: "2", title: "Reading comprehension", group: "Ingliz tili A2", teacher: "Aziz Karimov", dueDate: "2025-01-29", description: "Unit 5 matnini o'qib, savollarni javoblang.", status: "SUBMITTED" },
  { id: "3", title: "Vocabulary list", group: "Ingliz tili A2", teacher: "Aziz Karimov", dueDate: "2025-01-22", description: "100 ta yangi so'zni yodlang va jumlalar tuzing.", status: "GRADED", grade: 92, maxGrade: 100 },
  { id: "4", title: "Speaking practice", group: "Speaking Club", teacher: "Aziz Karimov", dueDate: "2025-01-30", description: "O'zingiz haqingizda 2 daqiqalik nutq tayyorlang.", status: "PENDING" },
  { id: "5", title: "Grammar test preparation", group: "Ingliz tili A2", teacher: "Aziz Karimov", dueDate: "2025-01-20", description: "Test uchun grammatika qoidalarini takrorlang.", status: "GRADED", grade: 78, maxGrade: 100 },
];

const statusConfig: Record<HomeworkStatus, { label: string; variant: string; color: string }> = {
  PENDING:   { label: "Bajarilmagan", variant: "secondary",    color: "text-[var(--muted-foreground)]" },
  SUBMITTED: { label: "Topshirildi",  variant: "info",         color: "text-blue-600" },
  GRADED:    { label: "Baholandi",    variant: "success",      color: "text-green-600" },
  LATE:      { label: "Kech topshirildi", variant: "warning",  color: "text-amber-600" },
};

export default function StudentHomeworkPage() {
  const router = useRouter();
  const [homeworks, setHomeworks] = React.useState(initialHomework);
  const [filter, setFilter] = React.useState<"ALL" | HomeworkStatus>("ALL");

  const filtered = homeworks.filter(h => filter === "ALL" || h.status === filter);

  const pendingCount = homeworks.filter(h => h.status === "PENDING").length;
  const submittedCount = homeworks.filter(h => h.status === "SUBMITTED").length;
  const gradedCount = homeworks.filter(h => h.status === "GRADED").length;

  const handleSubmit = (id: string) => {
    setHomeworks(prev => prev.map(h => h.id === id ? { ...h, status: "SUBMITTED" as HomeworkStatus } : h));
    toast.success("Vazifa topshirildi");
  };

  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 2 && diff >= 0;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Uyga vazifalar</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">{pendingCount} ta bajarilmagan vazifa</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-[var(--muted-foreground)]">Bajarilmagan</p>
            <p className="text-2xl font-bold mt-1 text-amber-500">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-[var(--muted-foreground)]">Topshirilgan</p>
            <p className="text-2xl font-bold mt-1 text-blue-600">{submittedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-[var(--muted-foreground)]">Baholangan</p>
            <p className="text-2xl font-bold mt-1 text-green-600">{gradedCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["ALL", "PENDING", "SUBMITTED", "GRADED"] as const).map(s => (
          <button key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === s ? "bg-[#1E3A5F] text-white" : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"}`}>
            {s === "ALL" ? "Barchasi" : statusConfig[s].label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(hw => {
          const cfg = statusConfig[hw.status];
          const soon = isDueSoon(hw.dueDate) && hw.status === "PENDING";
          return (
            <Card key={hw.id} className={`cursor-pointer hover:shadow-md transition-shadow ${soon ? "border-amber-300 bg-amber-50/50" : ""}`} onClick={() => router.push(`/student/homework/${hw.id}`)}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${hw.status === "GRADED" ? "bg-green-100" : hw.status === "SUBMITTED" ? "bg-blue-100" : "bg-[#1E3A5F]/10"}`}>
                      {hw.status === "GRADED" ? <CheckCircle className="h-4 w-4 text-green-600" /> : <FileText className="h-4 w-4 text-[#1E3A5F]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">{hw.title}</p>
                        {soon && <Badge variant="warning">Tez orada!</Badge>}
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{hw.group} • {hw.teacher}</p>
                      <p className="text-sm text-[var(--muted-foreground)] mt-1.5">{hw.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[var(--muted-foreground)]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Muddat: {formatDate(hw.dueDate)}
                        </span>
                        {hw.grade !== undefined && (
                          <span className="font-medium text-green-600">{hw.grade}/{hw.maxGrade} ball</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={cfg.variant as any}>{cfg.label}</Badge>
                    {hw.status === "PENDING" && (
                      <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); handleSubmit(hw.id); }} className="text-xs h-7">
                        Topshirish
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center text-[var(--muted-foreground)] py-12">Vazifalar yo'q</div>
        )}
      </div>
    </div>
  );
}
