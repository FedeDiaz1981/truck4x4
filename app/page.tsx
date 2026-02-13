"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ProductGrid from "@/components/ProductGrid";
import ProductModal from "@/components/ProductModal";
import Footer from "@/components/Footer";
import { fuzzySearch } from "@/lib/fuzzy";
import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setLoading(true);
      setLoadError(null);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (error) {
        setLoadError(error.message);
        setProducts([]);
      } else {
        const mapped = (data || []).map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          description: item.description,
          brand: item.brand,
          compatibleBrands: item.compatible_brands ?? "",
          price: Number(item.price) || 0,
          currency: (item.currency ?? "ARS") as "ARS",
          image: item.image || "/placeholder.svg"
        }));
        setProducts(mapped);
      }

      setLoading(false);
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const results = useMemo(() => {
    return fuzzySearch(products, query);
  }, [products, query]);

  return (
    <div>
      <Header />
      <main className="pb-20">
        <section className="relative min-h-[60svh] overflow-hidden pb-40 pt-32 lg:pb-48 lg:pt-44">
          <Image
            src="/Hero.png"
            alt="Pickup hero"
            fill
            priority
            className="object-cover object-[center_49%]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-white/0 to-white/30" />

          <div className="absolute bottom-10 left-1/2 w-full max-w-4xl -translate-x-1/2 px-6">
            <SearchBar value={query} onChange={setQuery} />
          </div>
        </section>

        <section id="catalogo" className="mx-auto mt-[9.25vh] max-w-7xl scroll-mt-0 px-6">
          <div className="mb-[6.3vh] flex flex-col items-center gap-2 text-center">
            <h2 className="font-display text-[39px] font-semibold text-ink md:text-[44px]">
              Nuestros productos
            </h2>
          </div>
          {loading ? (
            <p className="text-sm text-muted">Cargando productos...</p>
          ) : loadError ? (
            <p className="text-sm text-red-600">No se pudieron cargar productos.</p>
          ) : (
            <ProductGrid products={results} onSelect={setSelected} />
          )}
        </section>
      </main>
      <Footer />
      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
