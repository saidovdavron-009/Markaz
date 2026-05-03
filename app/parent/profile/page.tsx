"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, Lock, Eye, EyeOff, Camera, LogOut, Users, BookMarked, ClipboardCheck } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { UserAvatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const myChild = {
  name: "Alibek Karimov",
  studentId: "ID001",
  grade: "Ingliz tili A2",
  attendance: "87%",
  avgScore: "83%",
  status: "ACTIVE",
};

export default function ParentProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      toast.error("Faqat JPEG, JPG yoki PNG formatlar"); return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Fayl hajmi 2MB dan oshmasin"); return;
    }
    setImageUrl(URL.createObjectURL(file));
    toast.success("Rasm yuklandi");
  };

  const [showOld, setShowOld] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [passwords, setPasswords] = React.useState({ old: "", new: "", confirm: "" });
  const [saving, setSaving] = React.useState(false);

  const [form, setForm] = React.useState({
    fullName: user?.profile?.fullName || "Parent Demo",
    email: user?.email || "parent@demo.uz",
    phone: "+998 91 234 56 78",
    address: "Toshkent sh., Chilonzor tumani",
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    toast.success("Profil saqlandi");
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (!passwords.old) { toast.error("Joriy parolni kiriting"); return; }
    if (passwords.new.length < 6) { toast.error("Yangi parol kamida 6 ta belgi"); return; }
    if (passwords.new !== passwords.confirm) { toast.error("Parollar mos kelmadi"); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    toast.success("Parol o'zgartirildi");
    setPasswords({ old: "", new: "", confirm: "" });
    setSaving(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Mening profilim</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Shaxsiy ma'lumotlaringizni boshqaring</p>
      </div>

      {/* Profile hero */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />
            <div className="relative shrink-0">
              {imageUrl ? (
                <div className="h-16 w-16 rounded-full overflow-hidden ring-4 ring-[#1E3A5F]/10">
                  <img src={imageUrl} alt="Profil" className="w-full h-full object-cover" />
                </div>
              ) : (
                <UserAvatar name={form.fullName} size="xl" className="ring-4 ring-[#1E3A5F]/10" />
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center shadow-lg hover:bg-[#162d4a] transition-colors"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl font-bold">{form.fullName}</h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                  <Users className="h-3 w-3" />
                  Ota-ona
                </span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mt-2">{form.email}</p>
              <p className="text-sm text-[var(--muted-foreground)]">{form.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Child info card */}
      <Card className="border-[#1E3A5F]/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-[#1E3A5F]" />
            Farzandim ma'lumotlari
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <UserAvatar name={myChild.name} size="lg" />
            <div>
              <p className="font-bold text-base">{myChild.name}</p>
              <span className="font-mono text-xs font-bold text-[#1E3A5F] bg-[#1E3A5F]/10 px-2 py-0.5 rounded">{myChild.studentId}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-[var(--muted)] rounded-xl">
              <p className="text-lg font-bold text-green-600">{myChild.attendance}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5 flex items-center justify-center gap-1">
                <ClipboardCheck className="h-3 w-3" />Davomat
              </p>
            </div>
            <div className="text-center p-3 bg-[var(--muted)] rounded-xl">
              <p className="text-lg font-bold text-purple-600">{myChild.avgScore}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5 flex items-center justify-center gap-1">
                <BookMarked className="h-3 w-3" />O'rtacha ball
              </p>
            </div>
            <div className="text-center p-3 bg-[var(--muted)] rounded-xl">
              <p className="text-lg font-bold text-[#1E3A5F]">2</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5 flex items-center justify-center gap-1">
                <Users className="h-3 w-3" />Guruhlar
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal info */}
      <Card>
        <CardHeader><CardTitle>Shaxsiy ma'lumotlar</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">To'liq ism</label>
              <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Telefon</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Manzil</label>
              <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} loading={saving}>Saqlash</Button>
          </div>
        </CardContent>
      </Card>

      {/* Password change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lock className="h-4 w-4" />Parolni o'zgartirish</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Joriy parol", key: "old" as const, show: showOld, toggle: () => setShowOld(v => !v) },
              { label: "Yangi parol", key: "new" as const, show: showNew, toggle: () => setShowNew(v => !v) },
              { label: "Tasdiqlash", key: "confirm" as const, show: showConfirm, toggle: () => setShowConfirm(v => !v) },
            ].map(({ label, key, show, toggle }) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1.5">{label}</label>
                <div className="relative">
                  <input type={show ? "text" : "password"} value={passwords[key]}
                    onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full h-10 pl-3 pr-9 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]" />
                  <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={handleChangePassword} loading={saving} variant="outline">
              <Lock className="h-4 w-4" />Parolni o'zgartirish
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader><CardTitle className="text-red-600">Tizimdan chiqish</CardTitle></CardHeader>
        <CardContent>
          <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={() => { logout(); router.push("/login"); }}>
            <LogOut className="h-4 w-4" />Chiqish
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
