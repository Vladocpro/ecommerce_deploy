
import Link from "next/link";
import Image from "next/image";

const trending = ["/HomePage/trending1.png", "/HomePage/trending2.png", "/HomePage/trending3.png"]

export default function Home() {

  return (
      <div className="text-black">
        <div className="flex flex-col items-center mt-4 sm:mt-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl mb-0.5 sm:mb-3 font-bold italic uppercase">AIR MAX DN</h1>
          <p className="mx-4 text-sm md:text-xl mb-5 sm:mb-7">The next generation of Air technology is here.</p>
          <Link href="/store" className="text-sm md:text-lg bg-black font-medium text-white py-1.5 px-6 rounded-xl">Shop Now</Link>
        </div>
         <div className="mt-6 sm:mt-8 ">
            {/* Hero (LCP): one image per breakpoint, both preloaded since next/image 13.4 can't art-direct with <picture> */}
            <Image src="/HomePage/banner.jpeg" alt="Nike Air Max Dn trainers" width={1920} height={840} sizes="100vw" priority
                   className="w-full object-contain hidden sm:block"/>
            <Image src="/HomePage/banner-portrait.png" alt="Nike Air Max Dn trainers" width={837} height={1300} sizes="96vw" priority
                   className="w-full object-contain mobile:w-[96%] mx-auto block sm:hidden"/>
         </div>

         <div className="mt-5 text-center">
            <h2 className="text-3xl font-bold uppercase">Trending</h2>
          <p className="text-xl mt-2">Explore the latest & greatest</p>
        </div>
        <div className="flex flex-grow flex-wrap justify-center sm:flex-nowrap mobile:w-[96%] w-full shrink mx-auto gap-5 mt-6 mb-1">
           {trending.map((src, index) => (
               <Link href="/store" key={src}>
                  <Image src={src} alt={`Shop trending style ${index + 1}`} width={1280} height={1600} sizes="(min-width: 640px) 33vw, 96vw"
                         className="object-contain w-full  sm:max-h-full"/>
               </Link>
           ))}
        </div>
      </div>
  )
}
