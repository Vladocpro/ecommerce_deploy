# Ecommerce Store

Ecommerce Store, a web application built with Next.js, React, Typescript, NextAuth, MongoDB (with Prisma), Stripe, and TailwindCSS. This project is a fully functional online store for clothing, offering a seamless shopping experience with a range of features.

## Table of Contents
- [Introduction](#Introduction)
- [Features](#Features)
- [Technologies Used](#Technologies-Used)
- [Getting Started](#Getting-Started)
- [Authentication](#Authentication)
- [Shopping Experience](#Shopping-Experience)
- [Order and Payment](#Order-and-Payment)
- [Responsive Design](#Responsive-Design)

## Introduction
The Ecommerce Store is a Next.js application designed to showcase and sell a variety of sports clothing. The project highlights the store's key features, product listings, and an aesthetically pleasing design to enhance the user experience.

## Features
- **Homepage:** Learn more about the store and its new products and special offers.
- **Product Listings:** Explore a comprehensive list of available clothing for purchase.
- **Authentication:** Create an account, sign in, or use Google/GitHub accounts for quick access.
- **Sorting and Filtering:** Easily find products with various sorting and filtering options.
- **Wishlist and Cart:** Save desired items for later or add them to the shopping cart.
- **Order and Payment:** Securely pay for your order using Stripe and view your order history.
- **Admin Panel:** Create, Update or Delete products with Admin Panel which is only available for users with admin rights.

## Technologies Used
- **Next.js:** Framework for building React applications with server-side rendering and routing.
- **React:** JavaScript library for building user interfaces.
- **Typescript:** Superset of JavaScript that adds static types.
- **NextAuth:** Authentication library for Next.js applications.
- **MongoDB with Prisma:**  Database and database access layer for efficient data management.
  Stripe: Payment processing platform for secure online transactions.
- **Tailwind:** Utility-first CSS framework for building stylish and responsive designs.

## Getting Started
To run the project locally, follow these steps:

1. **Clone the repository:** Clone this repository to your computer.
   ```bash
   git clone https://github.com/Vladocpro/ecommerce_deploy.git

2. **Navigate to the project directory:**
   ```bash
   cd ecommerce_deploy

3. **Install dependencies::**
   ```bash
   npm install

4. **Set up environment variables:** You need to create .env file in the project root directory. Below are the necessary environment variables:
    ```bash
    DATABASE_URL="The connection URL for your MongoDB database. It specifies the location and authentication details for the database server."
    NEXTAUTH_SECRET="A secret key used by NextAuth for signing and encrypting tokens. It enhances the security of user authentication."
    JWT_SECRET_KEY="A secret key used for authentication and encrypting tokens."
    GOOGLE_CLIENT_ID="The client ID for authenticating with Google."
    GOOGLE_CLIENT_SECRET="The client secret associated with the Google client ID."
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="The Cloudinary cloud name, used for media asset management and delivery."
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="The Cloudinary cloud name, used for uploading media assets."
    NEXT_PUBLIC_CLOUDINARY_API_KEY="The secret API key for interacting with the Cloudinary."
    NEXT_PUBLIC_CLOUDINARY_API_SECRET="The secret key for interactions with Cloudinary."
    STRIPE_API_KEY="The secret API key for interacting with the Stripe payment platform."
    STRIPE_WEBHOOK_SECRET="The secret key for verifying Stripe webhook events."
    NEXT_AUTH_URL="The base URL of your Next.js application. It is used by NextAuth to construct callback URLs and other authentication-related URLs. Adjust it based on your environment (e.g., http://localhost:3000 for local development)."
    ```
   Make sure to add the `.env` file to the `.gitignore` list to avoid exposing your secret keys.

5. **Run the development server:**
   ```bash
   npm run dev

After completing these steps, your application will be accessible at http://localhost:3000/.

## Authentication
The application supports user authentication through traditional email/password credentials or by using a Google account.

## Shopping Experience
Explore the store's diverse product listings with advanced sorting and filtering options. Add items to your wishlist or shopping cart for a personalized shopping experience.

## Order and Payment
Complete your purchase securely using the integrated Stripe payment system. Once paid, your order history will be accessible under the "Orders" tab.

## Responsive Design
The site is fully responsive, ensuring a seamless experience across various devices and screen sizes, thanks to the use of Tailwind CSS.


**You can check out the deployed version of this project [here](https://ecom-store-deploy.vercel.app).**
