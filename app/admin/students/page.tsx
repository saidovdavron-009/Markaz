"use client";
import React from "react";
import { Plus, Download, Eye, Pencil, Trash2, Copy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserAvatar } from "@/components/ui/avatar";
import { formatDate, formatPhone, getStatusColor, getStatusLabel } from "@/lib/utils";
import toast from "react-hot-toast";

interface StudentRow {
  id: string;
  studentId: string;
  password: string;
  fullName: string;
  phone: string;
  gender: "MALE" | "FEMALE";
  groups: number;
  status: "ACTIVE" | "FROZEN" | "GRADUATED";
  createdAt: string;
}

function genPassword(seed: number) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  let n = seed * 9301 + 49297;
  for (let i = 0; i < 8; i++) {
    n = (n * 9301 + 49297) % 233280;
    result += chars[n % chars.length];
  }
  return result;
}

const initialStudents: StudentRow[] = Array.from({ length: 25 }, (_, i) => ({
  id: String(i + 1),
  studentId: `ID${String(i + 1).padStart(3, "0")}`,
  password: genPassword(i + 1),
  fullName: ["Alibek Karimov", "Malika Toshmatova", "Jasur Yusupov", "Zulfiya Abdullayeva", "Bobur Nazarov"][i % 5],
  phone: `+998 9${i % 3} ${100 + i} ${200 + i} ${30 + (i % 10)}`,
  gender: i % 2 === 0 ? "MALE" : "FEMALE",
  groups: (i % 3) + 1,
  status: (["ACTIVE", "ACTIVE", "ACTIVE", "FROZEN", "GRADUATED"] as const)[i % 5],
  createdAt: new Date(2025, 0, (i % 28) + 1).toISOString(),
}));

const PAGE_SIZES = [10, 20, 50];

export default function StudentsPage() {
  const [students, setStudents] = React.useState(initialStudents);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [showPasswords, setShowPasswords] = React.useState<Record<string, boolean>>({});

  const filtered = students.filter(s => {
    const matchSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search) ||
      s.studentId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = (id: string) => {
    if (!confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    setStudents(prev => prev.filter(s => s.id !== id));
    toast.success("O'quvchi o'chirildi");
  };

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleStatusFilter = (v: string) => { setStatusFilter(v); setPage(1); };

  const copyId = (studentId: string, password: string) => {
    navigator.clipboard.writeText(`Login: ${studentId}\nParol: ${password}`);
    toast.success("ID va parol nusxalandi!");
  };

  const togglePassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">O'quvchilar</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Jami {filtered.length} ta o'quvchi</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />Export
          </Button>
          <Link href="/admin/students/new">
            <Button size="sm">
              <Plus className="h-4 w-4" />Yangi o'quvchi
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] max-w-xs">
          <Input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Ism, ID yoki telefon..."
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Barchasi</SelectItem>
            <SelectItem value="ACTIVE">Aktiv</SelectItem>
            <SelectItem value="FROZEN">Muzlatilgan</SelectItem>
            <SelectItem value="GRADUATED">Tugatgan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[90px]">ID</TableHead>
              <TableHead>O'quvchi</TableHead>
              <TableHead>Parol</TableHead>
              <TableHead>Guruhlar</TableHead>
              <TableHead>Holat</TableHead>
              <TableHead>Qo'shilgan</TableHead>
              <TableHead className="w-[110px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-[var(--muted-foreground)]">
                  O'quvchilar topilmadi
                </TableCell>
              </TableRow>
            ) : (
              paginated.map(row => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#1E3A5F] text-sm bg-[#1E3A5F]/10 px-2 py-0.5 rounded-lg">
                        {row.studentId}
                      </span>
                    </div>
                  </TableCell>
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
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">
                        {showPasswords[row.id] ? row.password : "••••••••"}
                      </span>
                      <button
                        onClick={() => togglePassword(row.id)}
                        className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline"
                      >
                        {showPasswords[row.id] ? "yashir" : "ko'rish"}
                      </button>
                      <button
                        onClick={() => copyId(row.studentId, row.password)}
                        className="text-[var(--muted-foreground)] hover:text-[#1E3A5F]"
                        title="ID va parolni nusxalash"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-[var(--muted-foreground)]">
                      {row.groups > 0 ? `${row.groups} ta guruh` : "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(row.status)}`}>
                      {getStatusLabel(row.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-[var(--muted-foreground)]">{formatDate(row.createdAt)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-end">
                      <Link href={`/admin/students/${row.id}`}>
                        <Button variant="ghost" size="icon-sm" title="Ko'rish">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon-sm" title="Tahrirlash">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" size="icon-sm" title="O'chirish"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(row.id)}
                      >
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

      {filtered.length > pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[var(--muted-foreground)]">
          <div className="flex items-center gap-2">
            <span>Sahifada:</span>
            <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setPage(1); }}>
              <SelectTrigger className="h-8 w-16"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
            <span>Jami: {filtered.length} ta</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>‹</Button>
            <span className="px-2">{page} / {totalPages}</span>
            <Button variant="outline" size="icon-sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>›</Button>
          </div>
        </div>
      )}
    </div>
  );
}
