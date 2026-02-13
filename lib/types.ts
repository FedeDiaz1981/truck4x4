export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  brand: string;
  compatibleBrands: string;
  price: number;
  currency: "ARS";
  image: string;
  stock?: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
