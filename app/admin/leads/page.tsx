"use client";
import React from "react";
import { Plus, Phone, MessageSquare, UserCheck, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

type LeadStatus = "NEW" | "CONTACTED" | "TRIAL_LESSON" | "REGISTERED" | "CLOSED";

interface Lead {
  id: number; fullName: string; phone: string; source: string;
  status: LeadStatus; subject: string; assignedTo: string; createdAt: string; notes?: string;
}

const statusConfig: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  NEW:          { label: "Yangi",           color: "text-blue-700",  bg: "bg-blue-100" },
  CONTACTED:    { label: "Bog'lanildi",     color: "text-amber-700", bg: "bg-amber-100" },
  TRIAL_LESSON: { label: "Sinov darsi",     color: "text-purple-700",bg: "bg-purple-100" },
  REGISTERED:   { label: "Ro'yxatdan o'tdi",color: "text-green-700", bg: "bg-green-100" },
  CLOSED:       { label: "Yopildi",         color: "text-gray-600",  bg: "bg-gray-100" },
};

const statuses: LeadStatus[] = ["NEW", "CONTACTED", "TRIAL_LESSON", "REGISTERED", "CLOSED"];
const sources = ["Instagram", "Telegram", "Google", "Referral", "Boshqa"];

const initialLeads: Lead[] = [
  { id: 1, fullName: "Kamola Nazarova", phone: "+998 90 111 22 33", source: "Instagram", status: "NEW", subject: "Ingliz tili", assignedTo: "Admin", createdAt: "2025-01-28" },
  { id: 2, fullName: "Sherzod Qodirov", phone: "+998 91 222 33 44", source: "Telegram", status: "CONTACTED", subject: "Matematika", assignedTo: "Admin", createdAt: "2025-01-27", notes: "Ertaga qayta qo'ng'iroq" },
  { id: 3, fullName: "Nodira Alimova", phone: "+998 93 333 44 55", source: "Referral", status: "TRIAL_LESSON", subject: "Ingliz tili", assignedTo: "Admin", createdAt: "2025-01-26" },
  { id: 4, fullName: "Behruz Toshmatov", phone: "+998 94 444 55 66", source: "Google", status: "REGISTERED", subject: "Dasturlash", assignedTo: "Admin", createdAt: "2025-01-25" },
  { id: 5, fullName: "Dilnoza Yusupova", phone: "+998 95 555 66 77", source: "Instagram", status: "CLOSED", subject: "Rus tili", assignedTo: "Admin", createdAt: "2025-01-24", notes: "Narxdan norozi" },
  { id: 6, fullName: "Akbar Razzaqov", phone: "+998 97 666 77 88", source: "Telegram", status: "NEW", subject: "Matematika", assignedTo: "Admin", createdAt: "2025-01-28" },
];

const empty = { fullName: "", phone: "", source: "Instagram", subject: "Ingliz tili", notes: "" };

export default function LeadsPage() {
  const [leads, setLeads] = React.useState(initialLeads);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState(empty);
  const [filterStatus, setFilterStatus] = React.useState<"ALL" | LeadStatus>("ALL");
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);

  const filtered = leads.filter(l => filterStatus === "ALL" || l.status === filterStatus);

  const handleSave = () => {
    if (!form.fullName || !form.phone) { toast.error("Ism va telefon raqamni kiriting"); return; }
    setLeads(prev => [...prev, { id: Date.now(), ...form, status: "NEW", assignedTo: "Admin", createdAt: new Date().toISOString().split("T")[0] }]);
    toast.success("Lead qo'shildi");
    setOpen(false);
    setForm(empty);
  };

  const moveStatus = (id: number, dir: 1 | -1) => {
    setLeads(prev => prev.map(l => {
      if (l.id !== id) return l;
      const idx = statuses.indexOf(l.status);
      const next = statuses[idx + dir];
      return next ? { ...l, status: next } : l;
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">CRM — Lidlar</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{leads.filter(l => l.status === "NEW").length} ta yangi lid</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Lid qo'shish</Button>
      </div>

      {/* Funnel stats */}
      <div className="grid grid-cols-5 gap-2">
        {statuses.map(s => {
          const cfg = statusConfig[s];
          const count = leads.filter(l => l.status === s).length;
          return (
            <button key={s} onClick={() => setFilterStatus(filterStatus === s ? "ALL" : s)}
              className={`p-3 rounded-xl border text-center transition-all ${filterStatus === s ? "border-[#1E3A5F] bg-[#1E3A5F]/5" : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)]/50"}`}>
              <p className={`text-xl font-bold ${cfg.color}`}>{count}</p>
              <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5 leading-tight">{cfg.label}</p>
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        {filtered.map(lead => {
          const cfg = statusConfig[lead.status];
          const statusIdx = statuses.indexOf(lead.status);
          return (
            <div key={lead.id} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm">{lead.fullName}</p>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-[10px] text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded-full">{lead.source}</span>
                </div>
                <div className="flex gap-3 mt-1 text-xs text-[var(--muted-foreground)]">
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>
                  <span>{lead.subject}</span>
                  <span>{lead.createdAt}</span>
                </div>
                {lead.notes && <p className="text-xs text-[var(--muted-foreground)] mt-1 italic">{lead.notes}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                {statusIdx > 0 && (
                  <button onClick={() => moveStatus(lead.id, -1)} className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)] rotate-180">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
                {statusIdx < statuses.length - 1 && (
                  <button onClick={() => moveStatus(lead.id, 1)} className="p-1.5 rounded-lg hover:bg-[#1E3A5F]/10 text-[#1E3A5F]">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="text-center text-[var(--muted-foreground)] py-12">Lidlar yo'q</div>}
      </div>

      <Modal open={open} onOpenChange={setOpen} size="sm">
        <ModalHeader><ModalTitle>Yangi lid</ModalTitle></ModalHeader>
        <div className="p-6 space-y-3">
          <Input label="To'liq ism *" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Ism Familiya" />
          <Input label="Telefon *" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+998 90 ..." />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Manba</label>
              <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]">
                {sources.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Fan</label>
              <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Ingliz tili" />
            </div>
          </div>
          <Input label="Izoh" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Qo'shimcha ma'lumot..." />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Bekor</Button>
          <Button onClick={handleSave}>Saqlash</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
