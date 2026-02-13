import type { Product } from "@/lib/types";
import Fuse, { type IFuseOptions } from "fuse.js";

const options: IFuseOptions<Product> = {
  keys: ["title", "description", "brand", "compatibleBrands"],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2
};

export function fuzzySearch(products: Product[], query: string) {
  const clean = query.trim();
  if (!clean) return products;
  const fuse = new Fuse(products, options);
  return fuse.search(clean).map((result) => result.item);
}

