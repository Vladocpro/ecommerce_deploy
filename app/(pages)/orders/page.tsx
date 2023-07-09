
import React from 'react';
import ClientOrders from "../../components/pages/ClientOrders";
import getCurrentUser from "../../actions/getCurrentUser";
import {getUserAndOrders} from "../../actions/getUserAndOrders";
const HOME = async () => {

   const data = await getUserAndOrders();

   if(!data) {
      return (
          <div>

          </div>
      )
   }

   return (
       <ClientOrders currentUser={data?.user} userOrders={data?.orders}/>
   )
};

export default HOME;
