"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartProvider";

type HeaderProps = {
  mode?: "sticky" | "fixed";
};

export default function Header({ mode = "sticky" }: HeaderProps) {
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const isFixed = mode === "fixed";
  const pathname = usePathname();
  const showCart = !pathname?.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`${isFixed ? "fixed left-0 right-0 top-0" : "sticky top-0"} z-40 h-[5.4rem] md:h-[7rem] transition-all duration-300 ${
        isFixed
          ? "border-b border-black/5 bg-white/90 backdrop-blur shadow-soft"
          : isScrolled
            ? "border-b border-transparent bg-transparent"
            : "border-b border-black/5 bg-white/80 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-transparent.png"
            alt="Truck Company 4x4"
            width={343}
            height={293}
            className="h-14 w-auto md:h-[4.2rem]"
            priority
          />
        </Link>
        {showCart ? (
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/cart" className="rounded-full bg-ink px-4 py-2 text-white">
              Carrito ({cartCount})
            </Link>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
