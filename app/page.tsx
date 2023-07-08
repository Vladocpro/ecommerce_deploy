
import Link from "next/link";
import Slider from "./components/Slider";

export default async function Home() {
  //    const makeApiCall = async () => {
  //       await fetch('/api/product', {method: 'POST'});
  //    }
  // makeApiCall()

  return (
      <div className="text-black">
        <div className="flex flex-col gap-6 items-center mt-6">
          <h1 className="text-lg md:text-5xl font-bold italic uppercase">own the floor</h1>
          <p className="mx-4 md:text-xl">In dance, your moves speak to who you really are. What will you bring?</p>
          <Link href="/store" className="text-sm md:text-lg bg-black font-medium text-white py-2 px-5 rounded-2xl">Shop Now</Link>
        </div>
        <div className="mt-8">
          <img src="../HomePage/HomeDance.webp" className="aspect-[11/4] hidden sm:block "/>
          <img src="../HomePage/HomeDanceMob.webp" className="aspect-[6/8] block sm:hidden "/>
        </div>
        <div className="my-4 h-[300px] ml-2">
          <Slider showDots={false} slides={["../HomePage/firstSliderImg1.webp","../HomePage/firstSliderImg2.webp","../HomePage/firstSliderImg3.webp","../HomePage/firstSliderImg4.webp","../HomePage/firstSliderImg5.webp"]}/>
        </div>
        <div className="mt-5 text-center">
          <h1 className="text-3xl font-bold uppercase">Trending</h1>
          <p className="text-xl mt-2">Explore the latest & greatest</p>
        </div>
        <div className="flex flex-grow flex-wrap justify-center sm:flex-nowrap w-[95%] shrink mx-auto gap-5 mt-6">
          <Link href="/store" className="">
            <img src="../HomePage/Trending1.webp"    className="aspect-[35/45] max-h-[300px] sm:max-h-max" alt=""/>
          </Link>
          <Link href="/store" className="">
            <img src="../HomePage/Trending2.webp"    className="aspect-[35/45] max-h-[300px] sm:max-h-max" alt=""/>
          </Link>
          <Link href="/store" className="">
            <img src="../HomePage/Trending3.webp" className="aspect-[35/45] max-h-[300px] sm:max-h-max" alt=""/>
          </Link>
        </div>
        <div className="my-4 h-[300px] ml-2">
          <Slider showDots={false} slides={["../HomePage/firstSliderImg1.webp","../HomePage/firstSliderImg2.webp","../HomePage/firstSliderImg3.webp","../HomePage/firstSliderImg4.webp","../HomePage/firstSliderImg5.webp"]}/>
        </div>

      </div>
  )
}
