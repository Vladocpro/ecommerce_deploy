import './globals.css'
import type { Metadata } from 'next'
import React from "react";
import Header from "./components/header/Header";
import Footer from "./components/Footer";
import Providers from "./components/Provider";
import AuthPopup from "./components/modals/AuthPopup";
import Toast from "./components/ToastNotification";
import SelectSizePopup from "./components/modals/SelectSizePopup";
import Head from "next/head";


export const metadata: Metadata = {
  title: 'Nike',
  description: 'Ecommerce Nike',
   icons: "/icons8-nike-50.png"
}

export default function RootLayout({
   children,
}: {
  children: React.ReactNode
}) {


  return (
      <html lang="en">
         <Head>
            <title>Nike</title>
            <meta content="width=device-width, initial-scale=1" name="viewport" />
            <meta name="Nike" content="Nike" />
            <link rel="shortcut icon" href="/images/favicon.ico"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png"/>
         </Head>
         <body>
            <Providers>
               {/*@ts-ignore*/}
              <Header/>
              <main className="flex-grow w-100%">{children}</main>
              <AuthPopup/>
              <Toast />
              <Footer/>
              <SelectSizePopup />
            </Providers>
         </body>
      </html>
  )
}

