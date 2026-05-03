"use client";
import React from "react";
import { Plus, Download, CreditCard, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import toast from "react-hot-toast";

type PaymentStatus = "PAID" | "PENDING" | "OVERDUE";
type PaymentMethod = "CASH" | "CARD" | "CLICK" | "PAYME" | "UZUM";

interface PaymentRow {
  id: string;
  studentName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string;
  dueDate: string;
}

const names = ["Alibek Karimov", "Malika Toshmatova", "Jasur Yusupov", "Zulfiya Abdullayeva", "Bobur Nazarov", "Umida Yusupova", "Sherzod Karimov", "Nodira Tosheva"];

const initialPayments: PaymentRow[] = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  studentName: names[i % names.length],
  amount: 400000 + (i % 5) * 100000,
  method: (["CASH", "CLICK", "PAYME", "CARD", "UZUM"] as const)[i % 5],
  status: (["PAID", "PAID", "PENDING", "PAID", "OVERDUE"] as const)[i % 5],
  paidAt: i % 5 !== 2 && i % 5 !== 4 ? new Date(2025, 0, i + 1).toISOString() : undefined,
  dueDate: new Date(2025, 1, 1).toISOString(),
}));

const methodLabel: Record<PaymentMethod, string> = { CASH: "Naqd", CARD: "Karta", CLICK: "Click", PAYME: "Payme", UZUM: "Uzum" };

export default function FinancePage() {
  const [payments, setPayments] = React.useState(initialPayments);
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [showModal, setShowModal] = React.useState(false);
  const [form, setForm] = React.useState({ studentName: "", amount: "", method: "CASH" as PaymentMethod, description: "" });

  const filtered = payments.filter(p => statusFilter === "ALL" || p.status === statusFilter);

  const totalPaid = payments.filter(p => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === "PENDING").reduce((s, p) => s + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === "OVERDUE").reduce((s, p) => s + p.amount, 0);

  const handleAdd = () => {
    if (!form.studentName || !form.amount) { toast.error("Barcha maydonlarni to'ldiring"); return; }
    setPayments(prev => [{
      id: String(Date.now()),
      studentName: form.studentName,
      amount: Number(form.amount),
      method: form.method,
      status: "PAID",
      paidAt: new Date().toISOString(),
      dueDate: new Date().toISOString(),
    }, ...prev]);
    toast.success("To'lov qabul qilindi");
    setShowModal(false);
    setForm({ studentName: "", amount: "", method: "CASH", description: "" });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Moliya va To'lovlar</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">To'lovlarni boshqarish</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4" />Export</Button>
          <Button size="sm" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" />To'lov qabul qilish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="To'langan" value={formatCurrency(totalPaid)} icon={<CheckCircle className="h-5 w-5" />} iconBg="bg-green-100" />
        <StatCard title="Kutilmoqda" value={formatCurrency(totalPending)} icon={<Clock className="h-5 w-5" />} iconBg="bg-amber-100" />
        <StatCard title="Muddati o'tgan" value={formatCurrency(totalOverdue)} icon={<AlertCircle className="h-5 w-5" />} iconBg="bg-red-100" />
      </div>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-44 h-9"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Barchasi</SelectItem>
          <SelectItem value="PAID">To'langan</SelectItem>
          <SelectItem value="PENDING">Kutilmoqda</SelectItem>
          <SelectItem value="OVERDUE">Muddati o'tgan</SelectItem>
        </SelectContent>
      </Select>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>O'quvchi</TableHead>
              <TableHead>Miqdor</TableHead>
              <TableHead>Usul</TableHead>
              <TableHead>Holat</TableHead>
              <TableHead>Muddat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(row => (
              <TableRow key={row.id}>
                <TableCell>
                  <p className="font-medium text-sm">{row.studentName}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{row.paidAt ? formatDate(row.paidAt) : "—"}</p>
                </TableCell>
                <TableCell><span className="font-semibold text-sm">{formatCurrency(row.amount)}</span></TableCell>
                <TableCell><span className="text-sm">{methodLabel[row.method]}</span></TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(row.status)}`}>
                    {getStatusLabel(row.status)}
                  </span>
                </TableCell>
                <TableCell><span className="text-sm text-[var(--muted-foreground)]">{formatDate(row.dueDate)}</span></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent size="sm">
          <DialogHeader><DialogTitle>To'lov qabul qilish</DialogTitle></DialogHeader>
          <div className="p-6 space-y-4">
            <Input label="O'quvchi ismi *" value={form.studentName} onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))} placeholder="Ism familiya" />
            <Input label="Miqdor (so'm) *" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="500000" />
            <div>
              <label className="text-sm font-medium mb-1.5 block">To'lov usuli</label>
              <Select value={form.method} onValueChange={v => setForm(f => ({ ...f, method: v as PaymentMethod }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Naqd</SelectItem>
                  <SelectItem value="CARD">Karta</SelectItem>
                  <SelectItem value="CLICK">Click</SelectItem>
                  <SelectItem value="PAYME">Payme</SelectItem>
                  <SelectItem value="UZUM">Uzum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input label="Izoh" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Ixtiyoriy" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Bekor qilish</Button>
            <Button onClick={handleAdd}><CreditCard className="h-4 w-4" />Qabul qilish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
