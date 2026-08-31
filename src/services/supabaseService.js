import { supabase, SB_URL } from '../config/supabase'

/**
 * Resolve image URL cleanly from Supabase storage or external/local paths
 */
export function thumbUrl(url, bucket = 'designs') {
  if (!url) return 'assets/img/profile/about.jpg'
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }
  if (url.startsWith('assets/')) {
    return url
  }
  if (url.startsWith('/')) {
    return url.slice(1)
  }
  return `${SB_URL}/storage/v1/object/public/${bucket}/${url}`
}

/**
 * Fetch entire portfolio data from Supabase
 */
export async function getPortfolioData() {
  try {
    const [statsRes, webRes, desRes, vidRes, docRes] = await Promise.all([
      supabase.from('about_stats').select('*').limit(1),
      supabase.from('websites').select('*').order('created_at', { ascending: false }),
      supabase.from('designs').select('*').order('created_at', { ascending: false }),
      supabase.from('videos').select('*').order('created_at', { ascending: false }),
      supabase.from('dokumentasi').select('*').order('created_at', { ascending: false })
    ])

    const rawStats = statsRes.data?.[0] || {}
    const stats = {
      projects: rawStats.projects || '15+',
      clients: rawStats.clients || '10+',
      happy: rawStats.happy_clients || rawStats.happy || '99%',
      ongoing: rawStats.ongoing || '3'
    }

    return {
      stats,
      websites: webRes.data || [],
      designs: desRes.data || [],
      videos: vidRes.data || [],
      dokumentasi: docRes.data || []
    }
  } catch (err) {
    console.error('Gagal mengambil data dari Supabase:', err.message)
    throw err
  }
}

/**
 * Fetch items for a specific category
 */
export async function getCategoryItems(category) {
  if (category === 'stats') {
    const { data, error } = await supabase.from('about_stats').select('*').limit(1)
    if (error) throw error
    const raw = data?.[0] || {}
    return {
      projects: raw.projects || '15+',
      clients: raw.clients || '10+',
      happy: raw.happy_clients || raw.happy || '99%',
      ongoing: raw.ongoing || '3'
    }
  }

  const { data, error } = await supabase
    .from(category)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Upload an image to Supabase Storage
 */
export async function uploadImageToSupabase(file, bucket = 'designs') {
  if (!file) throw new Error('File foto tidak ditemukan.')

  const ext = file.name ? file.name.split('.').pop() : 'jpg'
  const cleanName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`

  const { data, error } = await supabase.storage.from(bucket).upload(cleanName, file, {
    cacheControl: '3600',
    upsert: false
  })

  if (error) {
    throw new Error(error.message || 'Gagal mengupload gambar ke Supabase Storage.')
  }

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(cleanName)

  return {
    success: true,
    url: publicData.publicUrl,
    filename: cleanName,
    bucket
  }
}

/**
 * Add a new item to a category table in Supabase
 */
export async function addItem(category, item) {
  let insertPayload = {}

  if (category === 'websites') {
    insertPayload = {
      title: item.title,
      category: item.category || 'Website',
      tech_stack: item.tech_stack || '',
      description: item.description || '',
      image_url: item.image_url || '',
      project_link: item.project_link || '',
      github_link: item.github_link || ''
    }
  } else if (category === 'designs') {
    insertPayload = {
      title: item.title,
      category: item.category || 'Design',
      year: parseInt(item.year) || new Date().getFullYear(),
      image_url: item.image_url || '',
      description: item.description || ''
    }
  } else if (category === 'videos') {
    insertPayload = {
      title: item.title,
      category: item.category || 'Video',
      year: parseInt(item.year) || new Date().getFullYear(),
      video_url: item.video_url || '',
      thumbnail_url: item.thumbnail_url || '',
      description: item.description || ''
    }
  } else if (category === 'dokumentasi') {
    insertPayload = {
      title: item.title,
      image_url: item.image_url || ''
    }
  }

  const { data, error } = await supabase
    .from(category)
    .insert([insertPayload])
    .select()

  if (error) throw error
  return data?.[0]
}

/**
 * Delete an item from Supabase by ID
 */
export async function deleteItem(category, id) {
  const { error } = await supabase
    .from(category)
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}

/**
 * Update about stats in Supabase
 */
export async function updateStats(stats) {
  const payload = {
    id: 1,
    projects: stats.projects || '15+',
    clients: stats.clients || '10+',
    happy_clients: stats.happy || stats.happy_clients || '99%',
    ongoing: stats.ongoing || '3'
  }

  const { data, error } = await supabase
    .from('about_stats')
    .upsert(payload)
    .select()

  if (error) throw error
  return data?.[0]
}
