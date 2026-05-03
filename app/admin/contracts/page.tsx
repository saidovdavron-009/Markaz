"use client";
import React from "react";
import { Plus, FileText, Download, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ui/avatar";
import toast from "react-hot-toast";

type ContractStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";

interface Contract { id: number; contractNumber: string; studentName: string; groupName: string; signedAt: string; expiresAt: string; status: ContractStatus; }

const statusConfig: Record<ContractStatus, { label: string; variant: "success" | "secondary" | "destructive" }> = {
  ACTIVE:    { label: "Faol",          variant: "success" },
  EXPIRED:   { label: "Muddati tugadi",variant: "secondary" },
  CANCELLED: { label: "Bekor qilindi", variant: "destructive" },
};

const initialContracts: Contract[] = [
  { id: 1, contractNumber: "CTR-2025-001", studentName: "Alibek Karimov", groupName: "Ingliz tili A2", signedAt: "2025-01-01", expiresAt: "2025-06-30", status: "ACTIVE" },
  { id: 2, contractNumber: "CTR-2025-002", studentName: "Zulfiya Rahimova", groupName: "Matematika B1", signedAt: "2025-01-05", expiresAt: "2025-06-30", status: "ACTIVE" },
  { id: 3, contractNumber: "CTR-2024-098", studentName: "Jasur Toshmatov", groupName: "Dasturlash", signedAt: "2024-07-01", expiresAt: "2024-12-31", status: "EXPIRED" },
  { id: 4, contractNumber: "CTR-2024-056", studentName: "Malika Yusupova", groupName: "Ingliz tili B1", signedAt: "2024-06-01", expiresAt: "2024-11-30", status: "CANCELLED" },
  { id: 5, contractNumber: "CTR-2025-003", studentName: "Bobur Nazarov", groupName: "Fizika A1", signedAt: "2025-01-10", expiresAt: "2025-07-10", status: "ACTIVE" },
];

const empty = { studentName: "", groupName: "", expiresAt: "" };

export default function ContractsPage() {
  const [contracts, setContracts] = React.useState(initialContracts);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState(empty);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<"ALL" | ContractStatus>("ALL");

  const filtered = contracts.filter(c => {
    const matchFilter = filter === "ALL" || c.status === filter;
    const matchSearch = !search || c.studentName.toLowerCase().includes(search.toLowerCase()) || c.contractNumber.includes(search);
    return matchFilter && matchSearch;
  });

  const handleSave = () => {
    if (!form.studentName || !form.expiresAt) { toast.error("O'quvchi va muddatni kiriting"); return; }
    const num = `CTR-2025-${String(contracts.length + 1).padStart(3, "0")}`;
    setContracts(prev => [...prev, { id: Date.now(), contractNumber: num, studentName: form.studentName, groupName: form.groupName || "—", signedAt: new Date().toISOString().split("T")[0], expiresAt: form.expiresAt, status: "ACTIVE" }]);
    toast.success("Shartnoma qo'shildi");
    setOpen(false);
    setForm(empty);
  };

  const handleCancel = (id: number) => {
    setContracts(prev => prev.map(c => c.id === id ? { ...c, status: "CANCELLED" } : c));
    toast.success("Shartnoma bekor qilindi");
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Shartnomalar</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{contracts.filter(c => c.status === "ACTIVE").length} ta faol shartnoma</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Shartnoma</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ism yoki raqam bo'yicha qidirish..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]" />
        </div>
        <div className="flex gap-2">
          {(["ALL", "ACTIVE", "EXPIRED", "CANCELLED"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? "bg-[#1E3A5F] text-white" : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"}`}>
              {f === "ALL" ? "Barchasi" : statusConfig[f as ContractStatus].label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--muted)]/30">
              <tr>
                {["Raqam", "O'quvchi", "Guruh", "Imzolangan", "Muddat", "Holat", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-[var(--muted)]/20">
                  <td className="px-4 py-3 font-mono text-xs text-[#1E3A5F] font-semibold">{c.contractNumber}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <UserAvatar name={c.studentName} size="sm" />
                      <span className="font-medium whitespace-nowrap">{c.studentName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)] whitespace-nowrap">{c.groupName}</td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)] whitespace-nowrap">{c.signedAt}</td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)] whitespace-nowrap">{c.expiresAt}</td>
                  <td className="px-4 py-3"><Badge variant={statusConfig[c.status].variant}>{statusConfig[c.status].label}</Badge></td>
                  <td className="px-4 py-3">
                    {c.status === "ACTIVE" && (
                      <button onClick={() => handleCancel(c.id)} className="text-xs text-red-500 hover:underline whitespace-nowrap">Bekor</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center text-[var(--muted-foreground)] py-12">Ma'lumot yo'q</div>}
        </div>
      </div>

      <Modal open={open} onOpenChange={setOpen} size="sm">
        <ModalHeader><ModalTitle>Yangi shartnoma</ModalTitle></ModalHeader>
        <div className="p-6 space-y-3">
          <Input label="O'quvchi ismi *" value={form.studentName} onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))} placeholder="To'liq ism" />
          <Input label="Guruh" value={form.groupName} onChange={e => setForm(f => ({ ...f, groupName: e.target.value }))} placeholder="Ingliz tili A2" />
          <Input label="Muddat *" type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Bekor</Button>
          <Button onClick={handleSave}>Saqlash</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
