"use client"

import React, {useState} from 'react';
import AddProduct from "./AddProduct";
import UpdateProduct from "./UpdateProduct";
import DeleteProduct from "./DeleteProduct";

const Home =  () => {

   const [operation, setOperation] = useState<"create" | "update" | "delete">("create")

   return (
       <div className="mt-4 max-w-[1000px] mx-auto">
          <div className="flex gap-3">
             <button onClick={() => setOperation("create")}
                     className={`text-xl font-medium bg-gray-200 bg-opacity-30 py-1.5 w-full ${operation === "create" && "border-b-2 border-black"}`}>Add
                Product
             </button>
             <button onClick={() => setOperation("update")}
                     className={`text-xl font-medium bg-gray-200 bg-opacity-30 py-1.5 w-full ${operation === "update" && "border-b-2 border-black"}`}>Update
                Product
             </button>
             <button onClick={() => setOperation("delete")}
                     className={`text-xl font-medium bg-gray-200 bg-opacity-30 py-1.5 w-full ${operation === "delete" && "border-b-2 border-black"}`}>
                Remove Product
             </button>
          </div>
          {/* Rendered inline: a component defined inside this one would be recreated (and lose its form state) on every render */}
          {operation === "create" && <AddProduct/>}
          {operation === "update" && <UpdateProduct/>}
          {operation === "delete" && <DeleteProduct/>}



       </div>
   );
};

export default Home;
