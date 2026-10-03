// Endpoint migrasi SATU KALI PAKAI — dihapus setelah dipakai.
// Menjalankan supabase/migrations/002_kotak_refresh.sql ke Postgres Supabase.
import { Client } from 'pg'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<{ secret?: string }>(event).catch(() => ({}))
  if (!config.migrateSecret || body.secret !== config.migrateSecret) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  const client = new Client({
    host: 'db.lfteugcuncnzpllrlzse.supabase.co',
    port: 5432,
    user: 'postgres',
    password: config.dbPassword,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  })
  await client.connect()
  try {
    const sql = await $fetch<string>(
      'https://raw.githubusercontent.com/damikn/kreasi-pantun/main/supabase/migrations/002_kotak_refresh.sql'
    )
    await client.query(sql)
    const counts = await client.query(
      `SELECT 'fenomena_kotak' AS t, COUNT(*) AS c FROM fenomena WHERE app='kotak' UNION ALL
       SELECT 'pola', COUNT(*) FROM pola UNION ALL
       SELECT 'kata_rima', COUNT(*) FROM kata_rima`
    )
    return { ok: true, counts: counts.rows }
  } finally {
    await client.end()
  }
})
