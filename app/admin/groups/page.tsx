"use client";
import React from "react";
import { Plus, Eye, Pencil, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";
import toast from "react-hot-toast";

interface GroupRow {
  id: string;
  name: string;
  teacher: string;
  level: string;
  currentCount: number;
  capacity: number;
  monthlyFee: number;
  status: "ACTIVE" | "FULL" | "CLOSED";
}

const initialGroups: GroupRow[] = Array.from({ length: 15 }, (_, i) => ({
  id: String(i + 1),
  name: `${["Ingliz tili", "Matematika", "Fizika", "Rus tili", "IT"][i % 5]} — ${["A1", "A2", "B1", "B2", "C1"][i % 5]}`,
  teacher: ["Sardor Aliyev", "Nilufar Tosheva", "Husan Karimov", "Dilnoza Yusupova"][i % 4],
  level: ["Boshlang'ich", "O'rta", "Yuqori"][i % 3],
  currentCount: 5 + (i % 8),
  capacity: 12,
  monthlyFee: 400000 + (i % 5) * 100000,
  status: (["ACTIVE", "ACTIVE", "ACTIVE", "FULL", "CLOSED"] as const)[i % 5],
}));

export default function GroupsPage() {
  const [groups, setGroups] = React.useState(initialGroups);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");

  const filtered = groups.filter(g =>
    (g.name.toLowerCase().includes(search.toLowerCase()) || g.teacher.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "ALL" || g.status === statusFilter)
  );

  const handleDelete = (id: string) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    setGroups(prev => prev.filter(g => g.id !== id));
    toast.success("Guruh o'chirildi");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Guruhlar</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Jami {filtered.length} ta guruh</p>
        </div>
        <Link href="/admin/groups/new">
          <Button size="sm"><Plus className="h-4 w-4" />Yangi guruh</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] max-w-xs">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Guruh yoki o'qituvchi..." />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Barchasi</SelectItem>
            <SelectItem value="ACTIVE">Aktiv</SelectItem>
            <SelectItem value="FULL">To'lgan</SelectItem>
            <SelectItem value="CLOSED">Yopilgan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Guruh nomi</TableHead>
              <TableHead>O'qituvchi</TableHead>
              <TableHead>O'quvchilar</TableHead>
              <TableHead>Oylik to'lov</TableHead>
              <TableHead>Holat</TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-[var(--muted-foreground)]">
                  Guruhlar topilmadi
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(row => (
                <TableRow key={row.id}>
                  <TableCell>
                    <p className="font-medium text-sm">{row.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{row.level}</p>
                  </TableCell>
                  <TableCell><span className="text-sm">{row.teacher}</span></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                      <span className="text-sm">{row.currentCount} / {row.capacity}</span>
                      <div className="w-16 h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
                        <div className="h-full bg-[#1E3A5F] rounded-full"
                          style={{ width: `${(row.currentCount / row.capacity) * 100}%` }} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-sm font-medium">{formatCurrency(row.monthlyFee)}</span></TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(row.status)}`}>
                      {getStatusLabel(row.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-end">
                      <Link href={`/admin/groups/${row.id}`}>
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
