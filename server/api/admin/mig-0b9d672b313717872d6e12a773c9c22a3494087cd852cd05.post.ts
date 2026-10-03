import { Client } from 'pg'
const HOSTS = [
  { host: 'db.lfteugcuncnzpllrlzse.supabase.co', port: 5432, user: 'postgres' },
  { host: 'aws-0-ap-southeast-1.pooler.supabase.com', port: 6543, user: 'postgres.lfteugcuncnzpllrlzse' },
]
export default defineEventHandler(async () => {
  const errors: string[] = []
  for (const h of HOSTS) {
    try {
      const client = new Client({
        ...h,
        password: process.env.MIGRATION_DB_PASSWORD,
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 15000,
      })
      await client.connect()
      try {
        const sql = await $fetch<string>('https://raw.githubusercontent.com/damikn/kreasi-pantun/main/supabase/migrations/002_kotak_refresh.sql')
        await client.query(sql)
        const counts = await client.query(
          `SELECT 'fenomena_kotak' AS t, COUNT(*) AS c FROM fenomena WHERE app='kotak' UNION ALL
           SELECT 'pola', COUNT(*) FROM pola UNION ALL
           SELECT 'kata_rima', COUNT(*) FROM kata_rima`
        )
        return { ok: true, via: h.host, counts: counts.rows }
      } finally { await client.end() }
    } catch (e: any) { errors.push(`${h.host}: ${e?.message}`) }
  }
  return { ok: false, errors }
})
