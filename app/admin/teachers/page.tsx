"use client";
import React from "react";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatPhone } from "@/lib/utils";
import toast from "react-hot-toast";

interface TeacherRow {
  id: string;
  fullName: string;
  phone: string;
  subjects: string[];
  experience: number;
  salaryType: "MONTHLY" | "HOURLY";
  salary: number;
  groups: number;
}

const initialTeachers: TeacherRow[] = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  fullName: ["Sardor Aliyev", "Nilufar Tosheva", "Husan Karimov", "Dilnoza Yusupova", "Sherzod Nazarov"][i % 5],
  phone: `+998 9${i % 3} ${100 + i} ${200 + i} ${30 + (i % 10)}`,
  subjects: [["Ingliz tili", "Matematika", "Fizika", "Kimyo", "Rus tili"][i % 5]],
  experience: 3 + (i % 8),
  salaryType: i % 2 === 0 ? "HOURLY" : "MONTHLY",
  salary: i % 2 === 0 ? 25000 : 3000000,
  groups: (i % 3) + 1,
}));

export default function TeachersPage() {
  const [teachers, setTeachers] = React.useState(initialTeachers);
  const [search, setSearch] = React.useState("");

  const filtered = teachers.filter(t =>
    t.fullName.toLowerCase().includes(search.toLowerCase()) ||
    t.phone.includes(search)
  );

  const handleDelete = (id: string) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    setTeachers(prev => prev.filter(t => t.id !== id));
    toast.success("O'qituvchi o'chirildi");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">O'qituvchilar</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Jami {filtered.length} ta o'qituvchi</p>
        </div>
        <Link href="/admin/teachers/new">
          <Button size="sm"><Plus className="h-4 w-4" />Yangi o'qituvchi</Button>
        </Link>
      </div>

      <div className="max-w-xs">
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Ism yoki telefon bo'yicha..."
        />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>O'qituvchi</TableHead>
              <TableHead>Fanlar</TableHead>
              <TableHead>Tajriba</TableHead>
              <TableHead>Ish haqi</TableHead>
              <TableHead>Guruhlar</TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-[var(--muted-foreground)]">
                  O'qituvchilar topilmadi
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(row => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserAvatar name={row.fullName} size="sm" />
                      <div>
                        <p className="font-medium text-sm">{row.fullName}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{formatPhone(row.phone)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {row.subjects.map(s => (
                        <span key={s} className="bg-[var(--muted)] text-xs px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell><span className="text-sm">{row.experience} yil</span></TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{formatCurrency(row.salary)}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{row.salaryType === "HOURLY" ? "soatbay" : "oylik"}</p>
                  </TableCell>
                  <TableCell><span className="text-sm text-[var(--muted-foreground)]">{row.groups} ta</span></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-end">
                      <Link href={`/admin/teachers/${row.id}`}>
                        <Button variant="ghost" size="icon-sm"><Eye className="h-4 w-4" /></Button>
                      </Link>
                      <Button variant="ghost" size="icon-sm"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon-sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(row.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
