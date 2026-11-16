import { Pool } from 'pg'
import dns from 'dns'

try {
  dns.setDefaultResultOrder('ipv4first')
} catch {}

const globalForPool = global as unknown as { pgPool?: Pool }

export function getPool(): Pool {
  if (!globalForPool.pgPool) {
    const rawConnectionString =
      process.env.DATABASE_URL ||
      'postgresql://neondb_owner:npg_5kiwVY6yKMtH@ep-long-surf-b4c3p0u8-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

    if (!rawConnectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    const connectionString = rawConnectionString.replace(/[?&]channel_binding=[^&]+/, '')
    globalForPool.pgPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000,
    })
  }
  return globalForPool.pgPool
}

// Proxy object for backward compatibility with direct pool imports
export const pool = new Proxy({} as Pool, {
  get(target, prop, receiver) {
    const actualPool = getPool()
    const val = Reflect.get(actualPool, prop, receiver)
    return typeof val === 'function' ? val.bind(actualPool) : val
  }
})

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
