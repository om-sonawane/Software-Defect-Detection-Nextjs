import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Create a Supabase client
export function createClient() {
  // Use environment variables if available, otherwise use the provided values
  const supabaseUrl : string = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vpsxhfasihjhavgzixjb.supabase.co"
  const supabaseKey : string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwc3hoZmFzaWhqaGF2Z3ppeGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NTY1NjEsImV4cCI6MjA2MTIzMjU2MX0.eorndyuZLSi2hZB-ZGm8AZjr0XARqI5RGa5CkJLz5EI"

  return createSupabaseClient(supabaseUrl, supabaseKey)
}
