import { IFiltersState } from "./types";

export const fillFilterObject = (filters: any) => {
   let initialBody: IFiltersState  = {
      sortBy: null,
      search: null,
      sale: false,
      price: [],
      category: [],
      gender: [],
      sizes: [],
   };
   if(!filters|| !Object.keys(filters).length) return initialBody
   for (let key in initialBody) {
      if (key in filters) {
         if(typeof filters[key] === "string" && ["price", "category","gender","sizes"].some((category) => category === key)) {
            // @ts-ignore
            initialBody[key].push(filters[key])
         } else {
            // @ts-ignore
            initialBody[key] = filters[key];
            if(key === "sale") {
               initialBody[key] = filters.sale === "true";
            }
         }
      }
   }

   return initialBody
}