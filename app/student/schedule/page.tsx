"use client";
import React from "react";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DAYS = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
const DAY_SHORT = ["Du", "Se", "Ch", "Pa", "Ju", "Sh"];

interface Lesson {
  id: string;
  day: number;
  time: string;
  group: string;
  teacher: string;
  room: string;
  subject: string;
  color: string;
}

const schedule: Lesson[] = [
  { id: "1", day: 0, time: "09:00–11:00", group: "Ingliz tili A2", teacher: "Aziz Karimov", room: "201-xona", subject: "Ingliz tili", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { id: "2", day: 2, time: "09:00–11:00", group: "Ingliz tili A2", teacher: "Aziz Karimov", room: "201-xona", subject: "Ingliz tili", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { id: "3", day: 4, time: "09:00–11:00", group: "Ingliz tili A2", teacher: "Aziz Karimov", room: "201-xona", subject: "Ingliz tili", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { id: "4", day: 1, time: "14:00–16:00", group: "Speaking Club", teacher: "Aziz Karimov", room: "205-xona", subject: "Ingliz tili", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { id: "5", day: 3, time: "14:00–16:00", group: "Speaking Club", teacher: "Aziz Karimov", room: "205-xona", subject: "Ingliz tili", color: "bg-purple-100 text-purple-800 border-purple-200" },
];

const todayDayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

export default function StudentSchedulePage() {
  const [view, setView] = React.useState<"week" | "list">("week");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Dars jadvali</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Haftalik dars jadvalim</p>
        </div>
        <div className="flex gap-1 bg-[var(--muted)] rounded-lg p-1">
          <button onClick={() => setView("week")} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${view === "week" ? "bg-[var(--card)] shadow-sm" : "text-[var(--muted-foreground)]"}`}>
            Haftalik
          </button>
          <button onClick={() => setView("list")} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${view === "list" ? "bg-[var(--card)] shadow-sm" : "text-[var(--muted-foreground)]"}`}>
            Ro'yxat
          </button>
        </div>
      </div>

      {view === "week" ? (
        <div className="grid grid-cols-6 gap-2">
          {DAYS.map((day, idx) => {
            const dayLessons = schedule.filter(s => s.day === idx);
            const isToday = idx === todayDayIndex;
            return (
              <div key={idx} className={`rounded-xl border ${isToday ? "border-[#1E3A5F] bg-[#1E3A5F]/5" : "border-[var(--border)] bg-[var(--card)]"}`}>
                <div className={`p-2 text-center border-b ${isToday ? "border-[#1E3A5F]/20" : "border-[var(--border)]"}`}>
                  <p className={`text-xs font-semibold ${isToday ? "text-[#1E3A5F]" : "text-[var(--muted-foreground)]"}`}>{DAY_SHORT[idx]}</p>
                  {isToday && <div className="h-1 w-1 bg-[#1E3A5F] rounded-full mx-auto mt-0.5" />}
                </div>
                <div className="p-1.5 space-y-1.5 min-h-[80px]">
                  {dayLessons.map(l => (
                    <div key={l.id} className={`rounded-lg border px-1.5 py-1 ${l.color}`}>
                      <p className="text-xs font-medium leading-tight truncate">{l.group}</p>
                      <p className="text-xs opacity-70">{l.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {DAYS.map((day, idx) => {
            const dayLessons = schedule.filter(s => s.day === idx);
            if (dayLessons.length === 0) return null;
            const isToday = idx === todayDayIndex;
            return (
              <Card key={idx} className={isToday ? "ring-2 ring-[#1E3A5F]" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {day}
                    {isToday && <Badge variant="default">Bugun</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-[var(--border)]">
                    {dayLessons.map(l => (
                      <div key={l.id} className="flex items-center gap-4 px-5 py-4">
                        <div className="w-24 text-xs font-medium text-[#1E3A5F] bg-[#1E3A5F]/10 rounded-lg px-2 py-1 text-center">{l.time}</div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{l.group}</p>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-[var(--muted-foreground)]">
                            <span className="flex items-center gap-1"><User className="h-3 w-3" />{l.teacher}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{l.room}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
