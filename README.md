# Nova Storefront

Stack
- Next.js (App Router)
- Tailwind CSS
- Supabase Postgres + Auth
- Checkout por WhatsApp
- Netlify

Setup rapido
1. Instala dependencias con `npm install`.
2. Crea un proyecto en Supabase y ejecuta el SQL de `supabase/schema.sql`.
3. Configura variables en `.env.local` (usa `.env.example` como base). Define `NEXT_PUBLIC_WHATSAPP_NUMBER` en formato internacional (solo digitos).
4. Corre el proyecto con `npm run dev`.

Roles
- Los usuarios nuevos se crean con rol `editor`.
- Para promover a admin, corre en Supabase SQL:
  update profiles set role = 'admin' where id = '<USER_UUID>';

WhatsApp
- Usa `NEXT_PUBLIC_WHATSAPP_NUMBER` con el numero comercial en formato internacional (solo digitos).
- El checkout abre WhatsApp con el detalle del carrito para confirmar stock.

Notas
- El catalogo demo vive en `lib/products.ts`.
- El panel admin usa `profiles` para validar roles.
- El checkout inicia el contacto por WhatsApp para cerrar la operacion.
