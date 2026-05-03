"use client";
import React from "react";
import { Plus, CheckSquare, Clock, AlertCircle, Circle, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ui/avatar";
import toast from "react-hot-toast";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
type Priority = "LOW" | "MEDIUM" | "HIGH";

interface Task { id: number; title: string; description: string; assignedTo: string; status: TaskStatus; priority: Priority; deadline: string; }

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  LOW:    { label: "Past",    color: "text-green-600 bg-green-100" },
  MEDIUM: { label: "O'rta",   color: "text-amber-600 bg-amber-100" },
  HIGH:   { label: "Yuqori",  color: "text-red-600 bg-red-100" },
};

const statusConfig: Record<TaskStatus, { label: string; icon: React.ReactNode }> = {
  TODO:        { label: "Bajarilishi kerak", icon: <Circle className="h-4 w-4 text-gray-400" /> },
  IN_PROGRESS: { label: "Jarayonda",         icon: <Clock className="h-4 w-4 text-amber-500" /> },
  DONE:        { label: "Bajarildi",          icon: <Check className="h-4 w-4 text-green-600" /> },
};

const initialTasks: Task[] = [
  { id: 1, title: "Yangi o'quvchilar ro'yxatini yangilash", description: "Yanvar oyi uchun ro'yxatni yangilash", assignedTo: "Sardor Toshmatov", status: "TODO", priority: "HIGH", deadline: "2025-01-30" },
  { id: 2, title: "Oylik hisobot tayyorlash", description: "Moliyaviy hisobot 2025-yanvar", assignedTo: "Malika Yusupova", status: "IN_PROGRESS", priority: "HIGH", deadline: "2025-02-01" },
  { id: 3, title: "Dars jadvalini tekshirish", description: "Fevral oyi jadvalini yangilash", assignedTo: "Jasur Karimov", status: "TODO", priority: "MEDIUM", deadline: "2025-02-05" },
  { id: 4, title: "O'qituvchilar yig'ilishi", description: "Haftalik yig'ilish tashkil qilish", assignedTo: "Sardor Toshmatov", status: "DONE", priority: "MEDIUM", deadline: "2025-01-27" },
  { id: 5, title: "SMS xabarnomalari yuborish", description: "To'lov eslatmalari", assignedTo: "Malika Yusupova", status: "DONE", priority: "LOW", deadline: "2025-01-25" },
];

const empty = { title: "", description: "", assignedTo: "", priority: "MEDIUM" as Priority, deadline: "" };
const staff = ["Sardor Toshmatov", "Malika Yusupova", "Jasur Karimov", "Admin"];

export default function TasksPage() {
  const [tasks, setTasks] = React.useState(initialTasks);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState(empty);
  const [filterStatus, setFilterStatus] = React.useState<"ALL" | TaskStatus>("ALL");

  const filtered = tasks.filter(t => filterStatus === "ALL" || t.status === filterStatus);
  const todoCount = tasks.filter(t => t.status === "TODO").length;
  const inProgressCount = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const doneCount = tasks.filter(t => t.status === "DONE").length;

  const handleSave = () => {
    if (!form.title || !form.assignedTo || !form.deadline) { toast.error("Sarlavha, mas'ul va muddatni kiriting"); return; }
    setTasks(prev => [...prev, { id: Date.now(), ...form, status: "TODO" }]);
    toast.success("Vazifa qo'shildi");
    setOpen(false);
    setForm(empty);
  };

  const moveStatus = (id: number, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const handleDelete = (id: number) => { setTasks(prev => prev.filter(t => t.id !== id)); toast.success("O'chirildi"); };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Vazifalar (Staff)</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{todoCount} ta yangi, {inProgressCount} ta jarayonda</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Vazifa berish</Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-gray-500">{todoCount}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Bajarilishi kerak</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-amber-500">{inProgressCount}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Jarayonda</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-green-600">{doneCount}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Bajarildi</p>
        </div>
      </div>

      <div className="flex gap-2">
        {([["ALL", "Barchasi"], ["TODO", "Yangi"], ["IN_PROGRESS", "Jarayonda"], ["DONE", "Bajarildi"]] as const).map(([s, l]) => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterStatus === s ? "bg-[#1E3A5F] text-white" : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(task => (
          <div key={task.id} className={`bg-[var(--card)] border rounded-xl p-4 ${task.status === "DONE" ? "opacity-60 border-[var(--border)]" : "border-[var(--border)]"}`}>
            <div className="flex items-start gap-3">
              <button onClick={() => moveStatus(task.id, task.status === "DONE" ? "TODO" : task.status === "TODO" ? "IN_PROGRESS" : "DONE")}
                className="mt-0.5 shrink-0">
                {statusConfig[task.status].icon}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`font-semibold text-sm ${task.status === "DONE" ? "line-through text-[var(--muted-foreground)]" : ""}`}>{task.title}</p>
                  <div className="flex gap-1.5 shrink-0">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${priorityConfig[task.priority].color}`}>{priorityConfig[task.priority].label}</span>
                    <button onClick={() => handleDelete(task.id)} className="p-0.5 hover:text-red-500 text-[var(--muted-foreground)]"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                {task.description && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{task.description}</p>}
                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-1"><UserAvatar name={task.assignedTo} size="xl" />{task.assignedTo}</div>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{task.deadline}</span>
                </div>
              </div>
            </div>
            {task.status !== "DONE" && (
              <div className="flex gap-2 mt-3 pl-7">
                {task.status === "TODO" && <button onClick={() => moveStatus(task.id, "IN_PROGRESS")} className="text-xs text-amber-600 hover:underline">Boshlash</button>}
                {task.status === "IN_PROGRESS" && <button onClick={() => moveStatus(task.id, "DONE")} className="text-xs text-green-600 hover:underline">Bajarildi deb belgilash</button>}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center text-[var(--muted-foreground)] py-12">Vazifalar yo'q</div>}
      </div>

      <Modal open={open} onOpenChange={setOpen} size="sm">
        <ModalHeader><ModalTitle>Yangi vazifa</ModalTitle></ModalHeader>
        <div className="p-6 space-y-3">
          <Input label="Sarlavha *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Vazifa sarlavhasi" />
          <Input label="Tavsif" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Qo'shimcha ma'lumot..." />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Mas'ul shaxs *</label>
              <select value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]">
                <option value="">Tanlang</option>
                {staff.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Muhimlik</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}
                className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]">
                <option value="LOW">Past</option>
                <option value="MEDIUM">O'rta</option>
                <option value="HIGH">Yuqori</option>
              </select>
            </div>
          </div>
          <Input label="Muddat *" type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Bekor</Button>
          <Button onClick={handleSave}>Saqlash</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
