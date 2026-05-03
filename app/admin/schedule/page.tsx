"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { schedulesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDayShort, getStatusLabel } from "@/lib/utils";
import type { Schedule } from "@/types";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
const DAY_COLORS: Record<string, string> = {
  "Ingliz tili": "bg-blue-100 text-blue-800 border-blue-200",
  "Matematika": "bg-purple-100 text-purple-800 border-purple-200",
  "Fizika": "bg-amber-100 text-amber-800 border-amber-200",
  "Rus tili": "bg-green-100 text-green-800 border-green-200",
  "IT": "bg-pink-100 text-pink-800 border-pink-200",
};

const mockSchedules: Schedule[] = [
  { id: "1", groupId: "1", group: { id: "1", name: "Ingliz tili A2", subjectId: "1", subject: { id: "1", name: "Ingliz tili" }, teacherId: "1", teacher: { id: "1", userId: "", fullName: "Sardor Aliyev", phone: "", subjects: [], salaryType: "MONTHLY", salary: 0, createdAt: "", updatedAt: "" }, capacity: 12, monthlyFee: 500000, status: "ACTIVE", createdAt: "", updatedAt: "" }, dayOfWeek: "MON", startTime: "09:00", endTime: "11:00", room: "201-xona" },
  { id: "2", groupId: "2", group: { id: "2", name: "Matematika B1", subjectId: "2", subject: { id: "2", name: "Matematika" }, teacherId: "2", teacher: { id: "2", userId: "", fullName: "Nilufar Tosheva", phone: "", subjects: [], salaryType: "MONTHLY", salary: 0, createdAt: "", updatedAt: "" }, capacity: 12, monthlyFee: 600000, status: "ACTIVE", createdAt: "", updatedAt: "" }, dayOfWeek: "MON", startTime: "11:00", endTime: "13:00", room: "301-xona" },
  { id: "3", groupId: "3", group: { id: "3", name: "Fizika A1", subjectId: "3", subject: { id: "3", name: "Fizika" }, teacherId: "3", teacher: { id: "3", userId: "", fullName: "Husan Karimov", phone: "", subjects: [], salaryType: "MONTHLY", salary: 0, createdAt: "", updatedAt: "" }, capacity: 10, monthlyFee: 550000, status: "ACTIVE", createdAt: "", updatedAt: "" }, dayOfWeek: "TUE", startTime: "09:00", endTime: "11:00", room: "102-xona" },
  { id: "4", groupId: "1", group: { id: "1", name: "Ingliz tili A2", subjectId: "1", subject: { id: "1", name: "Ingliz tili" }, teacherId: "1", teacher: { id: "1", userId: "", fullName: "Sardor Aliyev", phone: "", subjects: [], salaryType: "MONTHLY", salary: 0, createdAt: "", updatedAt: "" }, capacity: 12, monthlyFee: 500000, status: "ACTIVE", createdAt: "", updatedAt: "" }, dayOfWeek: "WED", startTime: "09:00", endTime: "11:00", room: "201-xona" },
  { id: "5", groupId: "4", group: { id: "4", name: "Rus tili C1", subjectId: "4", subject: { id: "4", name: "Rus tili" }, teacherId: "4", teacher: { id: "4", userId: "", fullName: "Dilnoza Yusupova", phone: "", subjects: [], salaryType: "MONTHLY", salary: 0, createdAt: "", updatedAt: "" }, capacity: 8, monthlyFee: 450000, status: "ACTIVE", createdAt: "", updatedAt: "" }, dayOfWeek: "WED", startTime: "14:00", endTime: "16:00", room: "205-xona" },
  { id: "6", groupId: "2", group: { id: "2", name: "Matematika B1", subjectId: "2", subject: { id: "2", name: "Matematika" }, teacherId: "2", teacher: { id: "2", userId: "", fullName: "Nilufar Tosheva", phone: "", subjects: [], salaryType: "MONTHLY", salary: 0, createdAt: "", updatedAt: "" }, capacity: 12, monthlyFee: 600000, status: "ACTIVE", createdAt: "", updatedAt: "" }, dayOfWeek: "THU", startTime: "11:00", endTime: "13:00", room: "301-xona" },
  { id: "7", groupId: "5", group: { id: "5", name: "IT Asoslari", subjectId: "5", subject: { id: "5", name: "IT" }, teacherId: "1", teacher: { id: "1", userId: "", fullName: "Sardor Aliyev", phone: "", subjects: [], salaryType: "MONTHLY", salary: 0, createdAt: "", updatedAt: "" }, capacity: 15, monthlyFee: 700000, status: "ACTIVE", createdAt: "", updatedAt: "" }, dayOfWeek: "FRI", startTime: "09:00", endTime: "12:00", room: "Lab-1" },
  { id: "8", groupId: "3", group: { id: "3", name: "Fizika A1", subjectId: "3", subject: { id: "3", name: "Fizika" }, teacherId: "3", teacher: { id: "3", userId: "", fullName: "Husan Karimov", phone: "", subjects: [], salaryType: "MONTHLY", salary: 0, createdAt: "", updatedAt: "" }, capacity: 10, monthlyFee: 550000, status: "ACTIVE", createdAt: "", updatedAt: "" }, dayOfWeek: "FRI", startTime: "14:00", endTime: "16:00", room: "102-xona" },
];

export default function SchedulePage() {
  const { data } = useQuery({
    queryKey: ["schedules-weekly"],
    queryFn: () => schedulesApi.getWeekly().then((r) => r.data),
    placeholderData: mockSchedules,
  });

  const schedules = (Array.isArray(data) ? data : mockSchedules) as Schedule[];

  const getSchedulesForDay = (day: string) =>
    schedules.filter((s) => s.dayOfWeek === day);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Dars jadvali</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Haftalik ko'rinish</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4" />Dars qo'shish</Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(DAY_COLORS).map(([subject, color]) => (
          <span key={subject} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${color}`}>
            {subject}
          </span>
        ))}
      </div>

      {/* Weekly Calendar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {DAYS.map((day) => {
          const daySchedules = getSchedulesForDay(day);
          return (
            <div key={day} className="space-y-2">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase text-[var(--muted-foreground)] mb-1">{getDayShort(day)}</p>
                <div className={`w-full h-0.5 rounded-full ${daySchedules.length > 0 ? "bg-[#1E3A5F]" : "bg-[var(--border)]"}`} />
              </div>
              <div className="space-y-2 min-h-[200px]">
                {daySchedules.length === 0 ? (
                  <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-[var(--border)] text-xs text-[var(--muted-foreground)]">
                    Dars yo'q
                  </div>
                ) : (
                  daySchedules.map((schedule) => {
                    const subjectName = schedule.group?.subject?.name || "";
                    const colorClass = DAY_COLORS[subjectName] || "bg-gray-100 text-gray-800 border-gray-200";
                    return (
                      <div
                        key={schedule.id}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer hover:shadow-sm transition-shadow ${colorClass}`}
                      >
                        <p className="font-semibold truncate">{schedule.group?.name}</p>
                        <p className="mt-0.5 opacity-80">{schedule.startTime}–{schedule.endTime}</p>
                        <p className="opacity-80 truncate">{schedule.group?.teacher?.fullName}</p>
                        {schedule.room && <p className="opacity-60">{schedule.room}</p>}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* List View */}
      <Card>
        <CardHeader>
          <CardTitle>Barcha darslar ro'yxati</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {schedules.map((s) => (
              <div key={s.id} className="flex items-center gap-4 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors">
                <div className="w-12 text-center">
                  <p className="text-xs font-semibold text-[#1E3A5F]">{getDayShort(s.dayOfWeek)}</p>
                </div>
                <div className="w-24 text-xs text-[var(--muted-foreground)]">
                  {s.startTime} – {s.endTime}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{s.group?.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{s.group?.teacher?.fullName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--muted-foreground)]">{s.room}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
