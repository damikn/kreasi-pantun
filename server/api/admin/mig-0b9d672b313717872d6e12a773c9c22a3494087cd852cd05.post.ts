import { Client } from 'pg'
const REGIONS = ['ap-southeast-3', 'ap-southeast-2', 'ap-northeast-1', 'ap-south-1', 'ap-northeast-2', 'us-east-1', 'eu-west-1']
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  if (q.probe) {
    // mode probe: cari region yang benar
    const out: string[] = []
    for (const r of REGIONS) {
      try {
        const c = new Client({
          host: `aws-0-${r}.pooler.supabase.com`, port: 6543,
          user: 'postgres.lfteugcuncnzpllrlzse',
          password: process.env.MIGRATION_DB_PASSWORD, database: 'postgres',
          ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000,
        })
        await c.connect()
        await c.query('select 1')
        await c.end()
        out.push(`${r}: OK`)
      } catch (e: any) { out.push(`${r}: ${String(e?.message).slice(0, 80)}`) }
    }
    return { out }
  }
  return { ok: false, error: 'use ?probe=1' }
})
