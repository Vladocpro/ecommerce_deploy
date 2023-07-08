
import React from 'react';
import ClientOrders from "../../components/pages/ClientOrders";
import getCurrentUser from "../../actions/getCurrentUser";
import {getUserAndOrders} from "../../actions/getUserAndOrders";
const HOME = async () => {

   const {user, orders} = await getUserAndOrders();

   return (
       <ClientOrders currentUser={user} userOrders={orders}/>
   )
};

export default HOME;
