"use client";
import React from "react";
import { Plus, ClipboardList, Clock, Users, BarChart2, Eye, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Quiz { id: number; title: string; groupName: string; timeLimitMins: number; questionsCount: number; avgScore: number; participantsCount: number; status: "ACTIVE" | "DRAFT" | "FINISHED"; }

const initialQuizzes: Quiz[] = [
  { id: 1, title: "Present Simple test", groupName: "Ingliz tili A2", timeLimitMins: 30, questionsCount: 20, avgScore: 78, participantsCount: 9, status: "FINISHED" },
  { id: 2, title: "Algebra yakuniy test", groupName: "Matematika B1", timeLimitMins: 45, questionsCount: 25, avgScore: 82, participantsCount: 11, status: "FINISHED" },
  { id: 3, title: "Vocabulary quiz", groupName: "Ingliz tili A2", timeLimitMins: 20, questionsCount: 15, avgScore: 0, participantsCount: 0, status: "ACTIVE" },
  { id: 4, title: "Python asoslari", groupName: "Dasturlash", timeLimitMins: 60, questionsCount: 30, avgScore: 0, participantsCount: 0, status: "DRAFT" },
];

const statusConfig = {
  ACTIVE:   { label: "Faol",    variant: "success" as const },
  DRAFT:    { label: "Qoralama",variant: "secondary" as const },
  FINISHED: { label: "Tugagan", variant: "info" as const },
};

const empty = { title: "", groupName: "Ingliz tili A2", timeLimitMins: "30" };
const groups = ["Ingliz tili A2", "Ingliz tili B1", "Matematika B1", "Dasturlash", "Speaking Club"];

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = React.useState(initialQuizzes);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState(empty);
  const [filter, setFilter] = React.useState<"ALL" | "ACTIVE" | "DRAFT" | "FINISHED">("ALL");

  const filtered = quizzes.filter(q => filter === "ALL" || q.status === filter);

  const handleSave = () => {
    if (!form.title) { toast.error("Test nomini kiriting"); return; }
    setQuizzes(prev => [...prev, { id: Date.now(), title: form.title, groupName: form.groupName, timeLimitMins: Number(form.timeLimitMins), questionsCount: 0, avgScore: 0, participantsCount: 0, status: "DRAFT" }]);
    toast.success("Test yaratildi");
    setOpen(false);
    setForm(empty);
  };

  const handleDelete = (id: number) => { setQuizzes(prev => prev.filter(q => q.id !== id)); toast.success("O'chirildi"); };

  const handleActivate = (id: number) => {
    setQuizzes(prev => prev.map(q => q.id === id ? { ...q, status: "ACTIVE" } : q));
    toast.success("Test faollashtirildi");
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Testlar</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{quizzes.filter(q => q.status === "ACTIVE").length} ta faol test</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Test yaratish</Button>
      </div>

      <div className="flex gap-2">
        {(["ALL", "ACTIVE", "DRAFT", "FINISHED"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? "bg-[#1E3A5F] text-white" : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"}`}>
            {f === "ALL" ? "Barchasi" : statusConfig[f].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(q => (
          <Card key={q.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#1E3A5F]/10 flex items-center justify-center shrink-0">
                    <ClipboardList className="h-4 w-4 text-[#1E3A5F]" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{q.title}</CardTitle>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{q.groupName}</p>
                  </div>
                </div>
                <Badge variant={statusConfig[q.status].variant}>{statusConfig[q.status].label}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[var(--muted)]/50 rounded-lg p-2">
                  <p className="text-sm font-bold text-[#1E3A5F]">{q.questionsCount}</p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">Savol</p>
                </div>
                <div className="bg-[var(--muted)]/50 rounded-lg p-2">
                  <p className="text-sm font-bold text-[#1E3A5F]">{q.timeLimitMins} min</p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">Vaqt</p>
                </div>
                <div className="bg-[var(--muted)]/50 rounded-lg p-2">
                  <p className="text-sm font-bold text-[#1E3A5F]">{q.avgScore > 0 ? `${q.avgScore}%` : "—"}</p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">O'rtacha</p>
                </div>
              </div>
              <div className="flex gap-2">
                {q.status === "DRAFT" && (
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={() => handleActivate(q.id)}>Faollashtirish</Button>
                )}
                <button onClick={() => handleDelete(q.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 ml-auto">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <div className="col-span-2 text-center text-[var(--muted-foreground)] py-12">Testlar yo'q</div>}
      </div>

      <Modal open={open} onOpenChange={setOpen} size="sm">
        <ModalHeader><ModalTitle>Yangi test</ModalTitle></ModalHeader>
        <div className="p-6 space-y-3">
          <Input label="Test nomi *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Test nomi" />
          <div>
            <label className="text-sm font-medium mb-1.5 block">Guruh</label>
            <select value={form.groupName} onChange={e => setForm(f => ({ ...f, groupName: e.target.value }))}
              className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]">
              {groups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <Input label="Vaqt chegarasi (daqiqa)" type="number" value={form.timeLimitMins} onChange={e => setForm(f => ({ ...f, timeLimitMins: e.target.value }))} placeholder="30" />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Bekor</Button>
          <Button onClick={handleSave}>Yaratish</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
