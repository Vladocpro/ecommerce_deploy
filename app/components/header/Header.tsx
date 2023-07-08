import React from 'react';
import Link from "next/link";
import BurgerMenu from "./BurgerMenu";
import NavLinks from "./NavLinks";
import getCurrentUser from "../../actions/getCurrentUser";


const Header =  async () => {
   const currentUser = await getCurrentUser();

   return (
       <header className="h-[62px] bg-white  sticky z-20 top-0">
          <nav className="flex text-black h-[62px] bg-white sm:w-[94%] sm:mx-auto w-[100%]  items-center  justify-between">
             <Link href="/">
                <svg  viewBox="0 5 25 14" height={48}  fill="black" className="group hover:fill-customGray">
                   <path fill="black" className="group-hover:fill-[#767575] transition-all duration-200" d="M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 0-1.445-.295-1.819-.884-.485-.76-.273-1.982.559-3.272.494-.754 1.122-1.446 1.734-2.108-.144.234-1.415 2.349-.025 3.345.275.2.666.298 1.147.298.386 0 .829-.063 1.316-.19L21 8.719z"/>
                </svg>
             </Link>

             <div className="hidden  space-x-20 font-semibold text-lg sm:block">
                <Link className="headerLinks" href="/store">Store</Link>
                <Link className="headerLinks" href="/sales">Sales</Link>
             </div>

              {/*@ts-ignore*/}
             <NavLinks user={currentUser} />
             <BurgerMenu/>
          </nav>
       </header>
   );
};

export default Header;
