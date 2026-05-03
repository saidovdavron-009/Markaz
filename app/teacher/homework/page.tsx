"use client";
import React from "react";
import { Plus, FileText, Calendar, Users, CheckCircle, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface Homework {
  id: string;
  title: string;
  groupId: string;
  groupName: string;
  dueDate: string;
  description: string;
  submittedCount: number;
  totalStudents: number;
  status: "ACTIVE" | "EXPIRED";
}

const initialHomework: Homework[] = [
  { id: "1", title: "Present Simple mashqlari", groupId: "1", groupName: "Ingliz tili A2", dueDate: "2025-01-28", description: "1-50 mashqlarni bajaring", submittedCount: 7, totalStudents: 10, status: "ACTIVE" },
  { id: "2", title: "Reading comprehension", groupId: "2", groupName: "Ingliz tili B1", dueDate: "2025-01-29", description: "Unit 5 matnini o'qib savollarni javoblang", submittedCount: 5, totalStudents: 8, status: "ACTIVE" },
  { id: "3", title: "Vocabulary list", groupId: "1", groupName: "Ingliz tili A2", dueDate: "2025-01-22", description: "100 ta yangi so'zni yodlang", submittedCount: 9, totalStudents: 10, status: "EXPIRED" },
  { id: "4", title: "Speaking practice", groupId: "3", groupName: "Speaking Club", dueDate: "2025-01-30", description: "2 daqiqalik nutq tayyorlang", submittedCount: 2, totalStudents: 6, status: "ACTIVE" },
];

export default function TeacherHomeworkPage() {
  const router = useRouter();
  const [homeworks, setHomeworks] = React.useState(initialHomework);
  const [filter, setFilter] = React.useState("ALL");
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    title: "",
    groupId: "1",
    dueDate: "",
    description: "",
  });

  const filtered = homeworks.filter(h => filter === "ALL" || h.status === filter);
  const activeCount = homeworks.filter(h => h.status === "ACTIVE").length;

  const handleCreate = () => {
    if (!form.title || !form.dueDate) {
      toast.error("Sarlavha va muddatni kiriting");
      return;
    }
    const groupNames: Record<string, string> = { "1": "Ingliz tili A2", "2": "Ingliz tili B1", "3": "Speaking Club" };
    setHomeworks(prev => [{
      id: String(Date.now()),
      title: form.title,
      groupId: form.groupId,
      groupName: groupNames[form.groupId],
      dueDate: form.dueDate,
      description: form.description,
      submittedCount: 0,
      totalStudents: 10,
      status: "ACTIVE",
    }, ...prev]);
    setOpen(false);
    toast.success("Uyga vazifa qo'shildi");
    setForm({ title: "", groupId: "1", dueDate: "", description: "" });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Uyga vazifalar</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{activeCount} ta faol vazifa</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Vazifa berish</Button>
      </div>

      <div className="flex gap-2">
        {["ALL", "ACTIVE", "EXPIRED"].map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? "bg-[#1E3A5F] text-white" : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"}`}>
            {f === "ALL" ? "Barchasi" : f === "ACTIVE" ? "Faol" : "Muddati o'tgan"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(hw => {
          const pct = Math.round((hw.submittedCount / hw.totalStudents) * 100);
          return (
            <Card key={hw.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/teacher/homework/${hw.id}`)}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-[#1E3A5F]/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4 text-[#1E3A5F]" />
                    </div>
                    <div>
                      <CardTitle className="text-sm leading-tight">{hw.title}</CardTitle>
                      <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{hw.groupName}</p>
                    </div>
                  </div>
                  <Badge variant={hw.status === "ACTIVE" ? "success" : "secondary"}>
                    {hw.status === "ACTIVE" ? "Faol" : "Tugagan"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {hw.description && <p className="text-sm text-[var(--muted-foreground)]">{hw.description}</p>}
                <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Muddat: {formatDate(hw.dueDate)}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--muted-foreground)] flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Topshirganlar
                    </span>
                    <span className="font-medium">{hw.submittedCount}/{hw.totalStudents}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-400"}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center text-[var(--muted-foreground)] py-12">
            Vazifalar yo'q
          </div>
        )}
      </div>

      <Modal open={open} onOpenChange={setOpen} size="md">
        <ModalHeader><ModalTitle>Yangi uyga vazifa</ModalTitle></ModalHeader>
        <div className="space-y-4 p-6">
          <Input label="Sarlavha" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Vazifa nomi" />
          <div>
            <label className="text-sm font-medium mb-1.5 block">Guruh</label>
            <Select value={form.groupId} onValueChange={v => setForm(f => ({ ...f, groupId: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Ingliz tili A2</SelectItem>
                <SelectItem value="2">Ingliz tili B1</SelectItem>
                <SelectItem value="3">Speaking Club</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input label="Muddat (sana)" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
          <Textarea label="Tavsif" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Vazifa haqida batafsil..." rows={3} />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Bekor</Button>
          <Button onClick={handleCreate}>Saqlash</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
