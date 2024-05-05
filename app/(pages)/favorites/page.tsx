import React from 'react';
import getCurrentUser from "../../actions/getCurrentUser";
import ClientFavorites from "../../components/pages/ClientFavorites";
import {getUserFavorites} from "../../actions/getFavorites";
import {redirect} from "next/navigation";

const HOME = async () => {
   const response = await getUserFavorites()

   if(!response?.user) {
      redirect('/')
   }

return (
    // @ts-ignore
    <ClientFavorites favorites={response.favorites}/>
   )
};

export default HOME;


