import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
// These MUST be set in your .env.local file:
// VITE_SUPABASE_URL=...
// VITE_SUPABASE_ANON_KEY=...
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    if (import.meta.env.DEV) {
        console.error(
            '❌ Supabase credentials missing! check your .env.local file.\n' +
            'You need VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
        );
    }
}




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
