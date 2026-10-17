"use client"

import React, {FC, useMemo, useState} from 'react';
import  {useRouter, useSearchParams} from "next/navigation";
import qs from "query-string"
import {FilterOption} from "../../constants";

interface DropDownOptionsProps {
   title: string,
   titleStyles?: string,
   svgStyles?: string,
   svgBox?: string,
   category?: string,
   isExpanded: boolean,
   showUnderline: boolean,
   // `value` is written to the URL, `label` is shown
   options: FilterOption[]
}

type QueryValue = string | (string | null)[] | null | undefined

const inputIsChecked = (value: QueryValue, category: string | undefined, optionValue: string) : boolean => {
   if(value === undefined || value === null) return false
   if(category === "sale") {
      return value === "true";
   }
   return Array.isArray(value) ? value.includes(optionValue) : value === optionValue
}

export const updatePropertyArray = (updatedQuery: qs.ParsedQuery, category: string, title: string) => {
   const current = updatedQuery[category]
   if(current === undefined || current === null) {
      updatedQuery[category] = [title]
   } else if(Array.isArray(current)) {
      updatedQuery[category] = current.includes(title) ? current.filter((item) => item !== title) : [...current, title]
   } else if(current === title) {
      delete updatedQuery[category]
   } else {
      updatedQuery[category] = [current, title]
   }
   return updatedQuery
}


const DropDownOptions : FC<DropDownOptionsProps> = ({title, titleStyles, svgStyles, svgBox, category, isExpanded, showUnderline,  options}) => {

   const [isOpen, setIsOpen] = useState<boolean>(isExpanded);
   const router = useRouter()
   const params = useSearchParams()
   const parsedParams = useMemo(() => qs.parse(params?.toString() ?? ""), [params])


   const handleChange = (checked: boolean, optionValue: string) => {
      if(category === undefined) return;
      const updatedQuery: qs.ParsedQuery = {...parsedParams}
      // A different filter means a different result set: start again from the first page
      delete updatedQuery.page

      if(category === "sale") {
         if(checked) updatedQuery.sale = "true"
         else delete updatedQuery.sale
      } else {
         updatePropertyArray(updatedQuery, category, optionValue)
      }

      const url = qs.stringifyUrl({
         url: "/store",
         query: updatedQuery
      }, {skipNull: true})

      router.push(url)
   }

   const listId = `${title.replace(/\s+/g, "")}Options`

   return (
       <div className="relative mb-2 w-full">

          <button type="button" aria-expanded={isOpen} aria-controls={listId} className="flex gap-3 items-center px-1 cursor-pointer select-none w-full text-left" onClick={() => setIsOpen(!isOpen)}>
             <div className={`${titleStyles ?? ""} relative z-10`}>{title}</div>
             <div className={`relative w-8 h-8 ${svgBox ?? ""}`} aria-hidden="true">
                <hr className={`absolute h-[2.5px] w-3.5 rounded-xl bottom-[13px] left-0    ${!isOpen ? "rotate-45" : "-rotate-45"} ${svgStyles ?? ""} transition-all duration-300 bg-black`}/>
                <hr className={`absolute h-[2.5px] w-3.5 rounded-xl bottom-[13px] right-0.5   ${!isOpen ? "-rotate-45" : "rotate-45"}    ${svgStyles ?? ""}    transition-all duration-300 bg-black`}/>
             </div>
          </button>

          <div
              id={listId}
              className={`${isOpen ? "translate-y-2  opacity-100 visible h-auto pointer-events-auto" : "-translate-y-1 opacity-0 invisible h-0 pointer-events-none"} flex flex-col relative gap-[1px] border-0 min-w-max px-1 py-0 transition-all duration-300  rounded-lg select-none right-1`}>
             {options.map((item, index) => (
                 <div className={`flex items-center gap-2.5 bg-white px-3 py-2`} key={item.value}>
                    <input type="checkbox" id={`${title}Checkbox${index}`}
                           className={`peer relative left-0 h-7 w-7 shrink-0 cursor-pointer appearance-none rounded-md border border-gray-400 checked:border-black  outline-none after:absolute after:left-0
                        after:top-0 after:h-full after:w-full
                        after:bg-[length:53px] after:bg-center after:bg-no-repeat after:content-['']
                        checked:bg-black
                        ${!isOpen && "border-0 checked:bg-transparent"}
                        after:bg-[url('data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjZmZmZmZmIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4PSIwcHgiIHk9IjBweCI+PHRpdGxlPmljb25fYnlfUG9zaGx5YWtvdjEwPC90aXRsZT48ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz48ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjZmZmZmZmIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNi4wMDAwMDAsIDI2LjAwMDAwMCkiPjxwYXRoIGQ9Ik0xNy45OTk5ODc4LDMyLjQgTDEwLjk5OTk4NzgsMjUuNCBDMTAuMjI2Nzg5MSwyNC42MjY4MDE0IDguOTczMTg2NDQsMjQuNjI2ODAxNCA4LjE5OTk4Nzc5LDI1LjQgTDguMTk5OTg3NzksMjUuNCBDNy40MjY3ODkxNCwyNi4xNzMxOTg2IDcuNDI2Nzg5MTQsMjcuNDI2ODAxNCA4LjE5OTk4Nzc5LDI4LjIgTDE2LjU4NTc3NDIsMzYuNTg1Nzg2NCBDMTcuMzY2ODIyOCwzNy4zNjY4MzUgMTguNjMzMTUyOCwzNy4zNjY4MzUgMTkuNDE0MjAxNCwzNi41ODU3ODY0IEw0MC41OTk5ODc4LDE1LjQgQzQxLjM3MzE4NjQsMTQuNjI2ODAxNCA0MS4zNzMxODY0LDEzLjM3MzE5ODYgNDAuNTk5OTg3OCwxMi42IEw0MC41OTk5ODc4LDEyLjYgQzM5LjgyNjc4OTEsMTEuODI2ODAxNCAzOC41NzMxODY0LDExLjgyNjgwMTQgMzcuNzk5OTg3OCwxMi42IEwxNy45OTk5ODc4LDMyLjQgWiI+PC9wYXRoPjwvZz48L2c+PC9nPjwvc3ZnPg==')]`}
                           checked={inputIsChecked(category ? parsedParams[category] : undefined, category, item.value)}
                           onChange={(event) => handleChange(event.target.checked, item.value)}
                    />
                    <label htmlFor={`${title}Checkbox${index}`} className={`inline-block select-none w-full cursor-pointer  font-normal text-lg text-black ${!isOpen && "text-white"} peer-hover:text-gray-400`}>
                       {item.label}
                    </label>
                 </div>
             ))}
          </div>
          {showUnderline && <hr className="h-[0.75px] w-full bg-gray-400 mt-3"/>}
       </div>
   );
};

export default DropDownOptions;
