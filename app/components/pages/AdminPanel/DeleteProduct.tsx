"use client"

import React, {useState} from 'react';
import ProductSearch from "../../../components/ProductSearch";
import {Product} from "@prisma/client";
import axios from "axios";
import {setToastPopup, ToastPositions, ToastType} from "../../../redux/slices/modals";
import {useDispatch} from "react-redux";
import {useRouter} from "next/navigation";

const DeleteProduct = () => {

   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
   const [isDeleting, setIsDeleting] = useState<boolean>(false)
   const dispatch = useDispatch()
   const router = useRouter();

   const handleDeleteProduct = async () => {
      if(selectedProduct === null) return
      setIsDeleting(true)
      axios.delete("/api/product",{data: {id: selectedProduct.id, images: selectedProduct.images, category: selectedProduct.category, name: selectedProduct.title}}).then((response) => {
         dispatch(setToastPopup({visible: true, message: response.data.message, position: ToastPositions.AUTH, type: ToastType.SUCCESS, duration: 5000}))
      }).catch((error) => {
         dispatch(setToastPopup({visible: true, message: error?.response?.data, position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
      }).finally(() => {
         setIsDeleting(false)
         router.refresh();
      })
   }

   return (
       <div className="flex flex-col mt-6">
          <ProductSearch selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct}/>
          <button
              className="py-3 w-full mx-auto rounded-lg bg-black text-white font-bold mb-10 mt-10" onClick={handleDeleteProduct}>{isDeleting ? "Removing..." : "Remove Product"}</button>

       </div>
   );
};

export default DeleteProduct;
