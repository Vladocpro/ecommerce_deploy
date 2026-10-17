import type {CartItem, Category, Gender, Prisma, Role} from "@prisma/client";

// Database types come from the Prisma schema, so they can't drift from it.
// Type-only imports: safe to use in client components.
export type {Address, CartItem, Category, Gender, Order, OrderItem, OrderStatus, ProductImage, ProductVariant, Role} from "@prisma/client";

// A product as the pages use it: with its sizes and stock
export type Product = Prisma.ProductGetPayload<{include: {variants: true}}>

// One line on the cart page: the stored CartItem joined with current product data
export type CartLine = {
   variantId: string,
   size: string,
   stock: number,
   quantity: number,
   product: Product,
}

// The current user as returned by getCurrentUser(): safe to pass to client components
export type User = {
   id:     string,
   name:   string | null,
   email:  string | null,
   image:  string | null,
   role:   Role,
   cart:   CartItem[],
}

export type LoginForm = {
   email: string,
   password: string,
   repPassword: string
}

export type IFiltersState = {
   sortBy: string | null,
   search: string | null,
   sale: boolean,
   price: string[],
   category: Category[],
   gender: Gender[],
   sizes: string[],
   page: number,
};
