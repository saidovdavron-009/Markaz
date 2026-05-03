"use client";
import React from "react";
import { Plus, CalendarOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface Holiday { id: number; name: string; startDate: string; endDate: string; daysCount: number; }

const calcDays = (start: string, end: string) => {
  const d = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24) + 1;
  return Math.max(1, d);
};

const initialHolidays: Holiday[] = [
  { id: 1, name: "Yangi yil ta'tili", startDate: "2025-01-01", endDate: "2025-01-03", daysCount: 3 },
  { id: 2, name: "Navruz bayrami", startDate: "2025-03-20", endDate: "2025-03-23", daysCount: 4 },
  { id: 3, name: "Mustaqillik kuni", startDate: "2025-09-01", endDate: "2025-09-01", daysCount: 1 },
  { id: 4, name: "O'qituvchilar kuni", startDate: "2025-10-01", endDate: "2025-10-01", daysCount: 1 },
  { id: 5, name: "Qish ta'tili", startDate: "2025-12-25", endDate: "2026-01-03", daysCount: 10 },
];

const empty = { name: "", startDate: "", endDate: "" };

export default function HolidaysPage() {
  const [holidays, setHolidays] = React.useState(initialHolidays);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState(empty);

  const upcoming = holidays.filter(h => new Date(h.startDate) >= new Date()).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const past = holidays.filter(h => new Date(h.endDate) < new Date()).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const handleSave = () => {
    if (!form.name || !form.startDate || !form.endDate) { toast.error("Barcha maydonlarni to'ldiring"); return; }
    if (new Date(form.endDate) < new Date(form.startDate)) { toast.error("Tugash sanasi boshlanishdan oldin bo'lmasin"); return; }
    setHolidays(prev => [...prev, { id: Date.now(), ...form, daysCount: calcDays(form.startDate, form.endDate) }]);
    toast.success("Ta'til qo'shildi");
    setOpen(false);
    setForm(empty);
  };

  const handleDelete = (id: number) => { setHolidays(prev => prev.filter(h => h.id !== id)); toast.success("O'chirildi"); };

  const HolidayCard = ({ h }: { h: Holiday }) => {
    const isToday = new Date(h.startDate) <= new Date() && new Date(h.endDate) >= new Date();
    return (
      <div className={`bg-[var(--card)] border rounded-xl p-4 flex items-center gap-4 ${isToday ? "border-[#1E3A5F] bg-[#1E3A5F]/5" : "border-[var(--border)]"}`}>
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${isToday ? "bg-[#1E3A5F]" : "bg-[var(--muted)]"}`}>
          <CalendarOff className={`h-5 w-5 ${isToday ? "text-white" : "text-[var(--muted-foreground)]"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{h.name}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{h.startDate} — {h.endDate} • {h.daysCount} kun</p>
          {isToday && <p className="text-xs text-[#1E3A5F] font-medium mt-0.5">Hozir davom etmoqda</p>}
        </div>
        <button onClick={() => handleDelete(h.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Ta'tillar</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{upcoming.length} ta kelgusi ta'til</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Ta'til qo'shish</Button>
      </div>

      {upcoming.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">Kelgusi ta'tillar</h2>
          {upcoming.map(h => <HolidayCard key={h.id} h={h} />)}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">O'tgan ta'tillar</h2>
          {past.map(h => <HolidayCard key={h.id} h={h} />)}
        </div>
      )}

      <Modal open={open} onOpenChange={setOpen} size="sm">
        <ModalHeader><ModalTitle>Yangi ta'til</ModalTitle></ModalHeader>
        <div className="p-6 space-y-3">
          <Input label="Ta'til nomi *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Yangi yil ta'tili" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Boshlanish *" type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            <Input label="Tugash *" type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
          </div>
          {form.startDate && form.endDate && new Date(form.endDate) >= new Date(form.startDate) && (
            <p className="text-sm text-[var(--muted-foreground)]">Davomiyligi: {calcDays(form.startDate, form.endDate)} kun</p>
          )}
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Bekor</Button>
          <Button onClick={handleSave}>Saqlash</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
