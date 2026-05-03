"use client";
import React from "react";
import { Plus, BookOpen, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface Subject { id: number; name: string; category: string; description: string; groupsCount: number; }

const categories = ["Tillar", "Matematika", "Fanlar", "Texnologiya", "San'at", "Sport", "Boshqa"];

const initialSubjects: Subject[] = [
  { id: 1, name: "Ingliz tili", category: "Tillar", description: "Ingliz tili kursi", groupsCount: 8 },
  { id: 2, name: "Matematika", category: "Matematika", description: "Umumiy matematika", groupsCount: 5 },
  { id: 3, name: "Rus tili", category: "Tillar", description: "Rus tili kursi", groupsCount: 3 },
  { id: 4, name: "Fizika", category: "Fanlar", description: "Umumiy fizika", groupsCount: 2 },
  { id: 5, name: "Kimyo", category: "Fanlar", description: "Umumiy kimyo", groupsCount: 2 },
  { id: 6, name: "Dasturlash", category: "Texnologiya", description: "Python, JavaScript kurslari", groupsCount: 4 },
];

const catColors: Record<string, string> = {
  "Tillar": "bg-blue-100 text-blue-700",
  "Matematika": "bg-purple-100 text-purple-700",
  "Fanlar": "bg-green-100 text-green-700",
  "Texnologiya": "bg-orange-100 text-orange-700",
  "San'at": "bg-pink-100 text-pink-700",
  "Sport": "bg-red-100 text-red-700",
  "Boshqa": "bg-gray-100 text-gray-700",
};

const empty = { name: "", category: "Tillar", description: "" };

export default function SubjectsPage() {
  const [subjects, setSubjects] = React.useState(initialSubjects);
  const [open, setOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<number | null>(null);
  const [form, setForm] = React.useState(empty);
  const [filterCat, setFilterCat] = React.useState("ALL");

  const filtered = filterCat === "ALL" ? subjects : subjects.filter(s => s.category === filterCat);

  const openAdd = () => { setEditId(null); setForm(empty); setOpen(true); };
  const openEdit = (s: Subject) => { setEditId(s.id); setForm({ name: s.name, category: s.category, description: s.description }); setOpen(true); };

  const handleSave = () => {
    if (!form.name) { toast.error("Fan nomini kiriting"); return; }
    if (editId) {
      setSubjects(prev => prev.map(s => s.id === editId ? { ...s, ...form } : s));
      toast.success("Yangilandi");
    } else {
      setSubjects(prev => [...prev, { id: Date.now(), ...form, groupsCount: 0 }]);
      toast.success("Fan qo'shildi");
    }
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    toast.success("O'chirildi");
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Fanlar</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{subjects.length} ta fan</p>
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4" />Fan qo'shish</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["ALL", ...categories].map(c => (
          <button key={c} onClick={() => setFilterCat(c)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterCat === c ? "bg-[#1E3A5F] text-white" : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"}`}>
            {c === "ALL" ? "Barchasi" : c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <Card key={s.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#1E3A5F]/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-[#1E3A5F]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{s.name}</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${catColors[s.category] || catColors["Boshqa"]}`}>{s.category}</span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)]"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              {s.description && <p className="text-xs text-[var(--muted-foreground)]">{s.description}</p>}
              <div className="text-center p-2 rounded-lg bg-[var(--muted)]/50">
                <p className="text-base font-bold text-[#1E3A5F]">{s.groupsCount}</p>
                <p className="text-[10px] text-[var(--muted-foreground)]">Faol guruhlar</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal open={open} onOpenChange={setOpen} size="sm">
        <ModalHeader><ModalTitle>{editId ? "Fanni tahrirlash" : "Yangi fan"}</ModalTitle></ModalHeader>
        <div className="p-6 space-y-3">
          <Input label="Fan nomi *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ingliz tili" />
          <div>
            <label className="text-sm font-medium mb-1.5 block">Kategoriya</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Tavsif" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Fan haqida qisqacha..." />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Bekor</Button>
          <Button onClick={handleSave}>Saqlash</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
