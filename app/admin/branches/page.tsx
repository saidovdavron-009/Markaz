"use client";
import React from "react";
import { Plus, Building2, Phone, MapPin, Pencil, Trash2, X, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  manager: string;
  studentsCount: number;
  groupsCount: number;
}

const initialBranches: Branch[] = [
  { id: 1, name: "Markaz filiali", address: "Toshkent sh., Chilonzor tumani, 15-uy", phone: "+998 71 123 45 67", manager: "Sardor Toshmatov", studentsCount: 120, groupsCount: 12 },
  { id: 2, name: "Yunusobod filiali", address: "Toshkent sh., Yunusobod tumani, 8-uy", phone: "+998 71 234 56 78", manager: "Malika Yusupova", studentsCount: 85, groupsCount: 8 },
  { id: 3, name: "Mirzo Ulug'bek filiali", address: "Toshkent sh., Mirzo Ulug'bek tumani, 3-uy", phone: "+998 71 345 67 89", manager: "Jasur Karimov", studentsCount: 60, groupsCount: 6 },
];

const empty = { name: "", address: "", phone: "", manager: "" };

export default function BranchesPage() {
  const [branches, setBranches] = React.useState(initialBranches);
  const [open, setOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<number | null>(null);
  const [form, setForm] = React.useState(empty);

  const openAdd = () => { setEditId(null); setForm(empty); setOpen(true); };
  const openEdit = (b: Branch) => { setEditId(b.id); setForm({ name: b.name, address: b.address, phone: b.phone, manager: b.manager }); setOpen(true); };

  const handleSave = () => {
    if (!form.name || !form.address) { toast.error("Nom va manzilni kiriting"); return; }
    if (editId) {
      setBranches(prev => prev.map(b => b.id === editId ? { ...b, ...form } : b));
      toast.success("Yangilandi");
    } else {
      setBranches(prev => [...prev, { id: Date.now(), ...form, studentsCount: 0, groupsCount: 0 }]);
      toast.success("Filial qo'shildi");
    }
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    setBranches(prev => prev.filter(b => b.id !== id));
    toast.success("O'chirildi");
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Filiallar</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{branches.length} ta filial</p>
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4" />Filial qo'shish</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map(b => (
          <Card key={b.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#1E3A5F]/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-[#1E3A5F]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{b.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{b.manager}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)]"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-[var(--muted-foreground)]">
                <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" />{b.address}</div>
                <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 shrink-0" />{b.phone}</div>
              </div>
              <div className="flex gap-2 pt-1">
                <div className="flex-1 text-center p-2 rounded-lg bg-[var(--muted)]/50">
                  <p className="text-base font-bold text-[#1E3A5F]">{b.studentsCount}</p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">O'quvchi</p>
                </div>
                <div className="flex-1 text-center p-2 rounded-lg bg-[var(--muted)]/50">
                  <p className="text-base font-bold text-[#1E3A5F]">{b.groupsCount}</p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">Guruh</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal open={open} onOpenChange={setOpen} size="sm">
        <ModalHeader><ModalTitle>{editId ? "Filialni tahrirlash" : "Yangi filial"}</ModalTitle></ModalHeader>
        <div className="p-6 space-y-3">
          <Input label="Filial nomi *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Markaz filiali" />
          <Input label="Manzil *" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Toshkent sh., ..." />
          <Input label="Telefon" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+998 71 ..." />
          <Input label="Menejer" value={form.manager} onChange={e => setForm(f => ({ ...f, manager: e.target.value }))} placeholder="To'liq ism" />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Bekor</Button>
          <Button onClick={handleSave}>Saqlash</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
