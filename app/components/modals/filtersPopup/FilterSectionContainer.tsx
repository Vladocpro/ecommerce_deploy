"use client"

import React, {FC} from 'react';

interface FilterSectionContainerProps {
   children: React.ReactNode;
   title: string;
}
const FilterSectionContainer: FC<FilterSectionContainerProps> = ({children, title}) => {

   return (
       <div className="text-lg ml-5 mr-3 ">
          <span className="mt-7 font-medium text-lg">{title}</span>
          {children}
          <hr className="h-[1px] bg-gray-300 mt-5"/>
       </div>
   );
};

export default FilterSectionContainer;
