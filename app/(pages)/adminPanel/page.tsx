import React from 'react';
import getCurrentUser from "../../actions/getCurrentUser";
import ClientAdminPanel from "../../components/pages/AdminPanel/ClientAdminPanel";
import {redirect} from "next/navigation";

const HOME = async () => {
   const currentUser = await getCurrentUser()

   if(!currentUser || currentUser.role !== "Admin") {
      redirect('/')
   }

   return (
       <ClientAdminPanel/>
   )
};

export default HOME;


