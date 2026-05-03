"use client";
import React from "react";
import { DollarSign, Check, Clock, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { Modal, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface Salary {
  id: number; teacherName: string; period: string;
  base: number; bonus: number; fine: number; total: number; isPaid: boolean; paidAt?: string;
}

const months = ["2025-01", "2024-12", "2024-11"];

const initialSalaries: Salary[] = [
  { id: 1, teacherName: "Aziz Karimov", period: "2025-01", base: 3000000, bonus: 500000, fine: 0, total: 3500000, isPaid: false },
  { id: 2, teacherName: "Sardor Toshmatov", period: "2025-01", base: 2500000, bonus: 200000, fine: 100000, total: 2600000, isPaid: false },
  { id: 3, teacherName: "Malika Yusupova", period: "2025-01", base: 2800000, bonus: 0, fine: 0, total: 2800000, isPaid: true, paidAt: "2025-01-30" },
  { id: 4, teacherName: "Jasur Karimov", period: "2025-01", base: 2200000, bonus: 300000, fine: 50000, total: 2450000, isPaid: false },
  { id: 5, teacherName: "Aziz Karimov", period: "2024-12", base: 3000000, bonus: 400000, fine: 0, total: 3400000, isPaid: true, paidAt: "2024-12-30" },
  { id: 6, teacherName: "Sardor Toshmatov", period: "2024-12", base: 2500000, bonus: 150000, fine: 0, total: 2650000, isPaid: true, paidAt: "2024-12-29" },
];

const fmt = (n: number) => n.toLocaleString("uz-UZ") + " so'm";

export default function SalariesPage() {
  const [salaries, setSalaries] = React.useState(initialSalaries);
  const [period, setPeriod] = React.useState("2025-01");
  const [detailId, setDetailId] = React.useState<number | null>(null);

  const filtered = salaries.filter(s => s.period === period);
  const unpaidTotal = filtered.filter(s => !s.isPaid).reduce((a, b) => a + b.total, 0);
  const paidTotal = filtered.filter(s => s.isPaid).reduce((a, b) => a + b.total, 0);

  const handlePay = (id: number) => {
    setSalaries(prev => prev.map(s => s.id === id ? { ...s, isPaid: true, paidAt: new Date().toISOString().split("T")[0] } : s));
    toast.success("Maosh to'landi");
    setDetailId(null);
  };

  const detail = salaries.find(s => s.id === detailId);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">O'qituvchi maoshlari</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{filtered.filter(s => !s.isPaid).length} ta to'lanmagan</p>
        </div>
        <select value={period} onChange={e => setPeriod(e.target.value)}
          className="h-9 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]">
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Card><CardContent className="pt-4 pb-4"><p className="text-xs text-[var(--muted-foreground)]">Jami to'lanadigan</p><p className="text-lg font-bold text-amber-500 mt-1">{fmt(unpaidTotal)}</p></CardContent></Card>
        <Card><CardContent className="pt-4 pb-4"><p className="text-xs text-[var(--muted-foreground)]">To'langan</p><p className="text-lg font-bold text-green-600 mt-1">{fmt(paidTotal)}</p></CardContent></Card>
        <Card className="col-span-2 sm:col-span-1"><CardContent className="pt-4 pb-4"><p className="text-xs text-[var(--muted-foreground)]">Jami o'qituvchi</p><p className="text-lg font-bold text-[#1E3A5F] mt-1">{filtered.length} ta</p></CardContent></Card>
      </div>

      <div className="space-y-3">
        {filtered.map(s => (
          <div key={s.id} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-4">
            <UserAvatar name={s.teacherName} size="md" className="shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{s.teacherName}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-xs text-[var(--muted-foreground)]">
                <span>Asosiy: {fmt(s.base)}</span>
                {s.bonus > 0 && <span className="text-green-600">+Bonus: {fmt(s.bonus)}</span>}
                {s.fine > 0 && <span className="text-red-500">-Jarima: {fmt(s.fine)}</span>}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-bold text-sm">{fmt(s.total)}</p>
              {s.isPaid ? (
                <Badge variant="success" className="mt-1">To'langan</Badge>
              ) : (
                <Button size="sm" className="mt-1 h-7 text-xs" onClick={() => setDetailId(s.id)}>To'lash</Button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center text-[var(--muted-foreground)] py-12">Ma'lumot yo'q</div>}
      </div>

      {detail && (
        <Modal open={!!detailId} onOpenChange={() => setDetailId(null)} size="sm">
          <ModalHeader><ModalTitle>Maosh to'lash</ModalTitle></ModalHeader>
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <UserAvatar name={detail.teacherName} size="md" />
              <div>
                <p className="font-semibold">{detail.teacherName}</p>
                <p className="text-sm text-[var(--muted-foreground)]">{detail.period}</p>
              </div>
            </div>
            {[["Asosiy maosh", fmt(detail.base)], ["Bonus", fmt(detail.bonus)], ["Jarima", `-${fmt(detail.fine)}`], ["Jami", fmt(detail.total)]].map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm py-1.5 border-b border-[var(--border)] last:border-0 last:font-bold">
                <span className="text-[var(--muted-foreground)]">{label}</span>
                <span>{val}</span>
              </div>
            ))}
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setDetailId(null)}>Bekor</Button>
            <Button onClick={() => handlePay(detail.id)}>To'lash</Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
