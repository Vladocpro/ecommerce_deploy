"use client"

import { ScaleLoader } from "react-spinners";

const Loading = () => {
   return (
       <div className="h-[80vh] flex flex-col justify-center items-center">
          <ScaleLoader height={40}  color="black"/>
       </div>
   );
};

export default Loading;
