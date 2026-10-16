"use client"

import React, {useState} from 'react';
import ProductSearch from "../../ProductSearch";
import ProductForm from "./ProductForm";
import {Product} from "../../../types";

const UpdateProduct = () => {
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

   return (
       <div className="flex flex-col mt-6">
          <ProductSearch selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct}/>
          {/* key: choosing another product starts the form from that product's values */}
          {selectedProduct
              ? <ProductForm key={selectedProduct.id} product={selectedProduct} onSaved={() => setSelectedProduct(null)}/>
              : <p className="text-lg font-medium text-center mt-8">Search for the product you want to update.</p>}
       </div>
   );
};

export default UpdateProduct;
