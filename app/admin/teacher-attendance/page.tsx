"use client";
import React from "react";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import toast from "react-hot-toast";

type AttStatus = "ON_TIME" | "LATE" | "ABSENT";

interface TeacherAtt { id: number; teacherName: string; date: string; checkIn?: string; checkOut?: string; status: AttStatus; }

const statusConfig: Record<AttStatus, { label: string; variant: "success" | "warning" | "destructive"; icon: React.ReactNode }> = {
  ON_TIME: { label: "O'z vaqtida", variant: "success",     icon: <CheckCircle className="h-4 w-4 text-green-600" /> },
  LATE:    { label: "Kechikkan",   variant: "warning",     icon: <AlertCircle className="h-4 w-4 text-amber-500" /> },
  ABSENT:  { label: "Kelmagan",    variant: "destructive", icon: <XCircle className="h-4 w-4 text-red-500" /> },
};

const dates = ["2025-01-28", "2025-01-27", "2025-01-26", "2025-01-25", "2025-01-24"];

const allAttendance: TeacherAtt[] = [
  { id: 1,  teacherName: "Aziz Karimov",    date: "2025-01-28", checkIn: "08:55", checkOut: "17:00", status: "ON_TIME" },
  { id: 2,  teacherName: "Sardor Toshmatov",date: "2025-01-28", checkIn: "09:15", checkOut: "17:10", status: "LATE" },
  { id: 3,  teacherName: "Malika Yusupova", date: "2025-01-28", status: "ABSENT" },
  { id: 4,  teacherName: "Jasur Karimov",   date: "2025-01-28", checkIn: "08:50", checkOut: "17:00", status: "ON_TIME" },
  { id: 5,  teacherName: "Aziz Karimov",    date: "2025-01-27", checkIn: "09:00", checkOut: "17:00", status: "ON_TIME" },
  { id: 6,  teacherName: "Sardor Toshmatov",date: "2025-01-27", checkIn: "09:00", checkOut: "17:05", status: "ON_TIME" },
  { id: 7,  teacherName: "Malika Yusupova", date: "2025-01-27", checkIn: "09:20", checkOut: "17:00", status: "LATE" },
  { id: 8,  teacherName: "Jasur Karimov",   date: "2025-01-27", checkIn: "09:00", checkOut: "17:00", status: "ON_TIME" },
];

export default function TeacherAttendancePage() {
  const [selectedDate, setSelectedDate] = React.useState(dates[0]);
  const [attendance, setAttendance] = React.useState(allAttendance);

  const todayRecords = attendance.filter(a => a.date === selectedDate);
  const onTime = todayRecords.filter(a => a.status === "ON_TIME").length;
  const late = todayRecords.filter(a => a.status === "LATE").length;
  const absent = todayRecords.filter(a => a.status === "ABSENT").length;

  const handleMarkCheckIn = (id: number) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const isLate = now.getHours() >= 9 && now.getMinutes() > 5;
    setAttendance(prev => prev.map(a => a.id === id ? { ...a, checkIn: time, status: isLate ? "LATE" : "ON_TIME" } : a));
    toast.success("Kirish vaqti belgilandi");
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">O'qituvchilar davomati</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Kunlik kirish/chiqish vaqtlari</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {dates.map(d => (
          <button key={d} onClick={() => setSelectedDate(d)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedDate === d ? "bg-[#1E3A5F] text-white" : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"}`}>
            {d}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-2xl font-bold text-green-600">{onTime}</p><p className="text-xs text-[var(--muted-foreground)]">O'z vaqtida</p></CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-2xl font-bold text-amber-500">{late}</p><p className="text-xs text-[var(--muted-foreground)]">Kechikkan</p></CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-2xl font-bold text-red-500">{absent}</p><p className="text-xs text-[var(--muted-foreground)]">Kelmagan</p></CardContent></Card>
      </div>

      <div className="space-y-2">
        {todayRecords.map(a => {
          const cfg = statusConfig[a.status];
          return (
            <div key={a.id} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-4">
              <UserAvatar name={a.teacherName} size="md" className="shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{a.teacherName}</p>
                <div className="flex gap-3 mt-1 text-xs text-[var(--muted-foreground)]">
                  {a.checkIn ? (
                    <>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Kirdi: {a.checkIn}</span>
                      {a.checkOut && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Chiqdi: {a.checkOut}</span>}
                    </>
                  ) : (
                    <span>Hali kelmagan</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={cfg.variant}>{cfg.label}</Badge>
                {!a.checkIn && (
                  <button onClick={() => handleMarkCheckIn(a.id)} className="text-xs text-[#1E3A5F] hover:underline font-medium">Belgilash</button>
                )}
              </div>
            </div>
          );
        })}
        {todayRecords.length === 0 && <div className="text-center text-[var(--muted-foreground)] py-12">Bu sana uchun ma'lumot yo'q</div>}
      </div>
    </div>
  );
}
