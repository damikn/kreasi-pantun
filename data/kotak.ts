// Data master KOTAK KREASI — diambil dari content/kotak/*.json
// (disalin dari repo damikn/Kotak-Kreasi/content).
import phenomenaJson from '~/content/kotak/phenomena.json'
import polaJson from '~/content/kotak/pola.json'
import rhymeJson from '~/content/kotak/rhyme-words.json'
import menusJson from '~/content/kotak/menus.json'

export interface KotakFenomena {
  id: number
  slug: string
  name: string
  icon: string
  color: string
  description: string
  contoh: string
}

export interface KotakPola {
  id: number
  nama: string
  deskripsi_sampiran: string
  deskripsi_isi: string
  aturan: string
  ruleType: string
  contoh: string[]
}

export interface RhymeEntry {
  kata_benda: string[]
  kata_kerja: string[]
  kata_sifat: string[]
}

export interface KotakMenu {
  id: number
  step: number
  label: string
  icon: string
  desc: string
}

const p = phenomenaJson as unknown as { body: KotakFenomena[] }
const pl = polaJson as unknown as { body: KotakPola[] }
const m = menusJson as unknown as { body: KotakMenu[] }

export const kotakPhenomena: KotakFenomena[] = p.body
export const kotakPolaList: KotakPola[] = pl.body
export const rhymeWords = rhymeJson as unknown as Record<string, RhymeEntry>
export const rhymeSuffixes: string[] = Object.keys(rhymeWords)
export const kotakMenus: KotakMenu[] = m.body
/** Label 4 langkah untuk StepBar: Kembangkan Fenomena, Rangkai Pola, Eksplorasi Rima, Ciptakan Pantun */
export const stepLabels: string[] = m.body.map(x => x.label)

export const kategoriLabel: Record<keyof RhymeEntry, string> = {
  kata_benda: 'Kata Benda',
  kata_kerja: 'Kata Kerja',
  kata_sifat: 'Kata Sifat',
}
