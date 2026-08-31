import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function localApiPlugin() {
  return {
    name: 'local-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : ''

        // 1. GET /api/data -> Read portfolioData.json
        if (url === '/api/data' && req.method === 'GET') {
          try {
            const dataPath = path.resolve(process.cwd(), 'src/data/portfolioData.json')
            if (!fs.existsSync(dataPath)) {
              fs.writeFileSync(dataPath, JSON.stringify({ stats: {}, websites: [], designs: [], videos: [], dokumentasi: [] }, null, 2))
            }
            const content = fs.readFileSync(dataPath, 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end(content)
          } catch (e) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: e.message }))
          }
          return
        }

        // 2. POST /api/save-data -> Write to portfolioData.json
        if (url === '/api/save-data' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const dataPath = path.resolve(process.cwd(), 'src/data/portfolioData.json')
              const parsed = JSON.parse(body)
              fs.writeFileSync(dataPath, JSON.stringify(parsed, null, 2), 'utf-8')
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true }))
            } catch (e) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: e.message }))
            }
          })
          return
        }

        // 3. POST /api/upload -> Upload image into public/assets/img & assets/img
        if (url === '/api/upload' && req.method === 'POST') {
          const contentType = req.headers['content-type'] || ''
          const boundaryMatch = contentType.match(/boundary=(.+)$/)

          if (!boundaryMatch) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Invalid multipart boundary' }))
            return
          }

          const boundary = boundaryMatch[1].trim().replace(/^"|"$/g, '')
          const chunks = []

          req.on('data', chunk => chunks.push(chunk))
          req.on('end', () => {
            try {
              const buffer = Buffer.concat(chunks)
              const boundaryBuf = Buffer.from('--' + boundary)
              const headerSplit = Buffer.from('\r\n\r\n')

              const startIdx = buffer.indexOf(boundaryBuf)
              if (startIdx === -1) {
                throw new Error('Form boundary not found in payload')
              }

              const headerStart = startIdx + boundaryBuf.length + 2
              const headerEnd = buffer.indexOf(headerSplit, headerStart)
              if (headerEnd === -1) {
                throw new Error('Form headers not found')
              }

              const headers = buffer.slice(headerStart, headerEnd).toString('utf-8')
              const filenameMatch = headers.match(/filename="([^"]+)"/)
              if (!filenameMatch) {
                throw new Error('Filename not found in form data')
              }

              const rawName = path.basename(filenameMatch[1])
              const ext = path.extname(rawName) || '.jpg'
              const cleanBase = path.basename(rawName, ext).replace(/[^a-zA-Z0-9_-]/g, '_')
              const finalFilename = `${Date.now()}_${cleanBase}${ext}`

              const dataStart = headerEnd + headerSplit.length
              const nextBoundary = buffer.indexOf(boundaryBuf, dataStart)
              if (nextBoundary === -1) {
                throw new Error('Next boundary not found')
              }

              const fileData = buffer.slice(dataStart, nextBoundary - 2)

              // Ensure directories exist
              const publicImgDir = path.resolve(process.cwd(), 'public/assets/img')
              const rootImgDir = path.resolve(process.cwd(), 'assets/img')
              
              if (!fs.existsSync(publicImgDir)) fs.mkdirSync(publicImgDir, { recursive: true })
              if (!fs.existsSync(rootImgDir)) fs.mkdirSync(rootImgDir, { recursive: true })

              // Save to public/assets/img and assets/img
              fs.writeFileSync(path.join(publicImgDir, finalFilename), fileData)
              fs.writeFileSync(path.join(rootImgDir, finalFilename), fileData)

              const relativeUrl = `assets/img/${finalFilename}`

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                success: true,
                url: relativeUrl,
                filename: finalFilename
              }))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })
          return
        }

        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  server: {
    port: 3000
  }
})
