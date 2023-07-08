

import React from 'react';
import getCurrentUser from "../../actions/getCurrentUser";
import Image from "next/image";
import {Product, User} from "../../types";
import {getOrders} from "../../actions/getUserAndOrders";
import ClientCart from "../../components/pages/ClientCart";

const Home =  async () => {

   const currentUser = await getCurrentUser()

   if(!currentUser) {
      return (
          <div>
          </div>
      )
   }

   return (
       // @ts-ignore
       <ClientCart user={currentUser} />
   );
};

export default Home;
