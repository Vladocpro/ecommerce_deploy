import React from 'react';
import Link from "next/link";

type SearchParams = Record<string, string | string[] | undefined>

interface PaginationProps {
   page: number,
   pageCount: number,
   // The current query, so every page link keeps the filters, sorting and search
   searchParams: SearchParams
}

const pageHref = (searchParams: SearchParams, page: number): string => {
   const query = new URLSearchParams()
   for (const [key, value] of Object.entries(searchParams)) {
      if (key === "page" || value === undefined) continue
      for (const item of Array.isArray(value) ? value : [value]) query.append(key, item)
   }
   // Page 1 has no param, so it shares its URL with the unpaginated store
   if (page > 1) query.set("page", String(page))
   const queryString = query.toString()
   return queryString ? `/store?${queryString}` : "/store"
}

// First, last and the pages around the current one; null marks a gap
const visiblePages = (page: number, pageCount: number): (number | null)[] => {
   if (pageCount <= 7) return Array.from({length: pageCount}, (_, index) => index + 1)
   const pages: (number | null)[] = [1]
   const start = Math.max(2, Math.min(page - 1, pageCount - 3))
   const end = Math.min(pageCount - 1, Math.max(page + 1, 4))
   if (start > 2) pages.push(null)
   for (let current = start; current <= end; current++) pages.push(current)
   if (end < pageCount - 1) pages.push(null)
   pages.push(pageCount)
   return pages
}

const stepStyles = "px-4 py-1.5 rounded-full border-2 font-medium"

const Pagination = ({page, pageCount, searchParams}: PaginationProps) => {
   if (pageCount <= 1) return null

   const hasPrevious = page > 1
   const hasNext = page < pageCount

   return (
       <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2 text-lg mb-10">
          {hasPrevious ? (
              <Link href={pageHref(searchParams, Math.min(page - 1, pageCount))} className={`${stepStyles} border-gray-300 hover:border-black transition-all duration-100`}>Previous</Link>
          ) : (
              <span aria-disabled="true" className={`${stepStyles} border-gray-200 text-gray-300`}>Previous</span>
          )}

          <ul className="flex items-center gap-1">
             {visiblePages(page, pageCount).map((item, index) => (
                 <li key={item ?? `gap-${index}`}>
                    {item === null ? (
                        <span aria-hidden="true" className="px-2 text-gray-500">…</span>
                    ) : (
                        <Link href={pageHref(searchParams, item)} aria-current={item === page ? "page" : undefined}
                              aria-label={`Page ${item}`}
                              className={`flex items-center justify-center h-10 min-w-10 px-2 rounded-full transition-all duration-100 ${item === page ? "bg-black text-white" : "hover:bg-gray-200"}`}>
                           {item}
                        </Link>
                    )}
                 </li>
             ))}
          </ul>

          {hasNext ? (
              <Link href={pageHref(searchParams, page + 1)} className={`${stepStyles} border-gray-300 hover:border-black transition-all duration-100`}>Next</Link>
          ) : (
              <span aria-disabled="true" className={`${stepStyles} border-gray-200 text-gray-300`}>Next</span>
          )}
       </nav>
   );
};

export default Pagination;
