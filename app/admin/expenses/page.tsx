"use client";
import React from "react";
import { Plus, DollarSign, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

type ExpenseCategory = "RENT" | "SALARY" | "UTILITY" | "OTHER";

interface ExpenseRow {
  id: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: string;
}

const categoryLabel: Record<ExpenseCategory, string> = { RENT: "Ijara", SALARY: "Ish haqi", UTILITY: "Kommunal", OTHER: "Boshqa" };
const categoryColor: Record<ExpenseCategory, string> = {
  RENT: "bg-blue-100 text-blue-800",
  SALARY: "bg-purple-100 text-purple-800",
  UTILITY: "bg-amber-100 text-amber-800",
  OTHER: "bg-gray-100 text-gray-800",
};

const initialExpenses: ExpenseRow[] = [
  { id: "1", category: "RENT",    amount: 5000000, description: "Yanvar ijarasi",           date: "2025-01-01" },
  { id: "2", category: "SALARY",  amount: 8000000, description: "O'qituvchilar ish haqi",   date: "2025-01-31" },
  { id: "3", category: "UTILITY", amount: 800000,  description: "Kommunal xarajatlar",      date: "2025-01-15" },
  { id: "4", category: "OTHER",   amount: 500000,  description: "Maktab jihozlari",         date: "2025-01-10" },
  { id: "5", category: "RENT",    amount: 5000000, description: "Fevral ijarasi",           date: "2025-02-01" },
  { id: "6", category: "SALARY",  amount: 8200000, description: "Fevral ish haqi",          date: "2025-02-28" },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = React.useState(initialExpenses);
  const [showModal, setShowModal] = React.useState(false);
  const [form, setForm] = React.useState({
    category: "OTHER" as ExpenseCategory,
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const handleAdd = () => {
    if (!form.amount || !form.date) { toast.error("Miqdor va sanani kiriting"); return; }
    setExpenses(prev => [{
      id: String(Date.now()),
      category: form.category,
      amount: Number(form.amount),
      description: form.description,
      date: form.date,
    }, ...prev]);
    toast.success("Xarajat qo'shildi");
    setShowModal(false);
    setForm({ category: "OTHER", amount: "", description: "", date: new Date().toISOString().split("T")[0] });
  };

  const handleDelete = (id: string) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    setExpenses(prev => prev.filter(e => e.id !== id));
    toast.success("O'chirildi");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Xarajatlar</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Xarajatlarni boshqarish</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4" />Xarajat qo'shish
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <StatCard title="Ijara" value={formatCurrency(expenses.filter(e => e.category === "RENT").reduce((s, e) => s + e.amount, 0))} icon={<DollarSign className="h-5 w-5" />} iconBg="bg-blue-100" />
        <StatCard title="Ish haqi" value={formatCurrency(expenses.filter(e => e.category === "SALARY").reduce((s, e) => s + e.amount, 0))} icon={<DollarSign className="h-5 w-5" />} iconBg="bg-purple-100" />
        <StatCard title="Kommunal" value={formatCurrency(expenses.filter(e => e.category === "UTILITY").reduce((s, e) => s + e.amount, 0))} icon={<DollarSign className="h-5 w-5" />} iconBg="bg-amber-100" />
        <StatCard title="Jami xarajat" value={formatCurrency(totalExpenses)} icon={<DollarSign className="h-5 w-5" />} iconBg="bg-red-100" />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Kategoriya</TableHead>
              <TableHead>Tavsif</TableHead>
              <TableHead>Miqdor</TableHead>
              <TableHead>Sana</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map(row => (
              <TableRow key={row.id}>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${categoryColor[row.category]}`}>
                    {categoryLabel[row.category]}
                  </span>
                </TableCell>
                <TableCell><span className="text-sm">{row.description || "—"}</span></TableCell>
                <TableCell><span className="font-semibold text-sm text-red-600">−{formatCurrency(row.amount)}</span></TableCell>
                <TableCell><span className="text-sm text-[var(--muted-foreground)]">{formatDate(row.date)}</span></TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon-sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(row.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent size="sm">
          <DialogHeader><DialogTitle>Xarajat qo'shish</DialogTitle></DialogHeader>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Kategoriya</label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v as ExpenseCategory }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="RENT">Ijara</SelectItem>
                  <SelectItem value="SALARY">Ish haqi</SelectItem>
                  <SelectItem value="UTILITY">Kommunal</SelectItem>
                  <SelectItem value="OTHER">Boshqa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input label="Miqdor (so'm) *" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="5000000" />
            <Input label="Tavsif" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Xarajat nomi" />
            <Input label="Sana *" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Bekor qilish</Button>
            <Button onClick={handleAdd}>Saqlash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
