"use client"

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Product} from "@prisma/client";
import DropDownAdmin from "../../components/dropdown/DropDownAdmin";
import {postFetch} from "../../../lib/fetcher";
import {useDispatch} from "react-redux";
import {setToastPopup, ToastPositions, ToastType} from "../../redux/slices/modals";

const Home =  () => {

   const [name, setName] = useState<string>("")
   const [description, setDescription] = useState<string>("")
   const [price, setPrice] = useState<string>("")
   const [nameIsTaken, setNameIsTaken] = useState<boolean>(false)
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
   const [gender, setGender] = useState<string>("Gender")
   const [category, setCategory] = useState<string>("Category")
   const [uploading, setUploading] = useState<boolean>(false)
   const [imagesUploadedToClient, setImagesUploadedToClient] = useState<boolean>(false)
   const [operation, setOperation] = useState<"create" | "update">("create")
   const fileUpload = useRef<HTMLInputElement | null>(null)
   const dispatch = useDispatch()

   const folderURL = useMemo(() => {
      let beginning = "/ecommerceNike"
      beginning += "/"
      beginning += category
      beginning += "/"
      beginning += name
      beginning += "/"
      return beginning
   },[name,category])

   function handleOnChange(changeEvent: any) {
      const reader = new FileReader();

      reader.onload = function(onLoadEvent) {
         // console.log(onLoadEvent.target.result)
         // setImageSrc(onLoadEvent.target.result);
         // setUploadData(undefined);
      }

      reader.readAsDataURL(changeEvent.target.files[0]);
      setImagesUploadedToClient(true)
   }

   async function handleOnSubmit(event) {
      event.preventDefault();
      setUploading(true)
      const form = event.currentTarget
      const fileInput = Array.from(form.elements).find(({name}) => name === "file")
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
      let images :string[] = []
      for await (const file of fileInput.files) {
         const formData = new FormData()
         formData.append("file", file)
         formData.append("upload_preset", "tqadrjqu")
         formData.append("folder", `/ecommerceNike/${category}/${name}/`)
         await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData
         }).then(async (response) => {
            const jsonData = await response.json()
            images.push(jsonData.url)
         })

      }
      const data = {
         title: name,
         description: description,
         price: parseFloat(price),
         images: images,
         gender: gender,
         sale: 0,
         category: category
      }
      postFetch("/api/product",{data}).then((response) => {
         dispatch(setToastPopup({visible: true, message: response, position: ToastPositions.AUTH, type: ToastType.SUCCESS, duration: 5000}))
      }).catch((error) => {
         dispatch(setToastPopup({visible: true, message: error?.response?.data, position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
      }).finally(() => {
         setUploading(false)
         setName("")
         setDescription("")
         setPrice("")
         setGender("Gender")
         setCategory("Category")
         setImagesUploadedToClient(false)
         setUploading(false)
         if (fileUpload.current) {
            fileUpload.current.value = "";
         }
      })
   }

   useEffect(() => {

   }, []);

   return (
       <div className="mt-4 max-w-[1000px] mx-auto">
          {/*<div className="flex gap-5">*/}
          {/*<button onClick={() => setOperation("create")} className={`text-xl font-medium bg-gray-200 bg-opacity-30 py-1.5 w-full ${operation === "create" && "border-b-2 border-black"}`}>Add Product</button>*/}
          {/*<button onClick={() => setOperation("update")} className={`text-xl font-medium bg-gray-200 bg-opacity-30 py-1.5 w-full ${operation === "update" && "border-b-2 border-black"}`}>Update Product</button>*/}
          {/*</div>*/}
          <div className="flex flex-col gap-5">
             <input
                 type="text"
                 onChange={(e) => setName(e.target.value)}
                 value={name}
                 className={`mt-6 p-2 h-12 outline-black  rounded-lg border-[1.75px] border-gray-300 ${nameIsTaken && "focus:outline-none border-red-500"}`}
                 placeholder="Product Title"/>
             <input
                 type="text"
                 onChange={(e) => setDescription(e.target.value)}
                 value={description}
                 className={`p-2 h-12 outline-black  rounded-lg border-[1.75px] border-gray-300`}
                 placeholder="Product Description"/>
             <input
                 type="text"
                 onChange={(e) => setPrice(e.target.value)}
                 value={price}
                 className={`p-2 h-12 outline-black  rounded-lg border-[1.75px] border-gray-300`}
                 placeholder="Product Price"/>
             <div className="flex  gap-4">
                <DropDownAdmin selectedOption={gender} handleChange={(option) => setGender(option)} options={["Men", "Women"]}/>
                <DropDownAdmin selectedOption={category} handleChange={(option) => setCategory(option)} options={["Shoes", "T-Shirt", "Trousers", "Jacket"]}/>
             </div>

             <div>
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
                      <span className="font-medium absolute top-2/3 text-black">{imagesUploadedToClient ? "You have uploaded files" : "Please upload 4 images at once"}</span>
                      <input type="file" name="file" ref={fileUpload} multiple={true} className="p-20 w-full self-center opacity-0"/>

                   </div>
                   <button className="py-3 w-full mx-auto rounded-lg bg-black text-white font-bold mb-10 mt-8">{uploading ? "Uploading..." : "Add Product"}</button>

                </form>

                {/*<CldUploadWidget*/}
                {/*    onUpload={handleUploadImage}*/}
                {/*    uploadPreset="tqadrjqu"*/}
                {/*    options={{*/}
                {/*       maxFiles: 4,*/}
                {/*       folder: "/ecommerceNike/Shoes/Nikeeee/",*/}
                {/*    }}*/}
                {/*   >*/}
                {/*   {({open}) => {*/}
                {/*      return (*/}
                {/*          <div onClick={() => open?.()}*/}
                {/*               className="flex flex-col justify-center items-center gap-4 text-neutral-600 relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 ">*/}
                {/*             <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-photo-up" width="44" height="44"*/}
                {/*                  viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">*/}
                {/*                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>*/}
                {/*                <path d="M15 8h.01"/>*/}
                {/*                <path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5"/>*/}
                {/*                <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3.5 3.5"/>*/}
                {/*                <path d="M14 14l1 -1c.679 -.653 1.473 -.829 2.214 -.526"/>*/}
                {/*                <path d="M19 22v-6"/>*/}
                {/*                <path d="M22 19l-3 -3l-3 3"/>*/}
                {/*             </svg>*/}
                {/*          </div>*/}
                {/*      )*/}
                {/*   }}*/}
                {/*</CldUploadWidget>*/}

             </div>
          </div>
          {/*<ProductSearch chosenProduct={selectedProduct} setChosenProduct={setSelectedProduct}/>*/}


       </div>
   );
};

export default Home;
