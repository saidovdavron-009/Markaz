"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, BookOpen, CreditCard, ClipboardCheck,
  BookMarked, Calendar, FileText, UserCircle,
} from "lucide-react";

interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const adminBottomNav: BottomNavItem[] = [
  { label: "Bosh", href: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "O'quvchilar", href: "/admin/students", icon: <Users className="h-5 w-5" /> },
  { label: "Guruhlar", href: "/admin/groups", icon: <BookOpen className="h-5 w-5" /> },
  { label: "To'lovlar", href: "/admin/finance", icon: <CreditCard className="h-5 w-5" /> },
  { label: "Profil", href: "/admin/profile", icon: <UserCircle className="h-5 w-5" /> },
];

const teacherBottomNav: BottomNavItem[] = [
  { label: "Bosh", href: "/teacher/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "Guruhlar", href: "/teacher/groups", icon: <BookOpen className="h-5 w-5" /> },
  { label: "Davomat", href: "/teacher/attendance", icon: <ClipboardCheck className="h-5 w-5" /> },
  { label: "Baholar", href: "/teacher/grades", icon: <BookMarked className="h-5 w-5" /> },
  { label: "Profil", href: "/teacher/profile", icon: <UserCircle className="h-5 w-5" /> },
];

const studentBottomNav: BottomNavItem[] = [
  { label: "Bosh", href: "/student/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "Jadval", href: "/student/schedule", icon: <Calendar className="h-5 w-5" /> },
  { label: "Baholar", href: "/student/grades", icon: <BookMarked className="h-5 w-5" /> },
  { label: "To'lovlar", href: "/student/payments", icon: <CreditCard className="h-5 w-5" /> },
  { label: "Profil", href: "/student/profile", icon: <UserCircle className="h-5 w-5" /> },
];

const parentBottomNav: BottomNavItem[] = [
  { label: "Bosh", href: "/parent/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "Farzand", href: "/parent/child", icon: <Users className="h-5 w-5" /> },
  { label: "Baholar", href: "/parent/grades", icon: <BookMarked className="h-5 w-5" /> },
  { label: "To'lovlar", href: "/parent/payments", icon: <CreditCard className="h-5 w-5" /> },
  { label: "Profil", href: "/parent/profile", icon: <UserCircle className="h-5 w-5" /> },
];

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const navItems = React.useMemo(() => {
    if (!user) return [];
    switch (user.role) {
      case "ADMIN": return adminBottomNav;
      case "TEACHER": return teacherBottomNav;
      case "STUDENT": return studentBottomNav;
      case "PARENT": return parentBottomNav;
      default: return [];
    }
  }, [user]);

  if (!navItems.length) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--card)] border-t border-[var(--border)] safe-bottom">
      <div className="flex items-stretch h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-[#1E3A5F]"
                  : "text-[var(--muted-foreground)]"
              )}
            >
              <span className={cn(
                "flex items-center justify-center rounded-xl w-10 h-6 transition-colors",
                isActive ? "bg-[#1E3A5F]/10" : ""
              )}>
                {item.icon}
              </span>
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
