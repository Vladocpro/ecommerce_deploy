import './globals.css'
import type { Metadata, Viewport } from 'next'
import React from "react";
import Header from "./components/header/Header";
import Footer from "./components/Footer";
import Providers from "./components/Provider";
import AuthPopup from "./components/modals/AuthPopup";
import Toast from "./components/ToastNotification";
import SelectSizePopup from "./components/modals/SelectSizePopup";


// App Router ignores next/head: titles and icons come from this export, the viewport from `viewport`
export const metadata: Metadata = {
   title: {
      default: 'Ecom',
      template: '%s | Ecom',
   },
   description: 'Ecommerce Nike',
   icons: {
      icon: [
         {url: '/images/favicon.ico'},
         {url: '/images/favicon-32x32.png', type: 'image/png', sizes: '32x32'},
         {url: '/images/favicon-16x16.png', type: 'image/png', sizes: '16x16'},
      ],
      shortcut: '/images/favicon.ico',
   },
}

export const viewport: Viewport = {
   width: 'device-width',
   initialScale: 1,
}

export default function RootLayout({
   children,
}: {
  children: React.ReactNode
}) {


  return (
      <html lang="en">
         <body>
            <Providers>
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
