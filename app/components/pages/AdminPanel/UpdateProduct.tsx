"use client"

import React, {useEffect, useRef, useState} from 'react';
import {Product} from "@prisma/client";
import {useDispatch} from "react-redux";
import {setToastPopup, ToastPositions, ToastType} from "../../../redux/slices/modals";
import {defaultClothSizes, defaultShoesSizes, regexNumbers} from "../../../constants";
import DropDownAdmin from "../../../components/dropdown/DropDownAdmin";
import ProductSearch from "../../../components/ProductSearch";
import axios from "axios";
import {getFetch} from "../../../../lib/fetcher";
import {useRouter} from "next/navigation";

const UpdateProduct = () => {

   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
   const [name, setName] = useState<string>("")
   const [description, setDescription] = useState<string>("")
   const [price, setPrice] = useState<string>("")
   const [sale, setSale] = useState<string>("")
   const [gender, setGender] = useState<string>("Gender")
   const [category, setCategory] = useState<string>("Category")
   const [uploading, setUploading] = useState<boolean>(false)
   const [imagesUploadedToClient, setImagesUploadedToClient] = useState<boolean>(false)
   const [sizes, setSizes] = useState<{title: string, quantity: number}[]>([])
   const [changedImages, setChangedImages] = useState<boolean>(false)
   const fileUpload = useRef<HTMLInputElement | null>(null)
   const dispatch = useDispatch()
   const router = useRouter();


   const productOnChange = (product: Product | null) => {
      setSelectedProduct(product)
      setChangedImages(false);
      if(product === null)  {
         clearStates()
      } else {
         setName(product?.title)
         setDescription(product?.description)
         setPrice(product?.price.toString())
         setSale(product?.sale.toString())
         setGender(product?.gender)
         setCategory(product?.category)
         setSizes(product?.sizes)
         setImagesUploadedToClient(true)
         if (fileUpload.current) {
            fileUpload.current.value = "";
         }
         setUploading(false)
      }
   }

   const clearStates = () => {
      setSelectedProduct(null)
      setChangedImages(false)
      setName("")
      setDescription("")
      setPrice("")
      setSale("")
      setGender("Gender")
      setCategory("Category")
      setSizes([])
      setImagesUploadedToClient(false)
      if (fileUpload.current) {
         fileUpload.current.value = "";
      }
      setUploading(false)
   }

   function handleOnChange(changeEvent: any) {
      const reader = new FileReader();
      if(changeEvent.target.files.length !== 4) {
         dispatch(setToastPopup({visible: true, message: "Please upload 4 images at once", type: ToastType.ERROR, duration: 5000, position: ToastPositions.AUTH}))
         changeEvent.target.value = ""
         setImagesUploadedToClient(false)
      } else {
         setChangedImages(true)
         reader.readAsDataURL(changeEvent.target.files[0]);
         setImagesUploadedToClient(true)
      }
   }

   async function handleOnSubmit(event) {
      try {
         event.preventDefault();
         if(selectedProduct === null) {
            dispatch(setToastPopup({visible: true, message: "Please choose product that you want to update!", type: ToastType.ERROR, duration: 5000, position: ToastPositions.AUTH}))
            return
         }
         setUploading(true)
         const form = event.currentTarget
         const fileInput = Array.from(form.elements).find(({name}) => name === "file")
         if(fileInput.files.length !== 4 && changedImages) {
            dispatch(setToastPopup({visible: true, message: "Please upload 4 images at once", type: ToastType.ERROR, duration: 5000, position: ToastPositions.AUTH}))
            setUploading(false)
            return
         }
         if(selectedProduct.title !== name) {
            let titleIsAvailable = await getFetch(`/api/verifyProductTitle/${name}`)
            if(!titleIsAvailable) {
               dispatch(setToastPopup({visible: true, message: "Product title already exists! Please choose a different one.", position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
               setUploading(false)
               return
            }
         }
         if(name.trim().length === 0) {
            dispatch(setToastPopup({visible: true, message: "Please type in product title!", position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
            setUploading(false)
            return
         }
         if(description.trim().length === 0) {
            dispatch(setToastPopup({visible: true, message: "Please type in product description!", position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
            setUploading(false)
            return
         }
         if(price.trim().length === 0) {
            dispatch(setToastPopup({visible: true, message: "Please type in product price!", position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
            setUploading(false)
            return
         }
         if(sale.trim().length === 0) {
            dispatch(setToastPopup({visible: true, message: "Please type in product discount!", position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
            setUploading(false)
            return
         }
         if(gender === "Gender") {
            dispatch(setToastPopup({visible: true, message: "Please choose a gender for a product!", position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
            setUploading(false)
            return
         }
         if(category === "Category") {
            dispatch(setToastPopup({visible: true, message: "Please choose a category for a product!", position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
            setUploading(false)
            return
         }

         const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
         let images :string[] = []
         if(changedImages) {
            await axios.delete("/api/product", {data: {
               name: name,
               category: category,
               images: selectedProduct.images,
               skipDBDelete: true
            }})
            const uploadPreset: string = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
            for await (const file of fileInput.files) {
               const formData = new FormData()
               formData.append("file", file)
               formData.append("upload_preset", uploadPreset)
               formData.append("folder", `/ecommerceNike/${category}/${name}/`)
               await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                  method: "POST",
                  body: formData
               }).then(async (response) => {
                  const jsonData = await response.json()
                  images.push(jsonData.url)
               }).catch((error) => {
                  console.log(error)
               })
            }
         } else {
            images = selectedProduct.images
         }
         const data = {
            id: selectedProduct.id,
            title: name,
            description: description,
            price: Math.floor(parseFloat(price) * 100) / 100,
            images: images,
            gender: gender,
            sizes: sizes,
            sale: parseFloat(sale),
            category: category
         }
         axios.put("/api/product",{data: data}).then((response) => {
            dispatch(setToastPopup({visible: true, message: response.data.message, position: ToastPositions.AUTH, type: ToastType.SUCCESS, duration: 5000}))
         }).catch((error) => {
            dispatch(setToastPopup({visible: true, message: error?.response?.data, position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
         }).finally(() => {
           clearStates()
            router.refresh();
         })
      } catch (error) {
         console.log(error)
         dispatch(setToastPopup({visible: true, message: error?.response?.data, position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
      }
   }

   console.log(changedImages)

   return (
       <div className="flex flex-col gap-5 mt-6">
          <ProductSearch selectedProduct={selectedProduct} setSelectedProduct={productOnChange}/>

          <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className={`p-2 h-12 outline-black  rounded-lg border-[1.75px] border-gray-300`}
              placeholder="Product Title"/>
          <textarea onChange={(e) => setDescription(e.target.value)} value={description}
                    className={`p-2 min-h-[100px] outline-black  rounded-lg border-[1.75px] border-gray-300 resize-y `} placeholder="Product Description"/>
          <input
              type="text"
              onChange={(e) => {
                 if (isNaN(e.target.value)) return
                 setPrice(e.target.value)
              }}
              value={price}
              className={`p-2 h-12 outline-black  rounded-lg border-[1.75px] border-gray-300`}
              placeholder="Product Price"/>
          <input
              type="text"
              onChange={(e) => {
                 if (!regexNumbers.test(e.target.value)) return
                 if(Number(e.target.value) >= 0 && Number(e.target.value) <= 100) {
                    setSale(e.target.value)
                 }
              }}
              value={sale}
              className={`p-2 h-12 outline-black  rounded-lg border-[1.75px] border-gray-300`}
              placeholder="Product Discount Percentage (should be a number from 0 to 100)"/>
          <div className="flex  gap-4">
             <DropDownAdmin selectedOption={gender} handleChange={(option) => setGender(option)} options={["Men", "Women"]}/>
             <DropDownAdmin selectedOption={category} handleChange={(option) => {
                setCategory(option)
                if (option === "Shoes") {
                   setSizes(JSON.parse(JSON.stringify(defaultShoesSizes)))
                } else {
                   setSizes(JSON.parse(JSON.stringify(defaultClothSizes)))
                }
             }} options={["Shoes", "T-Shirt", "Trousers", "Jacket"]}/>
          </div>

          <div>
             <div>
                {sizes.length === 0
                    ? <div className="text-lg font-medium text-center">Please choose the category, before setting up sizes!</div>
                    : <div className="text-lg font-medium text-center">Please define quantity for each size!</div>}
                <ul className="grid grid-cols-3 gap-y-3 gap-x-5  sm:gap-y-3.5 sm:gap-x-7 md:gap-y-3.5 md:gap-x-6 lg:gap-x-[14px] xl:gap-x-6 lg:gap-y-2 xl:gap-y-2.5 mt-3 mb-6 w-full">
                   {/*@ts-ignore*/}
                   {sizes?.map((size: { title: string, quantity: number }, index: number) => (
                       <li key={size.title} className="relative">
                          <div
                              className={`font-medium text-center absolute  after:h-[42px] after:w-[2px] after:bg-black after:absolute ${category === "Shoes" ? "left-2.5 top-2 after:-top-2 after:left-[60px]" : "left-2.5 top-2 after:-top-2 after:left-[36px]"}`}>{size.title}</div>
                          <input value={size.quantity}
                                 onChange={(e) => {
                                    if (!regexNumbers.test(e.target.value)) return
                                    setSizes(
                                        sizes.map(item => {
                                           if (item.title === size.title) {
                                              item.quantity = Number(e.target.value)
                                           }
                                           return item
                                        })
                                    )
                                 }}
                                 className={`flex items-center justify-center h-[42px] w-full border-2 border-black rounded-lg  transition-all duration-100 ${category === "Shoes" ? "pl-[76px]" : "pl-[52px]"}`}/>
                       </li>
                   ))}
                </ul>
             </div>

             <form method="post" onSubmit={handleOnSubmit} onChange={handleOnChange}>

                <div
                    className="flex flex-col justify-center items-center gap-4 text-neutral-600 relative cursor-pointer hover:opacity-70 transition border-dashed border-2 border-neutral-300 ">
                   <svg xmlns="http://www.w3.org/2000/svg" className="absolute" width="44" height="44"
                        viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M15 8h.01"/>
                      <path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5"/>
                      <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3.5 3.5"/>
                      <path d="M14 14l1 -1c.679 -.653 1.473 -.829 2.214 -.526"/>
                      <path d="M19 22v-6"/>
                      <path d="M22 19l-3 -3l-3 3"/>
                   </svg>
                   <span
                       className="font-medium absolute top-2/3 text-black">{imagesUploadedToClient ? "Images are ready to be uploaded to the cloud" : "Please upload 4 images at once"}</span>
                   <input type="file" name="file" ref={fileUpload} multiple={true} className="p-20 w-full self-center opacity-0"/>

                </div>
                <button
                    className="py-3 w-full mx-auto rounded-lg bg-black text-white font-bold mb-10 mt-4">{uploading ? "Updating..." : "Update Product"}</button>

             </form>

          </div>
       </div>
   );
};

export default UpdateProduct;
