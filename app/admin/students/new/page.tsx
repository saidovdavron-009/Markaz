"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, User, Copy, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";

const mockGroups = [
  { id: "1", name: "Ingliz tili A2", subject: "Ingliz tili", teacher: "Sardor Toshmatov" },
  { id: "2", name: "Matematika B1", subject: "Matematika", teacher: "Nilufar Karimova" },
  { id: "3", name: "Fizika A1", subject: "Fizika", teacher: "Jasur Yusupov" },
  { id: "4", name: "Rus tili A1", subject: "Rus tili", teacher: "Zulfiya Abdullayeva" },
];

const CURRENT_STUDENT_COUNT = 25;

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

const nextId = CURRENT_STUDENT_COUNT + 1;
const nextStudentId = `ID${String(nextId).padStart(3, "0")}`;
const generatedPassword = genPassword(nextId);

const studentSchema = z.object({
  fullName: z.string().min(3, "Ism kamida 3 ta belgi"),
  phone: z.string().min(9, "Telefon raqam kiriting"),
  parentPhone: z.string().optional(),
  dob: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  address: z.string().optional(),
  groupId: z.string().optional(),
  referralSource: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

export default function NewStudentPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  const onSubmit = (data: StudentFormData) => {
    console.log("New student:", { ...data, studentId: nextStudentId, password: generatedPassword });
    toast.success(`O'quvchi qo'shildi! ID: ${nextStudentId}`);
    router.push("/admin/students");
  };

  const copyCredentials = () => {
    navigator.clipboard.writeText(`Login: ${nextStudentId}\nParol: ${generatedPassword}`);
    toast.success("Kirish ma'lumotlari nusxalandi!");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/students">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Yangi o'quvchi</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Yangi o'quvchi akkauntini yarating</p>
        </div>
      </div>

      {/* Auto-generated credentials */}
      <div className="rounded-xl border-2 border-[#1E3A5F]/20 bg-[#1E3A5F]/5 p-5">
        <p className="text-sm font-semibold text-[#1E3A5F] mb-3">Avtomatik tayinlangan kirish ma'lumotlari</p>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs text-[var(--muted-foreground)] mb-1">Login (ID)</p>
            <span className="font-mono font-bold text-[#1E3A5F] text-lg bg-[#1E3A5F]/10 px-3 py-1 rounded-lg">
              {nextStudentId}
            </span>
          </div>
          <div>
            <p className="text-xs text-[var(--muted-foreground)] mb-1">Parol</p>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[#1E3A5F] text-lg bg-[#1E3A5F]/10 px-3 py-1 rounded-lg">
                {showPassword ? generatedPassword : "••••••••"}
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="text-[var(--muted-foreground)] hover:text-[#1E3A5F] transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={copyCredentials} className="ml-auto">
            <Copy className="h-4 w-4" />
            Nusxalash
          </Button>
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mt-3">
          Bu ma'lumotlarni o'quvchiga bering. O'quvchi tizimga shu ID va parol bilan kiradi.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Shaxsiy ma'lumotlar
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="To'liq ismi *"
                placeholder="Ism Familya Otasining ismi"
                error={errors.fullName?.message}
                {...register("fullName")}
              />
            </div>
            <Input
              label="Telefon raqam *"
              placeholder="+998 90 123 45 67"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <Input
              label="Ota-ona telefoni"
              placeholder="+998 90 123 45 67"
              {...register("parentPhone")}
            />
            <Input
              label="Tug'ilgan sana"
              type="date"
              {...register("dob")}
            />
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Jinsi</label>
              <Select value={watch("gender")} onValueChange={(v) => setValue("gender", v as "MALE" | "FEMALE")}>
                <SelectTrigger>
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Erkak</SelectItem>
                  <SelectItem value="FEMALE">Ayol</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Manzil"
                placeholder="Shahar, tuman"
                {...register("address")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Qo'shimcha ma'lumotlar</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Guruh</label>
              <Select value={watch("groupId") ?? ""} onValueChange={(v) => setValue("groupId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Guruh tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {mockGroups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name} — {g.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              label="Qayerdan keldi"
              placeholder="Instagram, do'st, e'lon..."
              {...register("referralSource")}
            />
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Link href="/admin/students">
            <Button variant="outline">Bekor qilish</Button>
          </Link>
          <Button type="submit">
            <Save className="h-4 w-4" />
            Saqlash
          </Button>
        </div>
      </form>
    </div>
  );
}
