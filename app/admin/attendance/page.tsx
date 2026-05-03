"use client";
import React from "react";
import { CheckCircle, XCircle, Clock, AlertCircle, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/ui/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserAvatar } from "@/components/ui/avatar";
import { formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import type { AttendanceStatus } from "@/types";
import toast from "react-hot-toast";

const mockAttendanceList = [
  { studentId: "1", studentName: "Alibek Karimov", status: "PRESENT" as AttendanceStatus, date: new Date().toISOString().split("T")[0] },
  { studentId: "2", studentName: "Malika Toshmatova", status: "ABSENT" as AttendanceStatus, date: new Date().toISOString().split("T")[0] },
  { studentId: "3", studentName: "Jasur Yusupov", status: "LATE" as AttendanceStatus, date: new Date().toISOString().split("T")[0] },
  { studentId: "4", studentName: "Zulfiya Abdullayeva", status: "PRESENT" as AttendanceStatus, date: new Date().toISOString().split("T")[0] },
  { studentId: "5", studentName: "Bobur Nazarov", status: "PRESENT" as AttendanceStatus, date: new Date().toISOString().split("T")[0] },
  { studentId: "6", studentName: "Umida Yusupova", status: "EXCUSED" as AttendanceStatus, date: new Date().toISOString().split("T")[0] },
  { studentId: "7", studentName: "Sherzod Karimov", status: "PRESENT" as AttendanceStatus, date: new Date().toISOString().split("T")[0] },
  { studentId: "8", studentName: "Nodira Tosheva", status: "ABSENT" as AttendanceStatus, date: new Date().toISOString().split("T")[0] },
];

export default function AttendancePage() {
  const [selectedGroup, setSelectedGroup] = React.useState("ALL");
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [attendanceMap, setAttendanceMap] = React.useState<Record<string, AttendanceStatus>>(() =>
    Object.fromEntries(mockAttendanceList.map((a) => [a.studentId, a.status]))
  );

  const present = Object.values(attendanceMap).filter((s) => s === "PRESENT").length;
  const absent = Object.values(attendanceMap).filter((s) => s === "ABSENT").length;
  const late = Object.values(attendanceMap).filter((s) => s === "LATE").length;
  const excused = Object.values(attendanceMap).filter((s) => s === "EXCUSED").length;
  const total = Object.keys(attendanceMap).length;

  const handleSave = () => toast.success("Davomat saqlandi");

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const StatusButton = ({ studentId, status }: { studentId: string; status: AttendanceStatus }) => {
    const current = attendanceMap[studentId];
    const configs: Record<AttendanceStatus, { icon: React.ReactNode; label: string; active: string; inactive: string }> = {
      PRESENT: { icon: <CheckCircle className="h-4 w-4" />, label: "Keldi", active: "bg-green-600 text-white", inactive: "bg-green-50 text-green-700 hover:bg-green-100" },
      ABSENT: { icon: <XCircle className="h-4 w-4" />, label: "Kelmadi", active: "bg-red-500 text-white", inactive: "bg-red-50 text-red-700 hover:bg-red-100" },
      LATE: { icon: <Clock className="h-4 w-4" />, label: "Kech", active: "bg-amber-500 text-white", inactive: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
      EXCUSED: { icon: <AlertCircle className="h-4 w-4" />, label: "Sababli", active: "bg-blue-600 text-white", inactive: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
    };
    const config = configs[status];
    return (
      <button
        onClick={() => handleStatusChange(studentId, status)}
        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${current === status ? config.active : config.inactive}`}
      >
        {config.icon}
        {config.label}
      </button>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Davomat</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Davomat belgilash va hisobotlar</p>
        </div>
        <Button onClick={handleSave}>
          <ClipboardCheck className="h-4 w-4" />
          Saqlash
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="h-9 px-3 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
        />
        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger className="w-48 h-9">
            <SelectValue placeholder="Guruh tanlang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Barchasi</SelectItem>
            <SelectItem value="1">Ingliz tili A2</SelectItem>
            <SelectItem value="2">Matematika B1</SelectItem>
            <SelectItem value="3">Fizika A1</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <StatCard title="Keldi" value={`${present}/${total}`} icon={<CheckCircle className="h-5 w-5" />} iconBg="bg-green-100" />
        <StatCard title="Kelmadi" value={absent} icon={<XCircle className="h-5 w-5" />} iconBg="bg-red-100" />
        <StatCard title="Kech qoldi" value={late} icon={<Clock className="h-5 w-5" />} iconBg="bg-amber-100" />
        <StatCard title="Sababli" value={excused} icon={<AlertCircle className="h-5 w-5" />} iconBg="bg-blue-100" />
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bugungi davomat — {formatDate(selectedDate)}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>O'quvchi</TableHead>
                <TableHead>Holat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAttendanceList.map((a) => (
                <TableRow key={a.studentId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserAvatar name={a.studentName} size="sm" />
                      <span className="font-medium text-sm">{a.studentName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {(["PRESENT", "ABSENT", "LATE", "EXCUSED"] as AttendanceStatus[]).map((s) => (
                        <StatusButton key={s} studentId={a.studentId} status={s} />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
