import { createClient } from "@supabase/supabase-js";

// Chave PUBLICÁVEL apenas — este app não tem backend, então o navegador
// fala direto com o Supabase. A chave secreta do projeto Vigia NUNCA deve
// entrar aqui: ela bypassa Row Level Security e não pode ser exposta ao
// cliente. Segurança real depende das policies de RLS configuradas nas
// tabelas do projeto (ver README).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "[vigia] VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY não configurados — copie .env.example para .env.",
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseKey ?? "");
