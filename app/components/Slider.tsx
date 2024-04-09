"use client"

import React, {FC} from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
interface SliderProps {
   slides: string[],
   showDots: boolean
}


const Slider: FC<SliderProps> = ({slides, showDots}) => {

   const responsive = {
      superLargeDesktop: {
         // the naming can be any, depends on you.
         breakpoint: { max: 4000, min: 3000 },
         items: 7
      },
      desktop: {
         breakpoint: { max: 3000, min: 1520 },
         items: 5
      },
      smallDesktop: {
         breakpoint: { max: 1519, min: 1025 },
         items: 3
      },
      tablet: {
         breakpoint: { max: 1024, min: 640 },
         partialVisibilityGutter: 40,
         items: 2
      },
      mobile: {
         breakpoint: { max: 639, min: 0 },
         partialVisibilityGutter: 35,
         items: 1
      }
   };

   const CustomLeftArrow = ({ onClick , ...rest} : any) => {
   const {
      onMove,
      carouselState: { currentSlide, deviceType }
   } = rest;
   return (
          <div className="flex items-center justify-center absolute left-10 top-[42%] bg-white py-2.5 pl-2.5 pr-2.5  rounded-full cursor-pointer" onClick={() => onClick()}>
             <svg fill="#000000"  height={25} className=""   viewBox="20 0 490 490">
                <polygon points="332.668,490 82.631,244.996 332.668,0 407.369,76.493 235.402,244.996 407.369,413.507"/>
             </svg>
          </div>
       )
   };
   const CustomRightArrow = ({ onClick , ...rest} : any) => {
      const {
         onMove,
         carouselState: { currentSlide, deviceType }
      } = rest;
      return (
          <div className="flex items-center justify-center absolute right-10 top-[42%] bg-white py-2.5 pl-2.5 pr-2.5  rounded-full cursor-pointer" onClick={() => onClick()}>
             <svg fill="#000000" width={25} height={25}  viewBox="20 0 490 490" transform="rotate(180)">
                <polygon points="332.668,490 82.631,244.996 332.668,0 407.369,76.493 235.402,244.996 407.369,413.507"/>
             </svg>
          </div>
      )
   };

   return (
          <Carousel
              responsive={responsive}
              swipeable={true}
              draggable={true}
              showDots={showDots}
              ssr={true}
              infinite={true}
              centerMode={true}
              partialVisbile={false}
              customRightArrow={<CustomRightArrow  />}
              customLeftArrow={<CustomLeftArrow  />}
              keyBoardControl={true}
              customTransition="all 2s"
              transitionDuration={500}
              containerClass="carousel-container"
              removeArrowOnDeviceType={["tablet", "mobile"]}
              itemClass="carouselItem">
             {slides.map((slide) => (
                 <img src={slide} key={slide} className="h-[300px] w-[300px] select-none pointer-events-none" alt=""/>
             ))}
          </Carousel>
   );
};

export default Slider;
