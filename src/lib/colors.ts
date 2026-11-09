import { Product } from './types'

export interface ColorFamily {
  id: string
  name: string
  hex: string
  border?: string
  textColor?: string
  synonyms: string[]
}

export const COLOR_FAMILIES: ColorFamily[] = [
  {
    id: 'red',
    name: 'Red',
    hex: '#DC2626',
    border: 'border-red-500',
    synonyms: ['red', 'ruby', 'crimson', 'cherry', 'maroon', 'burgundy', 'wine', 'scarlet', 'blood', 'rose red'],
  },
  {
    id: 'pink',
    name: 'Pink',
    hex: '#EC4899',
    border: 'border-pink-400',
    synonyms: ['pink', 'blush', 'rose', 'fuchsia', 'magenta', 'coral', 'salmon', 'bubblegum', 'cotton candy', 'baby pink'],
  },
  {
    id: 'nude',
    name: 'Nude',
    hex: '#D4B896',
    border: 'border-amber-300',
    synonyms: ['nude', 'beige', 'neutral', 'tan', 'cream', 'taupe', 'latte', 'skin', 'natural', 'sand', 'caramel'],
  },
  {
    id: 'purple',
    name: 'Purple',
    hex: '#9333EA',
    border: 'border-purple-400',
    synonyms: ['purple', 'lavender', 'violet', 'lilac', 'plum', 'mauve', 'amethyst', 'berry', 'grape', 'indigo'],
  },
  {
    id: 'white',
    name: 'White',
    hex: '#FFFFFF',
    border: 'border-gray-300',
    synonyms: ['white', 'milky', 'milk', 'pearl', 'ivory', 'french', 'vanilla', 'snow', 'chalk', 'clean', 'glazed'],
  },
  {
    id: 'black',
    name: 'Black',
    hex: '#18181B',
    border: 'border-black',
    synonyms: ['black', 'noir', 'midnight', 'onyx', 'dark', 'charcoal', 'goth', 'jet'],
  },
  {
    id: 'blue',
    name: 'Blue',
    hex: '#2563EB',
    border: 'border-blue-500',
    synonyms: ['blue', 'navy', 'sky', 'ocean', 'sapphire', 'indigo', 'teal', 'cyan', 'baby blue', 'azure'],
  },
  {
    id: 'green',
    name: 'Green',
    hex: '#059669',
    border: 'border-emerald-500',
    synonyms: ['green', 'emerald', 'sage', 'mint', 'olive', 'forest', 'jade', 'matcha', 'lime'],
  },
  {
    id: 'brown',
    name: 'Brown',
    hex: '#78350F',
    border: 'border-amber-800',
    synonyms: ['brown', 'chocolate', 'espresso', 'coffee', 'mocha', 'caramel', 'chestnut', 'cocoa'],
  },
  {
    id: 'gold',
    name: 'Gold',
    hex: '#F59E0B',
    border: 'border-amber-400',
    synonyms: ['gold', 'golden', 'champagne', 'bronze', 'metallic', 'glitter', 'shimmer', 'sparkle'],
  },
  {
    id: 'silver',
    name: 'Silver',
    hex: '#E2E8F0',
    border: 'border-slate-300',
    synonyms: ['silver', 'chrome', 'metallic', 'platinum', 'mirror', 'glaze', 'glazed'],
  },
]

/**
 * Checks if a given search text matches a product via color synonym recognition or product tags.
 */
export function matchesSearchWithColorIntelligence(product: Product, query: string): boolean {
  if (!query || !query.trim()) return true
  const q = query.toLowerCase().trim()

  // 1. Direct match on name, description, category
  const name = (product.name || '').toLowerCase()
  const desc = (product.description || '').toLowerCase()
  const cat = (product.categories?.name || '').toLowerCase()
  const colors = (product.colors || []).map(c => c.toLowerCase())

  if (name.includes(q) || desc.includes(q) || cat.includes(q) || colors.includes(q)) {
    return true
  }

  // 2. Color Intelligence: Find any color family matching the query
  for (const family of COLOR_FAMILIES) {
    const queryMatchesFamily =
      family.id === q ||
      family.name.toLowerCase() === q ||
      family.synonyms.some(syn => syn.includes(q) || q.includes(syn))

    if (queryMatchesFamily) {
      // Check if product has this color in its colors array
      if (colors.includes(family.id)) return true

      // Check if product's name, description, or category matches any synonym of this color family
      const productMatchesAnySynonym = family.synonyms.some(
        syn => name.includes(syn) || desc.includes(syn) || cat.includes(syn)
      )

      if (productMatchesAnySynonym) {
        return true
      }
    }
  }

  return false
}

/**
 * Filter a list of products by a selected color family ID (e.g. 'red', 'pink')
 */
export function filterProductsByColorFamily(product: Product, colorId: string): boolean {
  if (!colorId || colorId === 'All') return true
  const targetId = colorId.toLowerCase().trim()
  const family = COLOR_FAMILIES.find(f => f.id === targetId)

  const colors = (product.colors || []).map(c => c.toLowerCase())
  if (colors.includes(targetId)) return true

  if (family) {
    const name = (product.name || '').toLowerCase()
    const desc = (product.description || '').toLowerCase()
    const cat = (product.categories?.name || '').toLowerCase()

    return family.synonyms.some(syn => name.includes(syn) || desc.includes(syn) || cat.includes(syn))
  }

  return false
}
