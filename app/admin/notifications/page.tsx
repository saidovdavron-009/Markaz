"use client";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { Send, Bell, MessageSquare, Mail, Smartphone } from "lucide-react";
import { notificationsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const mockNotifications = [
  { id: "1", type: "SMS", title: "To'lov eslatmasi", message: "Oylik to'lovingiz muddati yaqinlashdi", isRead: false, sentAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "2", type: "TELEGRAM", title: "Davomat", message: "Farzandingiz darsga kelmadi", isRead: false, sentAt: new Date(Date.now() - 7200000).toISOString() },
  { id: "3", type: "IN_APP", title: "Yangi baho", message: "Matematika darsidan 85 ball oldingiz", isRead: true, sentAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "4", type: "SMS", title: "Jadval o'zgarishi", message: "Ertangi dars vaqti o'zgardi", isRead: true, sentAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "5", type: "EMAIL", title: "Hisobot", message: "Oylik hisobot tayyor", isRead: true, sentAt: new Date(Date.now() - 259200000).toISOString() },
];

const sendSchema = z.object({
  recipient: z.enum(["ALL", "GROUP", "INDIVIDUAL"]),
  groupId: z.string().optional(),
  studentId: z.string().optional(),
  channel: z.enum(["SMS", "TELEGRAM", "EMAIL", "IN_APP"]),
  title: z.string().min(1, "Sarlavha kiriting"),
  message: z.string().min(1, "Xabar kiriting"),
});
type SendFormData = z.infer<typeof sendSchema>;

const typeIcons: Record<string, React.ReactNode> = {
  SMS: <Smartphone className="h-4 w-4" />,
  TELEGRAM: <MessageSquare className="h-4 w-4" />,
  EMAIL: <Mail className="h-4 w-4" />,
  IN_APP: <Bell className="h-4 w-4" />,
};
const typeBg: Record<string, string> = {
  SMS: "bg-blue-100 text-blue-700",
  TELEGRAM: "bg-sky-100 text-sky-700",
  EMAIL: "bg-purple-100 text-purple-700",
  IN_APP: "bg-amber-100 text-amber-700",
};

export default function NotificationsPage() {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<SendFormData>({
    resolver: zodResolver(sendSchema),
    defaultValues: { recipient: "ALL", channel: "SMS" },
  });

  const mutation = useMutation({
    mutationFn: (data: SendFormData) => notificationsApi.sendBulk(data),
    onSuccess: () => {
      toast.success("Xabar yuborildi");
      reset();
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Bildirishnomalar va Xabarlar</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">SMS, Telegram, Email va tizim xabarlari</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Send Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Send className="h-4 w-4" />Xabar yuborish</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Kimga</label>
                  <Select value={watch("recipient")} onValueChange={(v) => setValue("recipient", v as "ALL" | "GROUP" | "INDIVIDUAL")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Barcha o'quvchilar</SelectItem>
                      <SelectItem value="GROUP">Guruh</SelectItem>
                      <SelectItem value="INDIVIDUAL">Alohida o'quvchi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {watch("recipient") === "GROUP" && (
                  <Input label="Guruh ID" placeholder="Guruh tanlang" {...register("groupId")} />
                )}
                {watch("recipient") === "INDIVIDUAL" && (
                  <Input label="O'quvchi ID" placeholder="O'quvchi tanlang" {...register("studentId")} />
                )}

                <div>
                  <label className="block text-sm font-medium mb-1.5">Kanal</label>
                  <Select value={watch("channel")} onValueChange={(v) => setValue("channel", v as "SMS" | "TELEGRAM" | "EMAIL" | "IN_APP")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="TELEGRAM">Telegram</SelectItem>
                      <SelectItem value="EMAIL">Email</SelectItem>
                      <SelectItem value="IN_APP">Tizim ichida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Input label="Sarlavha *" error={errors.title?.message} {...register("title")} />
                <Textarea label="Xabar *" rows={4} error={errors.message?.message} {...register("message")} />

                <Button type="submit" className="w-full" loading={mutation.isPending}>
                  <Send className="h-4 w-4" />
                  Yuborish
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Notification List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>So'nggi xabarlar</CardTitle>
                <Badge variant="secondary">{mockNotifications.filter(n => !n.isRead).length} yangi</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--border)]">
                {mockNotifications.map((n) => (
                  <div key={n.id} className={`flex items-start gap-3 px-5 py-4 ${!n.isRead ? "bg-[#1E3A5F]/5" : ""}`}>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${typeBg[n.type]}`}>
                      {typeIcons[n.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{n.title}</p>
                        {!n.isRead && <span className="h-2 w-2 rounded-full bg-[#1E3A5F] shrink-0" />}
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{n.message}</p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">{formatRelativeTime(n.sentAt)}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBg[n.type]}`}>{n.type}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
