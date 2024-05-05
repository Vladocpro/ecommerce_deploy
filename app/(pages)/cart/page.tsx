

import React from 'react';
import getCurrentUser from "../../actions/getCurrentUser";
import ClientCart from "../../components/pages/ClientCart";
import {redirect} from "next/navigation";

const Home =  async () => {
   const currentUser = await getCurrentUser()

   if(!currentUser) {
      redirect('/')
   }

   return (
       // @ts-ignore
       <ClientCart user={currentUser} />
   );
};

export default Home;
