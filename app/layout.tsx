import type { Metadata } from "next";
import { Space_Grotesk, Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import WhatsAppFloating from "@/components/WhatsAppFloating";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans"
});

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif"
});

const display = Outfit({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "Truck Company 4x4",
  description: "Equipamiento off-road con catalogo y cierre por WhatsApp"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${sans.variable} ${serif.variable} ${display.variable}`}>
      <body>
        <Providers>{children}</Providers>
        <WhatsAppFloating />
      </body>
    </html>
  );
}
