import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

type ProductGridProps = {
  products: Product[];
  onSelect: (product: Product) => void;
};

export default function ProductGrid({ products, onSelect }: ProductGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onSelect={onSelect} />
      ))}
    </div>
  );
}
