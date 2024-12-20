"use client"

import React, {FC, useMemo, useState} from 'react';
import  {useRouter, useSearchParams} from "next/navigation";
import qs from "query-string"

interface DropDownOptionsProps {
   title: string,
   titleStyles?: string,
   svgStyles?: string,
   svgBox?: string,
   category?: string,
   isExpanded: boolean,
   showUnderline: boolean,
   options: any[]
}

const inputIsChecked = (filters: string | string[] | boolean, category: string, title: string | boolean) : boolean => {
   if(filters === undefined) return  false
   if(category === "sale") {
      return filters === "true";
   }
   if(Array.isArray(filters)) {
      if(title === "Under £50") {
         return  filters.includes("£0 - £50");
      }
      return filters.includes(title as string);
   } else {
      if(title === "Under £50") {
         return  filters === "£0 - £50";
      }
      return filters === title;
   }
}

export const updatePropertyArray = (updatedQuery: any, category: string, title: string) => {
   if(category in updatedQuery) {
      if(Array.isArray(updatedQuery[category])) {
         if (updatedQuery[category].includes(title)) {
            updatedQuery[category] = updatedQuery[category].filter((iterationPrice: string) => iterationPrice !== title)
         } else {
            updatedQuery[category].push(title)
         }
      } else {
         if(title === updatedQuery[category]) {
            delete updatedQuery[category]
         } else {
            let firstValue = updatedQuery[category]
            updatedQuery[category] = [firstValue, title]
         }
      }
   } else {
      updatedQuery[category] = [title]
   }
   return updatedQuery
}


const DropDownOptions : FC<DropDownOptionsProps> = ({title, titleStyles, svgStyles, svgBox, category, isExpanded, showUnderline,  options}) => {

   const [isOpen, setIsOpen] = useState<boolean>(isExpanded);
   const router = useRouter()
   const params = useSearchParams()
   const parsedParams = useMemo(() => {
      if(params !== undefined && params !== null) {
         return qs.parse(params.toString());
      }
      return  undefined
   }, [params])


   const handleChange = (event: any, title: string) => {
      if(category === undefined) return;
      let currentQuery = {};
      if(params) {
        currentQuery = qs.parse(params.toString())
      }

      let updatedQuery: any = Object.assign({}, currentQuery)

      if(category === "sale") {
         updatedQuery.sale = event.target.checked
      } else {
         updatePropertyArray(updatedQuery, category, title)
      }

      const url = qs.stringifyUrl({
         url: "/store",
         query: updatedQuery
      }, {skipNull: true})

      router.push(url)
   }


   return (
       <div className="relative mb-2 w-full">

          <div className="flex gap-3 items-center px-1 cursor-pointer select-none " onClick={() => setIsOpen(!isOpen)}>
             <div className={`${titleStyles} relative z-10`}>{title}</div>
             <div className={`relative w-8 h-8 ${svgBox}`}>
                <hr className={`absolute h-[2.5px] w-3.5 rounded-xl bottom-[13px] left-0    ${!isOpen ? "rotate-45" : "-rotate-45"} ${svgStyles} transition-all duration-300 bg-black`}/>
                <hr className={`absolute h-[2.5px] w-3.5 rounded-xl bottom-[13px] right-0.5   ${!isOpen ? "-rotate-45" : "rotate-45"}    ${svgStyles}    transition-all duration-300 bg-black`}/>
             </div>
          </div>

          <div
              className={`${isOpen ? "translate-y-2  opacity-100 visible h-auto pointer-events-auto" : "-translate-y-1 opacity-0 invisible h-0 pointer-events-none"} flex flex-col relative gap-[1px] border-0 min-w-max px-1 py-0 transition-all duration-300  rounded-lg select-none right-1`}>
             {options.map((item, index) => (
                 <div className={`flex items-center gap-2.5 bg-white px-3 py-2`} key={item}>
                    <input type="checkbox" id={`${title}Checkbox${index}`}
                           className={`peer relative left-0 h-7 w-7 shrink-0 cursor-pointer appearance-none rounded-md border border-gray-400 checked:border-black  outline-none after:absolute after:left-0
                        after:top-0 after:h-full after:w-full
                        after:bg-[length:53px] after:bg-center after:bg-no-repeat after:content-['']
                        checked:bg-black
                        ${!isOpen && "border-0 checked:bg-transparent"}
                        after:bg-[url('data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjZmZmZmZmIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4PSIwcHgiIHk9IjBweCI+PHRpdGxlPmljb25fYnlfUG9zaGx5YWtvdjEwPC90aXRsZT48ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz48ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjZmZmZmZmIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNi4wMDAwMDAsIDI2LjAwMDAwMCkiPjxwYXRoIGQ9Ik0xNy45OTk5ODc4LDMyLjQgTDEwLjk5OTk4NzgsMjUuNCBDMTAuMjI2Nzg5MSwyNC42MjY4MDE0IDguOTczMTg2NDQsMjQuNjI2ODAxNCA4LjE5OTk4Nzc5LDI1LjQgTDguMTk5OTg3NzksMjUuNCBDNy40MjY3ODkxNCwyNi4xNzMxOTg2IDcuNDI2Nzg5MTQsMjcuNDI2ODAxNCA4LjE5OTk4Nzc5LDI4LjIgTDE2LjU4NTc3NDIsMzYuNTg1Nzg2NCBDMTcuMzY2ODIyOCwzNy4zNjY4MzUgMTguNjMzMTUyOCwzNy4zNjY4MzUgMTkuNDE0MjAxNCwzNi41ODU3ODY0IEw0MC41OTk5ODc4LDE1LjQgQzQxLjM3MzE4NjQsMTQuNjI2ODAxNCA0MS4zNzMxODY0LDEzLjM3MzE5ODYgNDAuNTk5OTg3OCwxMi42IEw0MC41OTk5ODc4LDEyLjYgQzM5LjgyNjc4OTEsMTEuODI2ODAxNCAzOC41NzMxODY0LDExLjgyNjgwMTQgMzcuNzk5OTg3OCwxMi42IEwxNy45OTk5ODc4LDMyLjQgWiI+PC9wYXRoPjwvZz48L2c+PC9nPjwvc3ZnPg==')]`}
                           // @ts-ignore
                           checked={inputIsChecked(parsedParams[category], category, item)}
                           onChange={() => {
                              if(item === "Under £50")
                                 handleChange(event, "£0 - £50")
                              else
                                 handleChange(event, item)
                           }}
                    />
                    <label htmlFor={`${title}Checkbox${index}`} className={`inline-block select-none w-full cursor-pointer  font-normal text-lg text-black ${!isOpen && "text-white"} peer-hover:text-gray-400 {/*peer-checked:text-pink-500*/}`}>
                       {item}
                    </label>
                 </div>
             ))}
          </div>
          {showUnderline && <hr className="h-[0.75px] w-full bg-gray-400 mt-3"/>}
       </div>
   );
};

export default DropDownOptions;
