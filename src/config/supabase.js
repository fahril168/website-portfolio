import { createClient } from '@supabase/supabase-js'

export const SB_URL = localStorage.getItem('fahril_sb_url') || import.meta.env.VITE_SUPABASE_URL || 'https://hsytixfazdtsyvabkotz.supabase.co'
export const SB_KEY = localStorage.getItem('fahril_sb_key') || import.meta.env.VITE_SUPABASE_KEY || 'sb_publishable_1_mMRJHjnQBf1BrxopH1Vw_-TZP-L4v'

export const supabase = createClient(SB_URL, SB_KEY)

export function thumbUrl(url, bucket = 'designs') {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return `${SB_URL}/storage/v1/object/public/${bucket}/${url}`
}

export async function sbFetch(path) {
    const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
        headers: {
            apikey: SB_KEY,
            Authorization: `Bearer ${SB_KEY}`,
            'Content-Type': 'application/json'
        }
    })

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || `Request gagal (${res.status})`)
    }

    const txt = await res.text()
    return txt ? JSON.parse(txt) : []
}
