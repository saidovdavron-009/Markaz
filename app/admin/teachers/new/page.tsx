"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { teachersApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateTempPassword } from "@/lib/utils";
import toast from "react-hot-toast";

const teacherSchema = z.object({
  fullName: z.string().min(3, "Ism kamida 3 ta belgi"),
  phone: z.string().min(9, "Telefon raqam kiriting"),
  email: z.string().email("Noto'g'ri email").optional().or(z.literal("")),
  subjects: z.string().min(1, "Fan kiriting"),
  experience: z.number().min(0).optional(),
  salaryType: z.enum(["HOURLY", "MONTHLY"]),
  salary: z.number().min(0, "Ish haqi kiriting"),
  bio: z.string().optional(),
  tempPassword: z.string().min(8, "Parol kamida 8 ta belgi"),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

export default function NewTeacherPage() {
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      salaryType: "MONTHLY",
      tempPassword: generateTempPassword(),
    },
  });

  const mutation = useMutation({
    mutationFn: (data: TeacherFormData) =>
      teachersApi.create({ ...data, subjects: data.subjects.split(",").map((s) => s.trim()) }),
    onSuccess: () => {
      toast.success("O'qituvchi muvaffaqiyatli qo'shildi");
      router.push("/admin/teachers");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/teachers">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Yangi o'qituvchi</h1>
          <p className="text-sm text-[var(--muted-foreground)]">O'qituvchi akkauntini yarating</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Shaxsiy ma'lumotlar</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input label="To'liq ismi *" placeholder="Ism Familya" error={errors.fullName?.message} {...register("fullName")} />
            </div>
            <Input label="Telefon *" placeholder="+998 90 123 45 67" error={errors.phone?.message} {...register("phone")} />
            <Input label="Email" type="email" placeholder="email@example.com" error={errors.email?.message} {...register("email")} />
            <div className="sm:col-span-2">
              <Input
                label="Fanlar * (vergul bilan ajrating)"
                placeholder="Ingliz tili, Matematika"
                error={errors.subjects?.message}
                {...register("subjects")}
              />
            </div>
            <Input
              label="Tajriba (yil)"
              type="number"
              placeholder="5"
              error={errors.experience?.message}
              {...register("experience", { valueAsNumber: true })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Ish haqi</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Ish haqi turi</label>
              <Select value={watch("salaryType")} onValueChange={(v) => setValue("salaryType", v as "HOURLY" | "MONTHLY")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Oylik</SelectItem>
                  <SelectItem value="HOURLY">Soatbay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              label={`Miqdor (${watch("salaryType") === "HOURLY" ? "soat/so'm" : "oy/so'm"})`}
              type="number"
              error={errors.salary?.message}
              {...register("salary", { valueAsNumber: true })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Kirish ma'lumotlari</CardTitle></CardHeader>
          <CardContent>
            <Input
              label="Vaqtinchalik parol *"
              error={errors.tempPassword?.message}
              {...register("tempPassword")}
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              SMS orqali yuboriladi. Birinchi kirishda o'zgartirishi tavsiya etiladi.
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Link href="/admin/teachers">
            <Button variant="outline">Bekor qilish</Button>
          </Link>
          <Button type="submit" loading={mutation.isPending}>
            <Save className="h-4 w-4" />
            Saqlash
          </Button>
        </div>
      </form>
    </div>
  );
}
