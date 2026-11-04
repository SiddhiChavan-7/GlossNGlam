import { Pool } from 'pg'
import dns from 'dns'

try {
  dns.setDefaultResultOrder('ipv4first')
} catch {}

const rawConnectionString = process.env.DATABASE_URL

if (!rawConnectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Strip channel_binding=require if present, which causes timeouts with node-postgres
const connectionString = rawConnectionString.replace(/[?&]channel_binding=[^&]+/, '')

// Use a global pool to avoid re-creating connections on every hot reload in dev
const globalForPool = global as unknown as { pgPool: Pool }

export const pool = globalForPool.pgPool ?? new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
})

if (process.env.NODE_ENV !== 'production') {
  globalForPool.pgPool = pool
}

/** Helper: run a parameterised query and return rows */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const { rows } = await pool.query(sql, params)
  return rows as T[]
}

/** Helper: run a query and return exactly one row (or null) */
export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows[0] ?? null
}
