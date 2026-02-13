"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

export default function Footer() {
  const [links, setLinks] = useState({
    instagramUrl: "",
    facebookUrl: "",
    tiktokUrl: "",
    youtubeUrl: "",
    xUrl: "",
    whatsappNumber: "",
    contactEmail: ""
  });

  useEffect(() => {
    let isMounted = true;

    const loadLinks = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select(
          "instagram_url, facebook_url, tiktok_url, youtube_url, x_url, whatsapp_number, contact_email"
        )
        .eq("id", true)
        .maybeSingle();

      if (!isMounted || !data) return;

      setLinks({
        instagramUrl: (data.instagram_url ?? "").toString(),
        facebookUrl: (data.facebook_url ?? "").toString(),
        tiktokUrl: (data.tiktok_url ?? "").toString(),
        youtubeUrl: (data.youtube_url ?? "").toString(),
        xUrl: (data.x_url ?? "").toString(),
        whatsappNumber: (data.whatsapp_number ?? "").toString(),
        contactEmail: (data.contact_email ?? "").toString()
      });
    };

    loadLinks();

    return () => {
      isMounted = false;
    };
  }, []);

  const cleanedWhatsapp = links.whatsappNumber.replace(/\D/g, "");
  const hasSocials =
    links.instagramUrl ||
    links.facebookUrl ||
    links.tiktokUrl ||
    links.youtubeUrl ||
    links.xUrl ||
    cleanedWhatsapp;

  return (
    <footer className="mt-20 border-t border-white/10 bg-ink text-white">
      <div className="mx-auto grid min-h-[320px] max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-10">
        <div className="flex flex-col gap-5">
          <div className="relative h-20 w-72">
            <Image
              src="/logo-transparent.png"
              alt="Truck Company 4x4"
              fill
              className="object-contain"
            />
          </div>
          <p className="max-w-sm text-sm text-white/70">
            Equipamiento off-road, accesorios premium y asesoramiento para encontrar la
            configuracion exacta de tu camioneta.
          </p>
        </div>

        <div className="grid gap-3">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">Contacto</p>
          {cleanedWhatsapp ? (
            <a href={`tel:${cleanedWhatsapp}`} className="text-lg font-semibold">
              {links.whatsappNumber}
            </a>
          ) : null}
          {links.contactEmail ? (
            <a href={`mailto:${links.contactEmail}`} className="text-sm text-white/70">
              {links.contactEmail}
            </a>
          ) : null}
        </div>

        {hasSocials ? (
          <div className="grid gap-3">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Redes</p>
            <div className="flex flex-wrap gap-3">
              {links.instagramUrl ? (
                <a
                  href={links.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition hover:border-white/60 hover:text-white"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.5a4.5 4.5 0 1 1 0 9a4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5zm6-3.25a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0z" />
                  </svg>
                </a>
              ) : null}
              {links.facebookUrl ? (
                <a
                  href={links.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition hover:border-white/60 hover:text-white"
                  aria-label="Facebook"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M13.5 9H16V6h-2.5A3.5 3.5 0 0 0 10 9.5V12H8v3h2v6h3v-6h2.3l.7-3H13V9.5a.5.5 0 0 1 .5-.5z" />
                  </svg>
                </a>
              ) : null}
              {links.tiktokUrl ? (
                <a
                  href={links.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition hover:border-white/60 hover:text-white"
                  aria-label="TikTok"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M16 3a6.5 6.5 0 0 0 4 1.7v3.1a9.5 9.5 0 0 1-4-1.1v6.6a5.5 5.5 0 1 1-4.8-5.4v3.1a2.4 2.4 0 1 0 1.8 2.3V3z" />
                  </svg>
                </a>
              ) : null}
              {links.youtubeUrl ? (
                <a
                  href={links.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition hover:border-white/60 hover:text-white"
                  aria-label="YouTube"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.9 4.6 12 4.6 12 4.6s-5.9 0-7.5.5a3 3 0 0 0-2.1 2.1C2 8.8 2 12 2 12s0 3.2.4 4.8a3 3 0 0 0 2.1 2.1c1.6.5 7.5.5 7.5.5s5.9 0 7.5-.5a3 3 0 0 0 2.1-2.1c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5 3-5 3z" />
                  </svg>
                </a>
              ) : null}
              {links.xUrl ? (
                <a
                  href={links.xUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition hover:border-white/60 hover:text-white"
                  aria-label="X"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M18.6 3H21l-6.6 7.6L22 21h-6.5l-4.1-5.2L6.6 21H4.2l7.1-8.2L2 3h6.6l3.7 4.7L18.6 3zm-1.1 16h1.8L8.6 5H6.7l10.8 14z" />
                  </svg>
                </a>
              ) : null}
              {cleanedWhatsapp ? (
                <a
                  href={`https://wa.me/${cleanedWhatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition hover:border-white/60 hover:text-white"
                  aria-label="WhatsApp"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M12.05 3a8.95 8.95 0 0 0-7.73 13.45L3 21l4.7-1.25A9 9 0 1 0 12.05 3zm4.92 12.4c-.2.56-1.05 1-1.52 1.08-.43.07-.98.1-1.58-.1-.37-.12-.85-.27-1.45-.54-2.55-1.1-4.2-3.64-4.33-3.81-.12-.17-1.04-1.38-1.04-2.64s.67-1.87.9-2.12c.22-.26.49-.32.66-.32h.48c.16 0 .38-.05.59.45.2.5.7 1.72.76 1.84.06.12.1.27.02.44-.07.17-.12.27-.24.42-.12.15-.25.33-.36.44-.12.12-.24.25-.1.49.14.24.62 1.03 1.34 1.67.92.82 1.7 1.08 1.94 1.2.24.12.38.1.52-.07.14-.17.6-.7.76-.94.16-.24.32-.2.54-.12.22.07 1.38.65 1.62.77.24.12.4.17.46.27.06.1.06.58-.14 1.14z" />
                  </svg>
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </footer>
  );
}
