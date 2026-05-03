"use client";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, FileText, Download, CheckSquare, Eye } from "lucide-react";
import { homeworkApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import type { HomeworkAssignment } from "@/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const mockHomework: HomeworkAssignment[] = [
  { id: "1", groupId: "1", teacherId: "1", title: "Unit 5 - Grammar mashqlari", description: "Past Simple va Present Perfect farqi", dueDate: "2025-01-25", createdAt: "2025-01-20T00:00:00Z" },
  { id: "2", groupId: "2", teacherId: "2", title: "Kvadrat tenglamalar", description: "1-10 mashqlar, formula bilan yechish", dueDate: "2025-01-26", createdAt: "2025-01-21T00:00:00Z" },
  { id: "3", groupId: "3", teacherId: "3", title: "Nyuton qonunlari", description: "Misollar 15-25", dueDate: "2025-01-27", createdAt: "2025-01-22T00:00:00Z" },
  { id: "4", groupId: "1", teacherId: "1", title: "Speaking practice", description: "3 daqiqa ovozli xabar", dueDate: "2025-01-30", createdAt: "2025-01-23T00:00:00Z" },
];

const hwSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  groupId: z.string().min(1),
  dueDate: z.string().min(1),
});
type HWFormData = z.infer<typeof hwSchema>;

export default function HomeworkPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [showModal, setShowModal] = React.useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["homework"],
    queryFn: () => homeworkApi.getAll().then((r) => r.data),
    placeholderData: mockHomework,
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<HWFormData>({
    resolver: zodResolver(hwSchema),
    defaultValues: { groupId: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: HWFormData) => homeworkApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homework"] });
      toast.success("Vazifa yaratildi");
      setShowModal(false);
      reset();
    },
  });

  const homework = Array.isArray(data) ? data : mockHomework;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Uy vazifalari va Kontent</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Vazifalar va materiallar boshqaruvi</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4" />Yangi vazifa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}><CardContent className="pt-5"><div className="h-24 bg-[var(--muted)] rounded animate-pulse" /></CardContent></Card>
            ))
          : homework.map((hw: HomeworkAssignment) => {
              const isOverdue = new Date(hw.dueDate) < new Date();
              return (
                <Card key={hw.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-[#1E3A5F]/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-[#1E3A5F]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm truncate">{hw.title}</CardTitle>
                          <p className="text-xs text-[var(--muted-foreground)]">Guruh {hw.groupId}</p>
                        </div>
                      </div>
                      <Badge variant={isOverdue ? "destructive" : "success"} className="shrink-0">
                        {isOverdue ? "Muddati o'tgan" : "Aktiv"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {hw.description && (
                      <p className="text-xs text-[var(--muted-foreground)] mb-3 line-clamp-2">{hw.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                      <span>Muddat: {formatDate(hw.dueDate)}</span>
                      <span>{formatRelativeTime(hw.createdAt)}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => router.push(`/admin/homework/${hw.id}`)}>
                        <Eye className="h-3 w-3" />Ko'rish
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <CheckSquare className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent size="md">
          <DialogHeader><DialogTitle>Yangi uy vazifasi</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
            <div className="p-6 space-y-4">
              <Input label="Sarlavha *" error={errors.title?.message} {...register("title")} />
              <div>
                <label className="block text-sm font-medium mb-1.5">Guruh *</label>
                <Select value={watch("groupId")} onValueChange={(v) => setValue("groupId", v)}>
                  <SelectTrigger><SelectValue placeholder="Guruh tanlang" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ingliz tili A2</SelectItem>
                    <SelectItem value="2">Matematika B1</SelectItem>
                    <SelectItem value="3">Fizika A1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input label="Muddat *" type="date" error={errors.dueDate?.message} {...register("dueDate")} />
              <Textarea label="Tavsif" rows={3} {...register("description")} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Bekor qilish</Button>
              <Button type="submit" loading={mutation.isPending}>Yaratish</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
