import defaultData from '../data/portfolioData.json'

const LOCAL_STORAGE_KEY = 'fahril_local_portfolio_data'

/**
 * Get entire portfolio data
 */
export async function getPortfolioData() {
  try {
    const res = await fetch('/api/data', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
        return data
      }
    }
  } catch (err) {
    console.warn('Menggunakan cache / file JSON lokal:', err.message)
  }

  // Fallback to localStorage or imported static JSON
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (cached) {
    try {
      return JSON.parse(cached)
    } catch {
      // ignore
    }
  }
  return defaultData
}

/**
 * Save entire portfolio data
 */
export async function savePortfolioData(newData) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData))

  try {
    const res = await fetch('/api/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newData)
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || 'Gagal menyimpan data ke file server.')
    }
    return await res.json()
  } catch (err) {
    console.warn('Tersimpan di local storage (karena server offline/static):', err.message)
    return { success: true, savedToLocal: true }
  }
}

/**
 * Upload an image file to local public/assets/img/
 */
export async function uploadImageFile(file) {
  if (!file) throw new Error('File foto tidak ditemukan.')

  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Gagal mengupload gambar ke folder img.')
  }

  return await res.json() // { success: true, url: 'assets/img/nama-file.jpg', filename: '...' }
}

/**
 * Helper to resolve image URLs cleanly
 */
export function thumbUrl(url) {
  if (!url) return 'assets/img/about.jpg'
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }
  if (url.startsWith('/')) {
    return url.slice(1)
  }
  return url
}

/**
 * Add a new item to specific category
 */
export async function addItem(category, item) {
  const currentData = await getPortfolioData()
  const list = currentData[category] || []
  
  const newItem = {
    id: `${category}-${Date.now()}`,
    ...item,
    created_at: new Date().toISOString()
  }

  const updatedData = {
    ...currentData,
    [category]: [newItem, ...list]
  }

  await savePortfolioData(updatedData)
  return newItem
}

/**
 * Delete an item from specific category
 */
export async function deleteItem(category, id) {
  const currentData = await getPortfolioData()
  const list = currentData[category] || []

  const updatedData = {
    ...currentData,
    [category]: list.filter(item => String(item.id) !== String(id))
  }

  await savePortfolioData(updatedData)
  return updatedData
}

/**
 * Update stats
 */
export async function updateStats(newStats) {
  const currentData = await getPortfolioData()
  const updatedData = {
    ...currentData,
    stats: {
      ...currentData.stats,
      ...newStats
    }
  }

  await savePortfolioData(updatedData)
  return updatedData.stats
}
