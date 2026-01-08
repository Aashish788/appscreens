import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uwwakewvppdtdctejsjc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_FSQB2y_f2fot3zpHk5agew_NogX9rNh';

// Create the Supabase client with production-grade configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Persist session in localStorage
        persistSession: true,
        // Auto refresh token before expiry
        autoRefreshToken: true,
        // Detect session from URL (for OAuth callbacks and magic links)
        detectSessionInUrl: true,
        // Storage key for session
        storageKey: 'appscreen-auth-session',
        // Flow type for PKCE
        flowType: 'pkce',
    },
    global: {
        headers: {
            'X-Client-Info': 'appscreen-engine/5.0',
        },
    },
});

// Type exports for better TypeScript support
export type { User, Session } from '@supabase/supabase-js';
