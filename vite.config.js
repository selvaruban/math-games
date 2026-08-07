import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, 'data', 'users.json')

// Tiny in-process API (no extra dependencies) that stores the shared player
// data in a single JSON file on this computer. Every device on the network
// reads/writes the same file, so players appear everywhere.
function usersApiPlugin() {
  return {
    name: 'users-api',
    configureServer(server) {
      registerMiddleware(server.middlewares)
    },
    configurePreviewServer(server) {
      registerMiddleware(server.middlewares)
    },
  }
}

function registerMiddleware(middlewares) {
  middlewares.use('/api/users', async (req, res) => {
    try {
      if (req.method === 'GET') {
        const data = await readData()
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(data))
        return
      }
      if (req.method === 'POST') {
        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', async () => {
          const incoming = JSON.parse(body)
          const existing = await readData()
          const merged = mergeUsers(existing, incoming)
          await writeData(merged)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(merged))
        })
        return
      }
      res.statusCode = 405
      res.end()
    } catch (err) {
      console.error('users API error:', err)
      res.statusCode = 500
      res.end(JSON.stringify({ error: String(err) }))
    }
  })
}

async function readData() {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, 'utf8'))
  } catch {
    return { users: [], activeId: null }
  }
}

async function writeData(data) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

function mergeUsers(existing, incoming) {
  const map = new Map()
  for (const u of existing.users ?? []) map.set(u.id, u)
  // Newly posted data wins for players it knows about.
  for (const u of incoming.users ?? []) map.set(u.id, u)
  for (const id of incoming.deletedIds ?? []) map.delete(id)
  return {
    users: [...map.values()],
    activeId: incoming.activeId !== undefined ? incoming.activeId : existing.activeId ?? null,
  }
}

export default defineConfig({
  plugins: [react(), usersApiPlugin()],
  base: '/math-games/',
  server: {
    // Listen on all network interfaces so phones/tablets on the same
    // Wi-Fi can open the app at http://<this-computer-ip>:5173/
    host: true,
    port: 5173,
  },
})
