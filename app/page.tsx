
import Link from "next/link";

export default async function Home() {

  return (
      <div className="text-black">
        <div className="flex flex-col items-center mt-4 sm:mt-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl mb-0.5 sm:mb-3 font-bold italic uppercase">AIR MAX DN</h1>
          <p className="mx-4 text-sm md:text-xl mb-5 sm:mb-7">The next generation of Air technology is here.</p>
          <Link href="/store" className="text-sm md:text-lg bg-black font-medium text-white py-1.5 px-6 rounded-xl">Shop Now</Link>
        </div>
         <div className="mt-6 sm:mt-8 ">
            <img src="../HomePage/banner.jpeg" className="w-full object-contain hidden sm:block"/>
            <img src="../HomePage/banner-portrait.png" className="w-full object-contain mobile:w-[96%] mx-auto block sm:hidden"/>
         </div>

         <div className="mt-5 text-center">
            <h1 className="text-3xl font-bold uppercase">Trending</h1>
          <p className="text-xl mt-2">Explore the latest & greatest</p>
        </div>
        <div className="flex flex-grow flex-wrap justify-center sm:flex-nowrap mobile:w-[96%] w-full shrink mx-auto gap-5 mt-6 mb-1">
          <Link href="/store" className="">
             <img src="../HomePage/trending1.png" className="object-contain w-full  sm:max-h-full"/>
          </Link>
           <Link href="/store" className="">
              <img src="../HomePage/trending2.png" className="object-contain w-full  sm:max-h-full" alt=""/>
          </Link>
          <Link href="/store" className="">
            <img src="../HomePage/trending3.png" className="object-contain w-full  sm:max-h-full" alt=""/>
          </Link>
        </div>
      </div>
  )
}
