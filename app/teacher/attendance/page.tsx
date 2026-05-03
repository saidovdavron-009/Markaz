"use client";
import React from "react";
import { CheckCircle, XCircle, Clock, AlertCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserAvatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import type { AttendanceStatus } from "@/types";
import toast from "react-hot-toast";

const groupStudents = [
  { id: "1", name: "Alibek Karimov" },
  { id: "2", name: "Malika Toshmatova" },
  { id: "3", name: "Jasur Yusupov" },
  { id: "4", name: "Zulfiya Abdullayeva" },
  { id: "5", name: "Bobur Nazarov" },
  { id: "6", name: "Umida Yusupova" },
  { id: "7", name: "Sherzod Karimov" },
  { id: "8", name: "Nodira Tosheva" },
];

export default function TeacherAttendancePage() {
  const [group, setGroup] = React.useState("1");
  const [date, setDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = React.useState<Record<string, AttendanceStatus>>(() =>
    Object.fromEntries(groupStudents.map(s => [s.id, "PRESENT" as AttendanceStatus]))
  );

  const mark = (id: string, status: AttendanceStatus) =>
    setAttendance(prev => ({ ...prev, [id]: status }));

  const handleSave = () => toast.success("Davomat saqlandi");

  const allPresent = () =>
    setAttendance(Object.fromEntries(groupStudents.map(s => [s.id, "PRESENT" as AttendanceStatus])));

  const statusConfigs = [
    { status: "PRESENT" as AttendanceStatus, label: "Keldi", icon: <CheckCircle className="h-4 w-4" />, active: "bg-green-600 text-white", inactive: "bg-green-50 text-green-700 hover:bg-green-100" },
    { status: "ABSENT" as AttendanceStatus, label: "Kelmadi", icon: <XCircle className="h-4 w-4" />, active: "bg-red-500 text-white", inactive: "bg-red-50 text-red-700 hover:bg-red-100" },
    { status: "LATE" as AttendanceStatus, label: "Kech", icon: <Clock className="h-4 w-4" />, active: "bg-amber-500 text-white", inactive: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
    { status: "EXCUSED" as AttendanceStatus, label: "Sababli", icon: <AlertCircle className="h-4 w-4" />, active: "bg-blue-600 text-white", inactive: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
  ];

  const presentCount = Object.values(attendance).filter(s => s === "PRESENT").length;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Davomat belgilash</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{formatDate(date)}</p>
        </div>
        <Button onClick={handleSave}><Save className="h-4 w-4" />Saqlash</Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={group} onValueChange={setGroup}>
          <SelectTrigger className="w-48 h-9">
            <SelectValue placeholder="Guruh" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Ingliz tili A2</SelectItem>
            <SelectItem value="2">Ingliz tili B1</SelectItem>
            <SelectItem value="3">Speaking Club</SelectItem>
          </SelectContent>
        </Select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          className="h-9 px-3 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]" />
        <Button variant="outline" size="sm" onClick={allPresent}>Barchasi keldi</Button>
      </div>

      <div className="flex gap-4 text-sm">
        <span className="text-green-600 font-medium">{presentCount} keldi</span>
        <span className="text-red-500">{Object.values(attendance).filter(s => s === "ABSENT").length} kelmadi</span>
        <span className="text-amber-600">{Object.values(attendance).filter(s => s === "LATE").length} kech</span>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {groupStudents.map((s, idx) => (
              <div key={s.id} className="flex items-center gap-3 px-5 py-3">
                <span className="text-xs text-[var(--muted-foreground)] w-5">{idx + 1}</span>
                <UserAvatar name={s.name} size="sm" />
                <span className="flex-1 text-sm font-medium">{s.name}</span>
                <div className="flex gap-1.5">
                  {statusConfigs.map(({ status, label, icon, active, inactive }) => (
                    <button key={status} onClick={() => mark(s.id, status)}
                      title={label}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${attendance[s.id] === status ? active : inactive}`}>
                      {icon}
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
