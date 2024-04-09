// @ts-nocheck
import prisma from "../../../lib/prismadb";
import {NextResponse} from "next/server";
import {Product} from "../../types";

interface ISize {
   title: string,
   isAvailable: boolean
}

export async function POST(req : any) {
   try {
      const reqFilters = await req.json();
      if(Object.keys(reqFilters).length === 0) {
         const response = await prisma.product.findMany();
         return NextResponse.json(response);
      }

      const filters = [];

      if (reqFilters.sale) {
         filters.push({
            sale: {
               gt: 0,
            },
         });
      }

      if (reqFilters.category && reqFilters.category.length > 0) {
         filters.push({
            category: {
               in: reqFilters.category,
            },
         });
      }

      if (reqFilters.gender && reqFilters.gender.length > 0) {
         filters.push({
            gender: {
               in: reqFilters.gender,
            },
         });
      }

      if (reqFilters.search !== null && reqFilters.search.length > 0) {
         filters.push({
            title: {
               contains: reqFilters.search,
               mode: "insensitive",
            },
         },)
      }

      const response = await prisma.product.findMany({
         where: {
            AND: filters,
         }
      });

      let filteredProducts = response.map((product : Product) => {
         if(product.sale > 0) {
            const newPrice: number = Number((product.price - ((product.price * product.sale) / 100)).toFixed(2))
            return {...product, saledPrice: newPrice}

         } else {
            return {...product, saledPrice: product.price}
         }
      });

      if (reqFilters.price && reqFilters.price.length > 0) {
         filteredProducts = filteredProducts.filter(product => {
            for (let i = 0; i < reqFilters.price.length; i++) {
               const [minPrice, maxPrice] = reqFilters.price[i]
                   .split(' - ')
                   .map((price) => parseInt(price.replace('£', ''), 10));

               if (product.saledPrice >= minPrice && product.saledPrice <= maxPrice) {
                  return true;
               }
            }

            return false;
         })
      }

      if (reqFilters.sizes && reqFilters.sizes.length > 0) {
         filteredProducts = response.filter(product =>
             // @ts-ignore
             product.sizes.some((size : ISize) =>  reqFilters.sizes.find((sizeTitle) => sizeTitle === size.title) && size.isAvailable)
         )
      }

      if (reqFilters.sortBy) {
            if(reqFilters.sortBy === "Price: Low-High")
               filteredProducts = filteredProducts.sort((a, b) => a.saledPrice - b.saledPrice);
            if(reqFilters.sortBy === "Price: High-Low")
               filteredProducts = filteredProducts.sort((a, b) => b.saledPrice - a.saledPrice);
      }

      return NextResponse.json(filteredProducts);

   } catch (error: any) {
      console.log(error)
   }
}
