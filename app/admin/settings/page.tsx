"use client";
import React from "react";
import { Save, Building2, Bell, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/store/uiStore";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { theme, setTheme } = useUIStore();

  const handleSave = () => {
    toast.success("Sozlamalar saqlandi");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Sozlamalar</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Tizim sozlamalari</p>
      </div>

      {/* Center Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />O'quv markazi ma'lumotlari
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Markaz nomi" defaultValue="EduCenter Pro" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Telefon" defaultValue="+998 71 123 45 67" />
            <Input label="Email" defaultValue="info@educenter.uz" />
          </div>
          <Input label="Manzil" defaultValue="Toshkent sh., Chilonzor t." />
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-4 w-4" />Ko'rinish
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Mavzu</label>
            <div className="flex gap-3">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${theme === t ? "border-[#1E3A5F] bg-[#1E3A5F] text-white" : "border-[var(--border)] hover:bg-[var(--muted)]"}`}
                >
                  {t === "light" ? "Yorug'" : t === "dark" ? "Qorong'u" : "Sistema"}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4" />Bildirishnomalar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="SMS API kaliti" type="password" placeholder="Eskiz SMS API key" />
          <Input label="Telegram Bot token" type="password" placeholder="Bot token" />
          <Input label="SendGrid API kaliti" type="password" placeholder="SendGrid key" />
        </CardContent>
      </Card>

      {/* Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4" />To'lov integratsiyasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Click Merchant ID" placeholder="Click merchantId" />
          <Input label="Payme Merchant ID" placeholder="Payme merchantId" />
          <Input label="Uzum API Key" type="password" placeholder="Uzum API key" />
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full sm:w-auto">
        <Save className="h-4 w-4" />Saqlash
      </Button>
    </div>
  );
}
