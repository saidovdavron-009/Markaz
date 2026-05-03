"use client";
import React from "react";
import { Plus, DoorOpen, Users, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface Room { id: number; name: string; branchName: string; capacity: number; status: "FREE" | "BUSY"; currentGroup?: string; }

const initialRooms: Room[] = [
  { id: 1, name: "Xona 101", branchName: "Markaz filiali", capacity: 15, status: "BUSY", currentGroup: "Ingliz tili A2" },
  { id: 2, name: "Xona 102", branchName: "Markaz filiali", capacity: 20, status: "FREE" },
  { id: 3, name: "Xona 201", branchName: "Markaz filiali", capacity: 12, status: "BUSY", currentGroup: "Matematika B1" },
  { id: 4, name: "Xona 301", branchName: "Yunusobod filiali", capacity: 18, status: "FREE" },
  { id: 5, name: "Xona 101", branchName: "Yunusobod filiali", capacity: 10, status: "BUSY", currentGroup: "Dasturlash" },
  { id: 6, name: "Katta zal", branchName: "Markaz filiali", capacity: 40, status: "FREE" },
];

const branches = ["Markaz filiali", "Yunusobod filiali", "Mirzo Ulug'bek filiali"];
const empty = { name: "", branchName: "Markaz filiali", capacity: "" };

export default function RoomsPage() {
  const [rooms, setRooms] = React.useState(initialRooms);
  const [open, setOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<number | null>(null);
  const [form, setForm] = React.useState(empty);
  const [filterBranch, setFilterBranch] = React.useState("ALL");

  const filtered = filterBranch === "ALL" ? rooms : rooms.filter(r => r.branchName === filterBranch);
  const freeCount = rooms.filter(r => r.status === "FREE").length;
  const busyCount = rooms.filter(r => r.status === "BUSY").length;

  const openAdd = () => { setEditId(null); setForm(empty); setOpen(true); };
  const openEdit = (r: Room) => { setEditId(r.id); setForm({ name: r.name, branchName: r.branchName, capacity: String(r.capacity) }); setOpen(true); };

  const handleSave = () => {
    if (!form.name || !form.capacity) { toast.error("Nom va sig'imni kiriting"); return; }
    if (editId) {
      setRooms(prev => prev.map(r => r.id === editId ? { ...r, name: form.name, branchName: form.branchName, capacity: parseInt(form.capacity) } : r));
      toast.success("Yangilandi");
    } else {
      setRooms(prev => [...prev, { id: Date.now(), name: form.name, branchName: form.branchName, capacity: parseInt(form.capacity), status: "FREE" }]);
      toast.success("Xona qo'shildi");
    }
    setOpen(false);
  };

  const handleDelete = (id: number) => { setRooms(prev => prev.filter(r => r.id !== id)); toast.success("O'chirildi"); };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Xonalar</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{freeCount} ta bo'sh, {busyCount} ta band</p>
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4" />Xona qo'shish</Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-2xl font-bold text-[#1E3A5F]">{rooms.length}</p><p className="text-xs text-[var(--muted-foreground)]">Jami xona</p></CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-2xl font-bold text-green-600">{freeCount}</p><p className="text-xs text-[var(--muted-foreground)]">Bo'sh</p></CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-2xl font-bold text-amber-500">{busyCount}</p><p className="text-xs text-[var(--muted-foreground)]">Band</p></CardContent></Card>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["ALL", ...branches].map(b => (
          <button key={b} onClick={() => setFilterBranch(b)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterBranch === b ? "bg-[#1E3A5F] text-white" : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"}`}>
            {b === "ALL" ? "Barchasi" : b}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(r => (
          <Card key={r.id} className={`hover:shadow-md transition-shadow ${r.status === "BUSY" ? "border-amber-200" : "border-green-200"}`}>
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${r.status === "BUSY" ? "bg-amber-100" : "bg-green-100"}`}>
                    <DoorOpen className={`h-5 w-5 ${r.status === "BUSY" ? "text-amber-600" : "text-green-600"}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{r.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{r.branchName}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)]"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-[var(--muted-foreground)]"><Users className="h-3.5 w-3.5" />Sig'im: {r.capacity} kishi</span>
                <Badge variant={r.status === "FREE" ? "success" : "warning"}>{r.status === "FREE" ? "Bo'sh" : "Band"}</Badge>
              </div>
              {r.currentGroup && <p className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)]/50 px-2 py-1 rounded-lg">{r.currentGroup}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal open={open} onOpenChange={setOpen} size="sm">
        <ModalHeader><ModalTitle>{editId ? "Xonani tahrirlash" : "Yangi xona"}</ModalTitle></ModalHeader>
        <div className="p-6 space-y-3">
          <Input label="Xona nomi *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Xona 101" />
          <div>
            <label className="text-sm font-medium mb-1.5 block">Filial</label>
            <select value={form.branchName} onChange={e => setForm(f => ({ ...f, branchName: e.target.value }))}
              className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]">
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <Input label="Sig'im (kishi) *" type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} placeholder="20" />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Bekor</Button>
          <Button onClick={handleSave}>Saqlash</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
