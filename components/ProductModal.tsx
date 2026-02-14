"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/CartProvider";

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    add(product, quantity);
    onClose();
    setQuantity(1);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 px-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl chassis-shell"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="chassis-core">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-white">{product.title}</h3>
              <p className="mt-2 text-sm text-white/70">{product.description}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs text-white/80 shadow-sm"
            >
              Cerrar
            </button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-[1.1fr_1fr]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/40 bg-gradient-to-br from-white/70 via-white/30 to-white/10">
              <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
            </div>
            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/40 bg-white/90 px-4 py-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Precio</p>
                <p className="mt-1 text-3xl font-semibold text-ink">{formatPrice(product.price)}</p>
              </div>
              <div className="grid gap-3 rounded-2xl border border-white/40 bg-white/90 px-4 py-4 shadow-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Marca</p>
                  <p className="mt-1 text-base font-semibold text-ink">{product.brand}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Marcas compatibles</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{product.compatibleBrands}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/40 bg-white/90 px-4 py-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Cantidad</p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="h-10 w-10 rounded-full border border-black/10 bg-white text-ink"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                    className="h-10 w-16 rounded-xl border-2 border-ink/70 bg-white text-center text-base text-ink shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="h-10 w-10 rounded-full border border-black/10 bg-white text-ink"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
