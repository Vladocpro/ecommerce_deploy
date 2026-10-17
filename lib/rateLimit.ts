import {Prisma} from "@prisma/client";
import prisma from "./prismadb";

// Prisma can't declare TTL indexes, and `prisma db push` drops indexes that aren't in the schema,
// so the app makes sure it exists: once per server instance, a no-op when it's already there.
// MongoDB then deletes each counter by itself once its window has expired.
let ttlIndex: Promise<unknown> | null = null
function ensureTtlIndex() {
   ttlIndex ??= prisma.$runCommandRaw({
      createIndexes: "RateLimit",
      indexes: [{key: {expiresAt: 1}, name: "RateLimit_expiresAt_ttl", expireAfterSeconds: 0}],
   }).catch((error) => {
      ttlIndex = null
      console.error("Couldn't create the RateLimit TTL index", error)
   })
   return ttlIndex
}

// Counts attempts per key in fixed time windows, stored in MongoDB so the limit works
// across serverless instances (an in-memory counter would reset on every cold start).
// Returns true while the caller is under `limit` attempts in the current window.
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
   await ensureTtlIndex()
   const windowStart = Math.floor(Date.now() / 1000 / windowSeconds) * windowSeconds
   const windowKey = `${key}:${windowStart}`
   const expiresAt = new Date((windowStart + windowSeconds) * 1000)

   try {
      const entry = await prisma.rateLimit.upsert({
         where: {key: windowKey},
         create: {key: windowKey, count: 1, expiresAt},
         update: {count: {increment: 1}},
      })
      return entry.count <= limit
   } catch (error) {
      // Two first attempts in the same window raced on the unique key; the other one created it
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
         return rateLimit(key, limit, windowSeconds)
      }
      // Never lock users out because the limiter itself failed
      console.error("Rate limiter failed", error)
      return true
   }
}

// Best-effort client IP behind Vercel's proxy
export function getClientIp(headers: Headers | Record<string, string | string[] | undefined> | undefined): string {
   const value = headers instanceof Headers
       ? headers.get("x-forwarded-for")
       : headers?.["x-forwarded-for"]
   const forwardedFor = Array.isArray(value) ? value[0] : value
   return forwardedFor?.split(",")[0].trim() || "unknown"
}
