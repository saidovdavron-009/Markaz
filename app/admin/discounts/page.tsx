"use client";
import React from "react";
import { Plus, Tag, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ui/avatar";
import toast from "react-hot-toast";

type DiscountType = "BROTHER_SISTER" | "FULL_PAYMENT" | "LOYALTY" | "SPECIAL";

interface Discount { id: number; studentName: string; type: DiscountType; percentage: number; expiredAt: string; isActive: boolean; }

const typeLabels: Record<DiscountType, string> = {
  BROTHER_SISTER: "Aka-uka/Opa-singil",
  FULL_PAYMENT: "To'liq to'lov",
  LOYALTY: "Sadoqatli o'quvchi",
  SPECIAL: "Maxsus",
};
const typeColors: Record<DiscountType, string> = {
  BROTHER_SISTER: "bg-blue-100 text-blue-700",
  FULL_PAYMENT: "bg-green-100 text-green-700",
  LOYALTY: "bg-purple-100 text-purple-700",
  SPECIAL: "bg-amber-100 text-amber-700",
};

const initialDiscounts: Discount[] = [
  { id: 1, studentName: "Alibek Karimov", type: "BROTHER_SISTER", percentage: 10, expiredAt: "2025-06-01", isActive: true },
  { id: 2, studentName: "Zulfiya Rahimova", type: "LOYALTY", percentage: 15, expiredAt: "2025-03-01", isActive: true },
  { id: 3, studentName: "Jasur Toshmatov", type: "FULL_PAYMENT", percentage: 20, expiredAt: "2025-02-01", isActive: false },
  { id: 4, studentName: "Malika Yusupova", type: "SPECIAL", percentage: 25, expiredAt: "2025-12-31", isActive: true },
  { id: 5, studentName: "Bobur Nazarov", type: "BROTHER_SISTER", percentage: 10, expiredAt: "2025-06-01", isActive: true },
];

const empty = { studentName: "", type: "BROTHER_SISTER" as DiscountType, percentage: "", expiredAt: "" };

export default function DiscountsPage() {
  const [discounts, setDiscounts] = React.useState(initialDiscounts);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState(empty);
  const [filter, setFilter] = React.useState<"ALL" | "ACTIVE" | "EXPIRED">("ALL");

  const filtered = discounts.filter(d => filter === "ALL" || (filter === "ACTIVE" ? d.isActive : !d.isActive));

  const handleSave = () => {
    if (!form.studentName || !form.percentage || !form.expiredAt) { toast.error("Barcha maydonlarni to'ldiring"); return; }
    setDiscounts(prev => [...prev, { id: Date.now(), studentName: form.studentName, type: form.type, percentage: Number(form.percentage), expiredAt: form.expiredAt, isActive: true }]);
    toast.success("Chegirma qo'shildi");
    setOpen(false);
    setForm(empty);
  };

  const handleDelete = (id: number) => { setDiscounts(prev => prev.filter(d => d.id !== id)); toast.success("O'chirildi"); };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Chegirmalar</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{discounts.filter(d => d.isActive).length} ta faol chegirma</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Chegirma berish</Button>
      </div>

      <div className="flex gap-2">
        {(["ALL", "ACTIVE", "EXPIRED"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? "bg-[#1E3A5F] text-white" : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"}`}>
            {f === "ALL" ? "Barchasi" : f === "ACTIVE" ? "Faol" : "Muddati o'tgan"}
          </button>
        ))}
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--muted)]/30">
              <tr>
                {["O'quvchi", "Tur", "Chegirma", "Muddat", "Holat", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-[var(--muted)]/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <UserAvatar name={d.studentName} size="sm" />
                      <span className="font-medium">{d.studentName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[d.type]}`}>{typeLabels[d.type]}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-green-600">{d.percentage}%</td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">{d.expiredAt}</td>
                  <td className="px-4 py-3">
                    <Badge variant={d.isActive ? "success" : "secondary"}>{d.isActive ? "Faol" : "Tugagan"}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(d.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center text-[var(--muted-foreground)] py-12">Ma'lumot yo'q</div>}
        </div>
      </div>

      <Modal open={open} onOpenChange={setOpen} size="sm">
        <ModalHeader><ModalTitle>Yangi chegirma</ModalTitle></ModalHeader>
        <div className="p-6 space-y-3">
          <Input label="O'quvchi ismi *" value={form.studentName} onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))} placeholder="To'liq ism" />
          <div>
            <label className="text-sm font-medium mb-1.5 block">Chegirma turi</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as DiscountType }))}
              className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]">
              {(Object.entries(typeLabels) as [DiscountType, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <Input label="Chegirma foizi *" type="number" value={form.percentage} onChange={e => setForm(f => ({ ...f, percentage: e.target.value }))} placeholder="10" />
          <Input label="Muddat *" type="date" value={form.expiredAt} onChange={e => setForm(f => ({ ...f, expiredAt: e.target.value }))} />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Bekor</Button>
          <Button onClick={handleSave}>Saqlash</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
