import { IFiltersState } from "./types";

export const defaultShoesSizes = [
   {
      title: "UK 5.5",
      quantity: 1000
   },
   {
      title: "UK 6",
      quantity: 1000
   },
   {
      title: "UK 6.5",
      quantity: 1000
   },
   {
      title: "UK 7",
      quantity: 1000
   },
   {
      title: "UK 7.5",
      quantity: 1000
   },
   {
      title: "UK 8",
      quantity: 1000
   },
   {
      title: "UK 8.5",
      quantity: 1000
   },
   {
      title: "UK 9",
      quantity: 1000
   },
   {
      title: "UK 9.5",
      quantity: 1000
   },
   {
      title: "UK 10",
      quantity: 1000
   },
   {
      title: "UK 10.5",
      quantity: 1000
   },
   {
      title: "UK 11",
      quantity: 1000
   },
   {
      title: "UK 11.5",
      quantity: 1000
   },
   {
      title: "UK 12",
      quantity: 1000
   },
   {
      title: "UK 12.5",
      quantity: 1000
   }
]

export const defaultClothSizes = [
   {
      title: "XS",
      quantity: 1000
   },
   {
      title: "S",
      quantity: 1000
   },
   {
      title: "M",
      quantity: 1000
   },
   {
      title: "L",
      quantity: 1000
   },
   {
      title: "XL",
      quantity: 1000
   },
   {
      title: "2XL",
      quantity: 1000
   },
   {
      title: "3XL",
      quantity: 1000
   }
]

export const regexNumbers = /^(\d*)$/

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
