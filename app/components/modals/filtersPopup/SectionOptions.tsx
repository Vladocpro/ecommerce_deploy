"use client"

import React, {FC} from 'react';
import {IFiltersState} from "../../../types";
import {FilterOption} from "../../../constants";

export type CheckboxCategory = "sale" | "price" | "category" | "gender"

interface SectionOptionsProps {
   handleChange: (category: CheckboxCategory, value: string, checked: boolean) => void,
   category: CheckboxCategory,
   // `value` is what the filters hold (and the URL), `label` is shown
   options: FilterOption[],
   tempFilters: IFiltersState
}

const isChecked = (tempFilters: IFiltersState, category: CheckboxCategory, value: string): boolean => {
   switch (category) {
      case "sale":
         return tempFilters.sale;
      case "price":
         return tempFilters.price.includes(value);
      case "category":
         return (tempFilters.category as string[]).includes(value);
      case "gender":
         return (tempFilters.gender as string[]).includes(value);
   }
}

const SectionOptions : FC<SectionOptionsProps> = ({handleChange, category,  options, tempFilters}) => {

   return (
       <div className="mt-3">
       {options.map((item, index) => (
              <div className="flex items-center gap-2.5 bg-white pr-3 py-2" key={item.value} >
                 <input type="checkbox" id={`${category}PopupCheckbox${index}`}
                        className={`peer relative left-0 h-7 w-7 shrink-0 cursor-pointer appearance-none rounded-md border border-gray-400 checked:border-black  outline-none after:absolute after:left-0
                        after:top-0 after:h-full after:w-full
                        after:bg-[length:53px] after:bg-center after:bg-no-repeat after:content-['']
                        checked:bg-black
                        after:bg-[url('data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjZmZmZmZmIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4PSIwcHgiIHk9IjBweCI+PHRpdGxlPmljb25fYnlfUG9zaGx5YWtvdjEwPC90aXRsZT48ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz48ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjZmZmZmZmIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNi4wMDAwMDAsIDI2LjAwMDAwMCkiPjxwYXRoIGQ9Ik0xNy45OTk5ODc4LDMyLjQgTDEwLjk5OTk4NzgsMjUuNCBDMTAuMjI2Nzg5MSwyNC42MjY4MDE0IDguOTczMTg2NDQsMjQuNjI2ODAxNCA4LjE5OTk4Nzc5LDI1LjQgTDguMTk5OTg3NzksMjUuNCBDNy40MjY3ODkxNCwyNi4xNzMxOTg2IDcuNDI2Nzg5MTQsMjcuNDI2ODAxNCA4LjE5OTk4Nzc5LDI4LjIgTDE2LjU4NTc3NDIsMzYuNTg1Nzg2NCBDMTcuMzY2ODIyOCwzNy4zNjY4MzUgMTguNjMzMTUyOCwzNy4zNjY4MzUgMTkuNDE0MjAxNCwzNi41ODU3ODY0IEw0MC41OTk5ODc4LDE1LjQgQzQxLjM3MzE4NjQsMTQuNjI2ODAxNCA0MS4zNzMxODY0LDEzLjM3MzE5ODYgNDAuNTk5OTg3OCwxMi42IEw0MC41OTk5ODc4LDEyLjYgQzM5LjgyNjc4OTEsMTEuODI2ODAxNCAzOC41NzMxODY0LDExLjgyNjgwMTQgMzcuNzk5OTg3OCwxMi42IEwxNy45OTk5ODc4LDMyLjQgWiI+PC9wYXRoPjwvZz48L2c+PC9nPjwvc3ZnPg==')]`}
                        onChange={(event) => handleChange(category, item.value, event.target.checked)}
                        checked={isChecked(tempFilters, category, item.value)}
                 />
                 <label htmlFor={`${category}PopupCheckbox${index}`} className={`inline-block select-none w-full cursor-pointer  font-normal text-lg text-black  peer-hover:text-gray-500`}>
                    {item.label}
                 </label>
              </div>
          ))}
       </div>
   );
};

export default SectionOptions;
