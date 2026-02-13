import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: "p1",
    slug: "paragolpes-ironman",
    title: "Paragolpes reforzado",
    description: "Proteccion frontal con soporte para malacate y anclajes.",
    brand: "Ironman 4x4",
    compatibleBrands: "Toyota Hilux, Ford Ranger",
    price: 549900,
    currency: "ARS",
    image: "/placeholder.svg"
  },
  {
    id: "p2",
    slug: "suspension-elevacion",
    title: "Kit suspension +2\"",
    description: "Kit de elevacion con amortiguadores reforzados.",
    brand: "Old Man Emu",
    compatibleBrands: "Toyota Hilux, Mitsubishi L200",
    price: 869000,
    currency: "ARS",
    image: "/placeholder.svg"
  },
  {
    id: "p3",
    slug: "snorkel-offroad",
    title: "Snorkel off-road",
    description: "Toma de aire elevada para vadeo y polvo.",
    brand: "Safari",
    compatibleBrands: "Toyota Hilux, Nissan Frontier",
    price: 392000,
    currency: "ARS",
    image: "/placeholder.svg"
  },
  {
    id: "p4",
    slug: "barras-techo",
    title: "Barras de techo",
    description: "Carga segura con terminaciones antideslizantes.",
    brand: "Rhino Rack",
    compatibleBrands: "Volkswagen Amarok, Ford Ranger",
    price: 199000,
    currency: "ARS",
    image: "/placeholder.svg"
  },
  {
    id: "p5",
    slug: "malacate-12000",
    title: "Malacate 12.000 lbs",
    description: "Cabrestante electrico con control inalambrico.",
    brand: "Warn",
    compatibleBrands: "Universal 4x4",
    price: 459000,
    currency: "ARS",
    image: "/placeholder.svg"
  },
  {
    id: "p6",
    slug: "luces-led",
    title: "Barra LED 40\"",
    description: "Iluminacion de largo alcance con carcasa reforzada.",
    brand: "Rigid",
    compatibleBrands: "Universal 4x4",
    price: 629000,
    currency: "ARS",
    image: "/placeholder.svg"
  }
];
