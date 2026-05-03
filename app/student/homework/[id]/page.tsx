"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, FileText, CheckCircle, Clock, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

type HomeworkStatus = "PENDING" | "SUBMITTED" | "GRADED" | "LATE";

const allHomework = [
  { id: "1", title: "Present Simple mashqlari", group: "Ingliz tili A2", teacher: "Aziz Karimov", dueDate: "2025-01-28", description: "Darslikdan 1-50 mashqlarni bajaring va daftaringizga yozing. Har bir mashq uchun qoida ham yozing.", status: "PENDING" as HomeworkStatus, grade: undefined, maxGrade: 100 },
  { id: "2", title: "Reading comprehension", group: "Ingliz tili A2", teacher: "Aziz Karimov", dueDate: "2025-01-29", description: "Unit 5 matnini o'qib, savollarni javoblang. Matn kitobning 78-betida.", status: "SUBMITTED" as HomeworkStatus, grade: undefined, maxGrade: 100, submittedAnswer: "Matnni o'qidim va barcha savollarga javob yozdim..." },
  { id: "3", title: "Vocabulary list", group: "Ingliz tili A2", teacher: "Aziz Karimov", dueDate: "2025-01-22", description: "100 ta yangi so'zni yodlang va har biridan jumla tuzing.", status: "GRADED" as HomeworkStatus, grade: 92, maxGrade: 100, submittedAnswer: "So'zlarni yodladim va jumlalar tuzdum...", feedback: "Juda yaxshi ish! Bir nechta so'z noto'g'ri yozilgan." },
  { id: "4", title: "Speaking practice", group: "Speaking Club", teacher: "Aziz Karimov", dueDate: "2025-01-30", description: "O'zingiz haqingizda 2 daqiqalik nutq tayyorlang. Ism, yosh, sevimli mashg'ulot haqida gapirib bering.", status: "PENDING" as HomeworkStatus, grade: undefined, maxGrade: 100 },
  { id: "5", title: "Grammar test preparation", group: "Ingliz tili A2", teacher: "Aziz Karimov", dueDate: "2025-01-20", description: "Test uchun grammatika qoidalarini takrorlang.", status: "GRADED" as HomeworkStatus, grade: 78, maxGrade: 100, submittedAnswer: "Qoidalarni takrorladim...", feedback: "Yaxshi, lekin Present Perfect qoidasini yana o'rganing." },
];

const statusConfig: Record<HomeworkStatus, { label: string; variant: string }> = {
  PENDING:   { label: "Bajarilmagan", variant: "secondary" },
  SUBMITTED: { label: "Topshirildi",  variant: "info" },
  GRADED:    { label: "Baholandi",    variant: "success" },
  LATE:      { label: "Kech topshirildi", variant: "warning" },
};

export default function StudentHomeworkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const hw = allHomework.find(h => h.id === id);
  const [answer, setAnswer] = React.useState("");
  const [submitted, setSubmitted] = React.useState(hw?.status === "SUBMITTED" || hw?.status === "GRADED");

  if (!hw) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-[var(--muted-foreground)]">Vazifa topilmadi</p>
        <Button variant="outline" onClick={() => router.back()}><ArrowLeft className="h-4 w-4" />Orqaga</Button>
      </div>
    );
  }

  const cfg = statusConfig[hw.status];
  const isOverdue = new Date(hw.dueDate) < new Date();

  const handleSubmit = () => {
    if (!answer.trim()) { toast.error("Javobingizni yozing"); return; }
    setSubmitted(true);
    toast.success("Vazifa topshirildi!");
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-[var(--muted)] transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold truncate">{hw.title}</h1>
      </div>

      {/* Info card */}
      <Card>
        <CardContent className="pt-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#1E3A5F]/10 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-[#1E3A5F]" />
              </div>
              <div>
                <p className="font-semibold">{hw.title}</p>
                <p className="text-sm text-[var(--muted-foreground)]">{hw.group} • {hw.teacher}</p>
              </div>
            </div>
            <Badge variant={cfg.variant as any}>{cfg.label}</Badge>
          </div>

          <p className="text-sm text-[var(--foreground)] leading-relaxed">{hw.description}</p>

          <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Muddat: {formatDate(hw.dueDate)}
            </span>
            {isOverdue && hw.status === "PENDING" && (
              <span className="text-red-500 font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" />Muddati o'tgan
              </span>
            )}
          </div>

          {hw.status === "GRADED" && hw.grade !== undefined && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-700">Ball: {hw.grade}/{hw.maxGrade}</p>
                {hw.feedback && <p className="text-xs text-green-600 mt-0.5">{hw.feedback}</p>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission area */}
      {(hw.status === "SUBMITTED" || hw.status === "GRADED" || submitted) ? (
        <Card>
          <CardHeader><CardTitle className="text-sm">Topshirilgan javob</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--muted-foreground)] italic">
              {(hw as any).submittedAnswer || answer || "Javob topshirildi"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-sm">Javobingizni yozing</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Vazifani bajardim, bu yerga javobingizni yozing..."
              rows={5}
              className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmit}>
                <Send className="h-4 w-4" />Topshirish
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
