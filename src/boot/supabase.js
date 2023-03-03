import { createClient } from "@supabase/supabase-js";
import useAuthUser from "src/composables/UseAuthUser";

const supabaseUrl = "https://aynuvnpdmrmhsjvzzbqp.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bnV2bnBkbXJtaHNqdnp6YnFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzc1MjAxMDIsImV4cCI6MTk5MzA5NjEwMn0.eRWJ57ny-oLRhvYy9QwA4DQ1gevvju1VAEtClK9mg18";
const supabase = createClient(supabaseUrl, supabaseKey);

// console.log('init supabase:', supabase)
supabase.auth.onAuthStateChange((event, session) => {
  const { user } = useAuthUser();
  user.value = session?.user || null;
});

export default function useSupabase() {
  return { supabase };
}
