import { createClient } from '@supabase/supabase-js';

// Supabase configuration - MUST be set via environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables are set (helps catch deployment issues early)
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '⚠️ Supabase credentials not found in environment variables.\n' +
        'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.'
    );
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
