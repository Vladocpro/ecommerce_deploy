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
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <Head>
         <title>Nike</title>
         <meta content="width=device-width, initial-scale=1" name="viewport" />
         <meta name="Nike" content="Nike" />
         <link rel="icon"  href="/favicon.ico" />
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

