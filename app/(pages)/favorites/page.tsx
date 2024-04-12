import React from 'react';
import getCurrentUser from "../../actions/getCurrentUser";
import ClientFavorites from "../../components/pages/ClientFavorites";

const HOME = async () => {
   const currentUser = await getCurrentUser()

   if(!currentUser) {
      return (
          <div>
          </div>
      )
   }

return (
    // @ts-ignore
    <ClientFavorites user={currentUser}/>
   )
};

export default HOME;


