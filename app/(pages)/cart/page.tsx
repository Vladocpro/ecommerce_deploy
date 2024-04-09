

import React from 'react';
import getCurrentUser from "../../actions/getCurrentUser";
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
