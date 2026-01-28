import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client for browser/client-side operations
export const supabasePublic = createClient(supabaseUrl!, supabaseAnonKey!);

// Admin client for server-side operations (requires service role key)
export const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceRoleKey!);

// Default export for backward compatibility
export default supabasePublic;