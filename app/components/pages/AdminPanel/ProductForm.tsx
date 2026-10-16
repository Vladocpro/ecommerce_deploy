"use client"

import React, {useRef, useState} from 'react';
import Image from "next/image";
import axios from "axios";
import {useRouter} from "next/navigation";
import DropDownAdmin from "../../dropdown/DropDownAdmin";
import useNotify from "../../useNotify";
import {getFetch} from "../../../../lib/fetcher";
import {uploadImages} from "../../../../lib/uploadImages";
import {toMinorUnits} from "../../../../lib/money";
import {CATEGORIES, CATEGORY_LABELS, DEFAULT_STOCK, GENDERS, regexNumbers, sizesForCategory} from "../../../constants";
import {Category, Gender, Product} from "../../../types";

const MAX_IMAGES = 4

interface ProductFormProps {
   // null creates a new product, otherwise this product is edited
   product: Product | null,
   onSaved: () => void,
}

// Stock per size; sizes the product doesn't have yet start at `fallback`
const stockFor = (category: Category, product: Product | null, fallback: number): Record<string, string> =>
    Object.fromEntries(sizesForCategory(category).map((size) => {
       const variant = product?.variants.find((item) => item.size === size)
       return [size, String(variant?.stock ?? fallback)]
    }))

// Shared by "Add Product" and "Update Product". The parent remounts it (via `key`) to start over.
const ProductForm = ({product, onSaved}: ProductFormProps) => {
   const isEditing = product !== null
   const [title, setTitle] = useState<string>(product?.title ?? "")
   const [description, setDescription] = useState<string>(product?.description ?? "")
   const [price, setPrice] = useState<string>(product ? (product.price / 100).toFixed(2) : "")
   const [discount, setDiscount] = useState<string>(product ? String(product.discountPercent) : "")
   const [gender, setGender] = useState<Gender | null>(product?.gender ?? null)
   const [category, setCategory] = useState<Category | null>(product?.category ?? null)
   const [stock, setStock] = useState<Record<string, string>>(product ? stockFor(product.category, product, 0) : {})
   const [archived, setArchived] = useState<boolean>(product?.archived ?? false)
   const [files, setFiles] = useState<File[]>([])
   const [saving, setSaving] = useState<boolean>(false)
   const fileInput = useRef<HTMLInputElement | null>(null)
   const notify = useNotify()
   const router = useRouter()

   const changeCategory = (label: string) => {
      const next = CATEGORIES.find((value) => CATEGORY_LABELS[value] === label) ?? null
      setCategory(next)
      // Keeps known stock when switching back to the product's own category
      if (next) setStock(stockFor(next, product, isEditing ? 0 : DEFAULT_STOCK))
   }

   const changeFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
      const chosen = Array.from(event.target.files ?? [])
      if (chosen.length > MAX_IMAGES) {
         notify.error(`Please choose up to ${MAX_IMAGES} images`)
         event.target.value = ""
         setFiles([])
         return
      }
      setFiles(chosen)
   }

   // Returns an error message, or null when the form can be sent
   const validate = (): string | null => {
      if (title.trim().length === 0) return "Please type in product title!"
      if (description.trim().length === 0) return "Please type in product description!"
      if (!(parseFloat(price) > 0)) return "Please type in product price!"
      if (discount.trim().length === 0 || Number(discount) >= 100) return "Please type in a discount from 0 to 99!"
      if (gender === null) return "Please choose a gender for a product!"
      if (category === null) return "Please choose a category for a product!"
      if (!isEditing && files.length === 0) return "Please choose the product images!"
      return null
   }

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const problem = validate()
      if (problem || gender === null || category === null) {
         notify.error(problem ?? "Please fill in every field")
         return
      }
      setSaving(true)
      try {
         // Checked before uploading so a duplicate doesn't leave unused images in Cloudinary
         const identityChanged = !product || product.title !== title.trim() || product.gender !== gender || product.category !== category
         if (identityChanged) {
            const available = await getFetch(`/api/verifyProductTitle/${encodeURIComponent(title.trim())}`, {gender, category})
            if (!available) {
               notify.error(`A ${gender.toLowerCase()} ${CATEGORY_LABELS[category]} with this title already exists`)
               return
            }
         }

         // New images are uploaded first; the server removes replaced ones only after saving
         const images = files.length > 0 ? await uploadImages(files, category, title.trim()) : product?.images ?? []
         const data = {
            id: product?.id,
            title: title.trim(),
            description,
            price: toMinorUnits(parseFloat(price)),
            discountPercent: Number(discount),
            gender,
            category,
            images,
            variants: sizesForCategory(category).map((size) => ({size, stock: Number(stock[size] || 0)})),
            ...(isEditing ? {archived} : {}),
         }
         const response = isEditing ? await axios.put("/api/product", {data}) : await axios.post("/api/product", {data})
         notify.success(response.data.message)
         router.refresh()
         onSaved()
      } catch (error) {
         notify.requestError(error, error instanceof Error ? error.message : undefined)
      } finally {
         setSaving(false)
      }
   }

   return (
       <form className="flex flex-col gap-5 mt-6" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1">
             <span className="font-medium">Title</span>
             <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    className="p-2 h-12 outline-black rounded-lg border-[1.75px] border-gray-300"/>
          </label>
          <label className="flex flex-col gap-1">
             <span className="font-medium">Description</span>
             <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                       className="p-2 min-h-[100px] outline-black rounded-lg border-[1.75px] border-gray-300 resize-y"/>
          </label>
          <div className="flex gap-4">
             <label className="flex flex-col gap-1 w-full">
                <span className="font-medium">Price (£)</span>
                <input type="text" inputMode="decimal" value={price}
                       onChange={(e) => /^\d*(\.\d{0,2})?$/.test(e.target.value) && setPrice(e.target.value)}
                       className="p-2 h-12 outline-black rounded-lg border-[1.75px] border-gray-300"/>
             </label>
             <label className="flex flex-col gap-1 w-full">
                <span className="font-medium">Discount (%)</span>
                <input type="text" inputMode="numeric" value={discount}
                       onChange={(e) => regexNumbers.test(e.target.value) && Number(e.target.value) < 100 && setDiscount(e.target.value)}
                       className="p-2 h-12 outline-black rounded-lg border-[1.75px] border-gray-300"/>
             </label>
          </div>
          <div className="flex gap-4">
             <DropDownAdmin selectedOption={gender ?? "Gender"} handleChange={(option) => setGender(option as Gender)} options={GENDERS}/>
             <DropDownAdmin selectedOption={category ? CATEGORY_LABELS[category] : "Category"} handleChange={changeCategory}
                            options={CATEGORIES.map((value) => CATEGORY_LABELS[value])}/>
          </div>

          <fieldset>
             <legend className="text-lg font-medium text-center w-full">
                {category === null ? "Please choose the category, before setting up sizes!" : "Stock for each size"}
             </legend>
             <ul className="grid grid-cols-3 gap-y-3 gap-x-5 sm:gap-x-7 mt-3 w-full">
                {category !== null && sizesForCategory(category).map((size) => (
                    <li key={size}>
                       <label className="flex items-center h-[42px] border-2 border-black rounded-lg overflow-hidden">
                          <span className="font-medium px-2.5 border-r-2 border-black h-full flex items-center whitespace-nowrap">{size}</span>
                          <input inputMode="numeric" value={stock[size] ?? ""} aria-label={`Stock for size ${size}`}
                                 onChange={(e) => regexNumbers.test(e.target.value) && setStock((prev) => ({...prev, [size]: e.target.value}))}
                                 className="w-full h-full px-2 outline-none"/>
                       </label>
                    </li>
                ))}
             </ul>
          </fieldset>

          {product && product.images.length > 0 && files.length === 0 && (
              <div className="flex gap-3" aria-label="Current images">
                 {product.images.map((image) => (
                     <Image key={image.publicId} src={image.url} alt={product.title} width={80} height={100} className="w-[80px] h-[100px] object-cover rounded"/>
                 ))}
              </div>
          )}

          <label className="flex flex-col justify-center items-center text-neutral-600 relative cursor-pointer hover:opacity-70 transition border-dashed border-2 border-neutral-300 p-10">
             <span className="font-medium text-black text-center">
                {files.length > 0 ? `${files.length} image${files.length > 1 ? "s" : ""} ready to upload`
                    : isEditing ? `Choose up to ${MAX_IMAGES} new images to replace the current ones (optional)`
                    : `Choose up to ${MAX_IMAGES} images`}
             </span>
             <input ref={fileInput} type="file" accept="image/*" multiple onChange={changeFiles} className="sr-only"/>
          </label>

          {isEditing && (
              <label className="flex items-center gap-2 font-medium">
                 <input type="checkbox" checked={archived} onChange={(e) => setArchived(e.target.checked)} className="w-4 h-4"/>
                 Hidden from the store (archived)
              </label>
          )}

          <button type="submit" disabled={saving} className="py-3 w-full mx-auto rounded-lg bg-black text-white font-bold mb-10 disabled:opacity-60">
             {saving ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
          </button>
       </form>
   );
};

export default ProductForm;
