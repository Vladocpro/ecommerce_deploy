import React from 'react';
import getCurrentUser from "../../actions/getCurrentUser";
import ClientCart from "../../components/pages/ClientCart";
import {redirect} from "next/navigation";
import {hydrateCart} from "../../../lib/cart";

const Home =  async () => {
   const currentUser = await getCurrentUser()

   if(!currentUser) {
      redirect('/')
   }

   // Current prices and stock, not whatever was saved when the item was added
   const lines = await hydrateCart(currentUser.cart)

   return (
       <ClientCart lines={lines} />
   );
};

export default Home;
