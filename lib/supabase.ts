import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client (uses anon key)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Server-side Supabase client (uses service role key for admin operations)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
export type Vendor = {
  id: string
  name: string
  service_type: string
  city: string
  state: string
  rating: number
  review_count: number
  image_url: string
  description: string
  price_range: string
  is_licensed: boolean
  is_insured: boolean
  created_at: string
}
