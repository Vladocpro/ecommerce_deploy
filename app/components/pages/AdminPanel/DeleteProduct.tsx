"use client"

import React, {useState} from 'react';
import ProductSearch from "../../ProductSearch";
import axios from "axios";
import {useRouter} from "next/navigation";
import useNotify from "../../useNotify";
import {Product} from "../../../types";

const DeleteProduct = () => {

   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
   const [isDeleting, setIsDeleting] = useState<boolean>(false)
   const notify = useNotify()
   const router = useRouter();

   // Archives the product: it disappears from the store, but past orders keep their details
   // and it can be restored from "Update Product"
   const handleDeleteProduct = async () => {
      if(selectedProduct === null) return
      setIsDeleting(true)
      try {
         const response = await axios.delete("/api/product", {data: {id: selectedProduct.id}})
         notify.success(response.data.message)
         setSelectedProduct(null)
         router.refresh()
      } catch (error) {
         notify.requestError(error, "Couldn't remove the product")
      } finally {
         setIsDeleting(false)
      }
   }

   return (
       <div className="flex flex-col mt-6">
          <ProductSearch selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct}/>
          <p className="text-gray-500 mt-6">Removed products are hidden from the store. Past orders keep them, and you can restore one from &quot;Update Product&quot;.</p>
          <button
              type="button" disabled={selectedProduct === null || selectedProduct.archived || isDeleting}
              className="py-3 w-full mx-auto rounded-lg bg-black text-white font-bold mb-10 mt-6 disabled:opacity-60" onClick={handleDeleteProduct}>
             {isDeleting ? "Removing..." : selectedProduct?.archived ? "Already removed" : "Remove Product"}
          </button>
       </div>
   );
};

export default DeleteProduct;
