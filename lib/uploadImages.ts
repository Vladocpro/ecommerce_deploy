import {postFetch} from "./fetcher";
import {ProductImage} from "../app/types";

// Uploads images to Cloudinary with a signature from our admin-only API.
// Resolves to the images in the same order as `files`, or throws if any upload fails.
export async function uploadImages(files: File[], category: string, title: string): Promise<ProductImage[]> {
   const {signature, timestamp, folder, apiKey, cloudName} = await postFetch("/api/cloudinary/sign", {
      folder: `ecommerceNike/${category}/${title}`
   })

   return Promise.all(files.map(async (file) => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("api_key", apiKey)
      formData.append("timestamp", String(timestamp))
      formData.append("signature", signature)
      formData.append("folder", folder)

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
         method: "POST",
         body: formData
      })
      const jsonData = await response.json()
      if (!response.ok || !jsonData.secure_url || !jsonData.public_id) {
         throw new Error(jsonData.error?.message ?? "Image upload failed")
      }
      // The public id is kept so the image can be deleted later without parsing its URL
      return {url: jsonData.secure_url as string, publicId: jsonData.public_id as string}
   }))
}
