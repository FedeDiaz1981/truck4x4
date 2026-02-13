import type { Product } from "@/lib/types";
type ProductCardProps = {
  product: Product;
  onSelect: (product: Product) => void;
};

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="group relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-3xl border-2 border-accent/20 text-left shadow-soft transition hover:-translate-y-1 hover:shadow-glow"
    >
      <img
        src={product.image}
        alt={product.title}
        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
      <div className="relative z-10 mt-auto p-5">
        <h3 className="text-xl font-semibold text-white">{product.title}</h3>
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/70">
          {product.compatibleBrands}
        </p>
      </div>
    </button>
  );
}
