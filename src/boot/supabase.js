import { createClient } from "@supabase/supabase-js";
import useAuthUser from "src/composables/UseAuthUser";

const supabaseUrl = 'https://pxerxbofxcifgdtqccpo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4ZXJ4Ym9meGNpZmdkdHFjY3BvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjAyMTQ4MjksImV4cCI6MTk3NTc5MDgyOX0.8y62rUOvH4WnfWmbg-YaLOIEuA0DbOpe3RSiAXunNeo'
const supabase = createClient(supabaseUrl, supabaseKey);

// console.log('init supabase:', supabase)
supabase.auth.onAuthStateChange((event, session) => {
  const { user } = useAuthUser();
  user.value = session?.user || null;
});

export default function useSupabase() {
  return { supabase };
}
