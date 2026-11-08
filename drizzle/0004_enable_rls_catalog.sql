-- Bloquea la API pública de Supabase (anon/authenticated) sobre el catálogo.
-- La app se conecta como "postgres" (bypass RLS), así que no se ve afectada.
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
