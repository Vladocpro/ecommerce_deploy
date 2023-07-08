import './globals.css'
import type { Metadata } from 'next'
import React from "react";
import Header from "./components/header/Header";
import Footer from "./components/Footer";
import Providers from "./components/Provider";
import AuthPopup from "./components/modals/AuthPopup";
import Toast from "./components/ToastNotification";
import SelectSizePopup from "./components/modals/SelectSizePopup";
import {Inter} from "next/dist/compiled/@next/font/dist/google";
import head from "./head";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
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
      <head />
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
