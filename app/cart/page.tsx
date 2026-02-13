"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, remove, total, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");

  const buildWhatsAppMessage = () => {
    const lines = ["Hola! Quiero confirmar stock y cerrar la compra.", "", "Pedido:"];

    items.forEach((item) => {
      lines.push(
        `- ${item.product.title} x${item.quantity} (${formatPrice(
          item.product.price * item.quantity
        )})`
      );
    });

    lines.push("", `Total: ${formatPrice(total)}`);
    return lines.join("\n");
  };

  const handleCheckout = () => {
    setError(null);
    if (items.length === 0) return;

    if (!whatsappNumber) {
      setError("Falta configurar NEXT_PUBLIC_WHATSAPP_NUMBER");
      return;
    }

    setLoading(true);
    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (!newWindow) {
      window.location.href = url;
    }
    setLoading(false);
  };

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-5xl px-6 pb-20">
        <div className="mt-12 flex flex-col gap-6 rounded-3xl border border-black/5 bg-white/80 p-8 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Carrito</h1>
              <p className="text-sm text-muted">Revisa los productos antes de enviar el pedido</p>
            </div>
            {items.length > 0 ? (
              <button
                type="button"
                onClick={clear}
                className="rounded-full border border-black/10 px-4 py-2 text-sm text-muted hover:border-accent/60"
              >
                Vaciar carrito
              </button>
            ) : null}
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/10 bg-white p-10 text-center text-muted">
              El carrito esta vacio. Agrega productos desde el catalogo.
            </div>
          ) : (
            <div className="grid gap-6">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="grid items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 md:grid-cols-[1fr_auto_auto]"
                >
                  <div>
                    <p className="text-lg font-semibold">{item.product.title}</p>
                    <p className="text-sm text-muted">{formatPrice(item.product.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="h-8 w-8 rounded-full border border-black/10 text-sm"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.product.id, Number(event.target.value))}
                      className="w-16 rounded-xl border border-black/10 px-3 py-1 text-center"
                    />
                    <button
                      type="button"
                      className="h-8 w-8 rounded-full border border-black/10 text-sm"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-3 md:justify-end">
                    <p className="text-base font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                    <button
                      type="button"
                      className="rounded-full border border-black/10 px-3 py-1 text-xs text-muted"
                      onClick={() => remove(item.product.id)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-lg font-semibold">Total: {formatPrice(total)}</p>
            <div className="flex flex-col items-end gap-2">
              <button
                type="button"
                disabled={items.length === 0 || loading}
                onClick={handleCheckout}
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-glow disabled:cursor-not-allowed disabled:bg-black/20"
              >
                {loading ? "Abriendo WhatsApp..." : "Enviar por WhatsApp"}
              </button>
              <p className="text-xs text-muted">
                Se abrira WhatsApp con el detalle del carrito para confirmar stock.
              </p>
            </div>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </main>
    </div>
  );
}
