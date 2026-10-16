import type {Category, Gender, IFiltersState, OrderStatus} from "./types";

// Single source of truth for the catalogue's filter values (store sidebar, mobile filters popup, admin forms)
export const CLOTH_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"]
export const SHOE_SIZES = ["UK 5.5", "UK 6", "UK 6.5", "UK 7", "UK 7.5", "UK 8", "UK 8.5", "UK 9", "UK 9.5", "UK 10", "UK 10.5", "UK 11", "UK 11.5", "UK 12", "UK 12.5"]
export const ALL_SIZES = [...CLOTH_SIZES, ...SHOE_SIZES]
export const sizesForCategory = (category: Category) => category === "Shoes" ? SHOE_SIZES : CLOTH_SIZES

// Enum value (stored in the database and used in URLs) -> label shown to the user
export const CATEGORY_LABELS: Record<Category, string> = {
   Shoes: "Shoes",
   Trousers: "Trousers",
   TShirt: "T-Shirt",
   Jacket: "Jacket",
}
export const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[]
export const GENDERS: Gender[] = ["Men", "Women"]

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
   Paid: "Paid",
   Shipped: "Shipped",
   Delivered: "Delivered",
   Cancelled: "Cancelled",
   Refunded: "Refunded",
}

export const SORT_OPTIONS = ["Featured", "Price: High-Low", "Price: Low-High"]

// `value` goes in the URL, min/max are in pence (max exclusive)
export const PRICE_RANGES = [
   {value: "0-50", label: "Under £50", min: 0, max: 5000},
   {value: "50-100", label: "£50 - £100", min: 5000, max: 10000},
   {value: "100-200", label: "£100 - £200", min: 10000, max: 20000},
]

export const PRODUCTS_PER_PAGE = 12

// Stock suggested by the admin form for each size of a new product
export const DEFAULT_STOCK = 100

export const regexNumbers = /^(\d*)$/

// Shape of both Next's `searchParams` and query-string's `qs.parse()` output
type RawFilters = Record<string, string | (string | null)[] | null | undefined>

const toList = (value: RawFilters[string]): string[] => {
   if (value === undefined || value === null) return []
   const values = Array.isArray(value) ? value : [value]
   return values.filter((item): item is string => typeof item === "string" && item !== "")
}

const toSingle = (value: RawFilters[string]): string | null => {
   const first = Array.isArray(value) ? value[0] : value
   return first ? first : null
}

// Unknown values in the URL are dropped instead of reaching the database query
export const fillFilterObject = (filters?: RawFilters | null): IFiltersState => ({
   sortBy: toSingle(filters?.sortBy),
   search: toSingle(filters?.search),
   sale: filters?.sale === "true",
   price: toList(filters?.price).filter((value) => PRICE_RANGES.some((range) => range.value === value)),
   category: toList(filters?.category).filter((value): value is Category => value in CATEGORY_LABELS),
   gender: toList(filters?.gender).filter((value): value is Gender => (GENDERS as string[]).includes(value)),
   sizes: toList(filters?.sizes).filter((value) => ALL_SIZES.includes(value)),
   page: Math.max(1, parseInt(toSingle(filters?.page) ?? "1", 10) || 1),
})

// Highest quantity of one size the cart page offers (mirrors MAX_ITEM_QUANTITY in lib/cart.ts, which can't be imported client side)
export const MAX_ITEM_QUANTITY = 9

// Checkbox options of the store filters: `value` goes in the URL, `label` is shown (PRICE_RANGES has the same shape)
export type FilterOption = {value: string, label: string}
const asOptions = (values: string[]): FilterOption[] => values.map((value) => ({value, label: value}))
export const SALE_OPTIONS: FilterOption[] = [{value: "true", label: "Sale"}]
export const CATEGORY_OPTIONS: FilterOption[] = CATEGORIES.map((value) => ({value, label: CATEGORY_LABELS[value]}))
export const GENDER_OPTIONS: FilterOption[] = asOptions(GENDERS)
export const SIZE_OPTIONS: FilterOption[] = asOptions(ALL_SIZES)
