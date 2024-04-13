
import React from 'react';
import ClientOrders from "../../components/pages/ClientOrders";
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
       // @ts-ignore
       <ClientOrders currentUser={data?.user} userOrders={data?.orders}/>
   )
};

export default HOME;
