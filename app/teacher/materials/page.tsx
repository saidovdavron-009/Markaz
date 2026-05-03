"use client";
import React from "react";
import { Plus, FileText, Download, Trash2, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

type MaterialType = "PDF" | "VIDEO" | "DOCUMENT" | "LINK" | "IMAGE";

interface Material {
  id: string;
  title: string;
  type: MaterialType;
  groupId: string;
  groupName: string;
  uploadedAt: string;
  size?: string;
  description?: string;
}

const typeConfig: Record<MaterialType, { label: string; color: string; bg: string }> = {
  PDF:      { label: "PDF",      color: "text-red-600",    bg: "bg-red-50" },
  VIDEO:    { label: "Video",    color: "text-blue-600",   bg: "bg-blue-50" },
  DOCUMENT: { label: "Hujjat",  color: "text-gray-600",   bg: "bg-gray-50" },
  LINK:     { label: "Havola",   color: "text-purple-600", bg: "bg-purple-50" },
  IMAGE:    { label: "Rasm",     color: "text-green-600",  bg: "bg-green-50" },
};

const initialMaterials: Material[] = [
  { id: "1", title: "Present Simple Grammar Rules", type: "PDF", groupId: "1", groupName: "Ingliz tili A2", uploadedAt: "2025-01-25", size: "1.2 MB", description: "Grammatika qoidalari va misollar" },
  { id: "2", title: "Vocabulary Unit 5", type: "DOCUMENT", groupId: "1", groupName: "Ingliz tili A2", uploadedAt: "2025-01-24", size: "340 KB" },
  { id: "3", title: "Listening Exercise Video", type: "VIDEO", groupId: "2", groupName: "Ingliz tili B1", uploadedAt: "2025-01-23", size: "45 MB", description: "Tinglab tushunish mashqlari" },
  { id: "4", title: "Oxford Dictionary Online", type: "LINK", groupId: "1", groupName: "Ingliz tili A2", uploadedAt: "2025-01-22" },
  { id: "5", title: "Pronunciation Guide", type: "PDF", groupId: "3", groupName: "Speaking Club", uploadedAt: "2025-01-20", size: "890 KB" },
  { id: "6", title: "Grammar Charts", type: "IMAGE", groupId: "2", groupName: "Ingliz tili B1", uploadedAt: "2025-01-19", size: "2.1 MB" },
];

export default function TeacherMaterialsPage() {
  const [materials, setMaterials] = React.useState(initialMaterials);
  const [group, setGroup] = React.useState("ALL");
  const [typeFilter, setTypeFilter] = React.useState("ALL");
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ title: "", type: "PDF" as MaterialType, groupId: "1", description: "" });

  const filtered = materials.filter(m =>
    (group === "ALL" || m.groupId === group) &&
    (typeFilter === "ALL" || m.type === typeFilter)
  );

  const handleDelete = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
    toast.success("Material o'chirildi");
  };

  const handleCreate = () => {
    if (!form.title) { toast.error("Sarlavhani kiriting"); return; }
    const groupNames: Record<string, string> = { "1": "Ingliz tili A2", "2": "Ingliz tili B1", "3": "Speaking Club" };
    setMaterials(prev => [{
      id: String(Date.now()),
      title: form.title,
      type: form.type,
      groupId: form.groupId,
      groupName: groupNames[form.groupId],
      uploadedAt: new Date().toISOString().split("T")[0],
      description: form.description,
    }, ...prev]);
    setOpen(false);
    toast.success("Material qo'shildi");
    setForm({ title: "", type: "PDF", groupId: "1", description: "" });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">O'quv materiallari</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{filtered.length} ta material</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Material qo'shish</Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={group} onValueChange={setGroup}>
          <SelectTrigger className="w-48 h-9"><SelectValue placeholder="Guruh" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Barcha guruhlar</SelectItem>
            <SelectItem value="1">Ingliz tili A2</SelectItem>
            <SelectItem value="2">Ingliz tili B1</SelectItem>
            <SelectItem value="3">Speaking Club</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Tur" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Barchasi</SelectItem>
            <SelectItem value="PDF">PDF</SelectItem>
            <SelectItem value="VIDEO">Video</SelectItem>
            <SelectItem value="DOCUMENT">Hujjat</SelectItem>
            <SelectItem value="LINK">Havola</SelectItem>
            <SelectItem value="IMAGE">Rasm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(m => {
          const cfg = typeConfig[m.type];
          return (
            <Card key={m.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                    <FileText className={`h-5 w-5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm leading-tight truncate">{m.title}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{m.groupName}</p>
                    {m.description && <p className="text-xs text-[var(--muted-foreground)] mt-1 truncate">{m.description}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">{cfg.label}</Badge>
                      {m.size && <span className="text-xs text-[var(--muted-foreground)]">{m.size}</span>}
                      <span className="text-xs text-[var(--muted-foreground)] ml-auto">{formatDate(m.uploadedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                    <Download className="h-3.5 w-3.5" />
                    Yuklab olish
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(m.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center text-[var(--muted-foreground)] py-12">
            Materiallar yo'q
          </div>
        )}
      </div>

      <Modal open={open} onOpenChange={setOpen} size="sm">
        <ModalHeader><ModalTitle>Yangi material</ModalTitle></ModalHeader>
        <div className="space-y-4 p-6">
          <Input label="Sarlavha" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Material nomi" />
          <div>
            <label className="text-sm font-medium mb-1.5 block">Tur</label>
            <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as MaterialType }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="VIDEO">Video</SelectItem>
                <SelectItem value="DOCUMENT">Hujjat</SelectItem>
                <SelectItem value="LINK">Havola</SelectItem>
                <SelectItem value="IMAGE">Rasm</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Guruh</label>
            <Select value={form.groupId} onValueChange={v => setForm(f => ({ ...f, groupId: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Ingliz tili A2</SelectItem>
                <SelectItem value="2">Ingliz tili B1</SelectItem>
                <SelectItem value="3">Speaking Club</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea label="Tavsif (ixtiyoriy)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Bekor</Button>
          <Button onClick={handleCreate}>Saqlash</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
