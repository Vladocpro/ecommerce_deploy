
import React from 'react';
import ClientOrders from "../../components/pages/ClientOrders";
import {getUserAndOrders} from "../../actions/getUserAndOrders";
import {redirect} from "next/navigation";
const HOME = async () => {

   const response = await getUserAndOrders();

   if(!response?.user) {
      redirect('/')
   }

   return (
       <ClientOrders userOrders={response.orders}/>
   )
};

export default HOME;
