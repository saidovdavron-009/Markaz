"use client";
import React from "react";
import { Plus, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserAvatar } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, getStatusLabel } from "@/lib/utils";
import toast from "react-hot-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type GradeType = "HOMEWORK" | "CLASSWORK" | "TEST" | "EXAM";

interface GradeRow {
  id: string;
  studentName: string;
  type: GradeType;
  score: number;
  maxScore: number;
  date: string;
  comment?: string;
}

const names = ["Alibek Karimov", "Malika Toshmatova", "Jasur Yusupov", "Zulfiya Abdullayeva", "Bobur Nazarov", "Umida Yusupova", "Sherzod Karimov", "Nodira Tosheva"];

const initialGrades: GradeRow[] = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  studentName: names[i % names.length],
  type: (["HOMEWORK", "CLASSWORK", "TEST", "EXAM"] as const)[i % 4],
  score: 60 + (i * 7 % 40),
  maxScore: 100,
  date: new Date(2025, 0, (i % 28) + 1).toISOString().split("T")[0],
  comment: i % 3 === 0 ? "Yaxshi ishladi" : undefined,
}));

const gradeChartData = [
  { range: "91-100", count: 8 },
  { range: "81-90", count: 15 },
  { range: "71-80", count: 12 },
  { range: "61-70", count: 7 },
  { range: "51-60", count: 3 },
  { range: "0-50", count: 2 },
];

export default function GradesPage() {
  const [grades, setGrades] = React.useState(initialGrades);
  const [showModal, setShowModal] = React.useState(false);
  const [form, setForm] = React.useState({
    studentName: "",
    type: "HOMEWORK" as GradeType,
    score: "",
    maxScore: "100",
    date: new Date().toISOString().split("T")[0],
    comment: "",
  });

  const handleAdd = () => {
    if (!form.studentName || !form.score) { toast.error("Barcha maydonlarni to'ldiring"); return; }
    setGrades(prev => [{
      id: String(Date.now()),
      studentName: form.studentName,
      type: form.type,
      score: Number(form.score),
      maxScore: Number(form.maxScore),
      date: form.date,
      comment: form.comment || undefined,
    }, ...prev]);
    toast.success("Baho saqlandi");
    setShowModal(false);
    setForm({ studentName: "", type: "HOMEWORK", score: "", maxScore: "100", date: new Date().toISOString().split("T")[0], comment: "" });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Baholar</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">O'quvchilar baholari</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4" />Baho qo'yish
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Baholar taqsimoti</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={gradeChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" name="O'quvchilar soni" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>O'quvchi</TableHead>
              <TableHead>Tur</TableHead>
              <TableHead>Ball</TableHead>
              <TableHead>Sana</TableHead>
              <TableHead>Izoh</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.map(row => {
              const pct = Math.round((row.score / row.maxScore) * 100);
              const color = pct >= 80 ? "text-green-600" : pct >= 60 ? "text-amber-600" : "text-red-500";
              return (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserAvatar name={row.studentName} size="sm" />
                      <span className="text-sm font-medium">{row.studentName}</span>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-sm">{getStatusLabel(row.type)}</span></TableCell>
                  <TableCell>
                    <span className={`font-bold text-sm ${color}`}>{row.score}/{row.maxScore}</span>
                    <span className="text-xs text-[var(--muted-foreground)] ml-1">({pct}%)</span>
                  </TableCell>
                  <TableCell><span className="text-sm text-[var(--muted-foreground)]">{formatDate(row.date)}</span></TableCell>
                  <TableCell><span className="text-sm text-[var(--muted-foreground)]">{row.comment || "—"}</span></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent size="sm">
          <DialogHeader><DialogTitle>Baho qo'yish</DialogTitle></DialogHeader>
          <div className="p-6 space-y-4">
            <Input label="O'quvchi ismi *" value={form.studentName} onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))} placeholder="Ism familiya" />
            <div>
              <label className="text-sm font-medium mb-1.5 block">Tur</label>
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as GradeType }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOMEWORK">Uy vazifasi</SelectItem>
                  <SelectItem value="CLASSWORK">Sinfda ish</SelectItem>
                  <SelectItem value="TEST">Test</SelectItem>
                  <SelectItem value="EXAM">Imtihon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Ball *" type="number" value={form.score} onChange={e => setForm(f => ({ ...f, score: e.target.value }))} />
              <Input label="Maksimum" type="number" value={form.maxScore} onChange={e => setForm(f => ({ ...f, maxScore: e.target.value }))} />
            </div>
            <Input label="Sana" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            <Textarea label="Izoh" rows={2} value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Bekor qilish</Button>
            <Button onClick={handleAdd}><BookMarked className="h-4 w-4" />Saqlash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
