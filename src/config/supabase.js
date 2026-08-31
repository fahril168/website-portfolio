import { createClient } from '@supabase/supabase-js'

export const SB_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  localStorage.getItem('fahril_sb_url') ||
  'https://hsytixfazdtsyvabkotz.supabase.co'

export const SB_KEY =
  import.meta.env.VITE_SUPABASE_KEY ||
  localStorage.getItem('fahril_sb_key') ||
  'sb_publishable_1_mMRJHjnQBf1BrxopH1Vw_-TZP-L4v'

export const supabase = createClient(SB_URL, SB_KEY)
