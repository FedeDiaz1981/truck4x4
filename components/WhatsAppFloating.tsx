"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const whatsappMessage = encodeURIComponent("Hola! Quiero consultar por productos.");
const fallbackNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");

export default function WhatsAppFloating() {
  const pathname = usePathname();
  const [whatsappNumber, setWhatsappNumber] = useState(fallbackNumber);
  if (pathname?.startsWith("/admin")) return null;

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("whatsapp_number")
        .eq("id", true)
        .maybeSingle();

      if (!isMounted) return;
      if (data?.whatsapp_number) {
        setWhatsappNumber(String(data.whatsapp_number));
      }
    };

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const cleanedNumber = whatsappNumber.replace(/\D/g, "");
  if (!cleanedNumber) return null;

  return (
    <a
      href={`https://wa.me/${cleanedNumber}?text=${whatsappMessage}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[#25D366] text-white shadow-soft transition hover:-translate-y-1"
      aria-label="WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
        <path d="M12.05 3a8.95 8.95 0 0 0-7.73 13.45L3 21l4.7-1.25A9 9 0 1 0 12.05 3zm4.92 12.4c-.2.56-1.05 1-1.52 1.08-.43.07-.98.1-1.58-.1-.37-.12-.85-.27-1.45-.54-2.55-1.1-4.2-3.64-4.33-3.81-.12-.17-1.04-1.38-1.04-2.64s.67-1.87.9-2.12c.22-.26.49-.32.66-.32h.48c.16 0 .38-.05.59.45.2.5.7 1.72.76 1.84.06.12.1.27.02.44-.07.17-.12.27-.24.42-.12.15-.25.33-.36.44-.12.12-.24.25-.1.49.14.24.62 1.03 1.34 1.67.92.82 1.7 1.08 1.94 1.2.24.12.38.1.52-.07.14-.17.6-.7.76-.94.16-.24.32-.2.54-.12.22.07 1.38.65 1.62.77.24.12.4.17.46.27.06.1.06.58-.14 1.14z" />
      </svg>
    </a>
  );
}
