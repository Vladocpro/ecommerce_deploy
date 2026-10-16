"use client"

import React, {useState} from 'react';
import ProductForm from "./ProductForm";

const AddProduct = () => {
   // A new key remounts the form, which clears it after a product was added
   const [formKey, setFormKey] = useState<number>(0)

   return (
       <ProductForm key={formKey} product={null} onSaved={() => setFormKey((key) => key + 1)}/>
   );
};

export default AddProduct;
