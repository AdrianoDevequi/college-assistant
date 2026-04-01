"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { User, ChevronDown, CreditCard, LogOut, Settings2 } from "lucide-react";

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  FREE: { label: "Gratuito", color: "bg-gray-100 text-gray-600" },
  PRO: { label: "Pro", color: "bg-blue-100 text-blue-700" },
  PREMIUM: { label: "Premium", color: "bg-yellow-100 text-yellow-700" },
};

interface UserMenuProps {
  name?: string | null;
  email?: string | null;
  plan: string;
}

export default function UserMenu({ name, email, plan }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const planInfo = PLAN_LABELS[plan] ?? PLAN_LABELS.FREE;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 transition text-left"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
          <User size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">{name ?? "Usuário"}</p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planInfo.color}`}>
            {planInfo.label}
          </span>
        </div>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 w-full mb-2 bg-white border rounded-xl shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-xs text-gray-400 truncate">{email}</p>
          </div>
          <Link
            href="/admin/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            <Settings2 size={15} />
            Editar Perfil
          </Link>
          <Link
            href="/admin/plans"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            <CreditCard size={15} />
            Planos & Assinatura
          </Link>
          <div className="border-t mt-1">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition w-full text-left"
            >
              <LogOut size={15} />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
