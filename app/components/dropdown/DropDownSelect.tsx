"use client"

import React, {FC, useEffect, useState} from 'react';
import DropDown from "./DropDown";
import {useDispatch} from "react-redux";
import {setSortBy} from "../../redux/slices/filters";
import {store} from "../../redux/store";
import {useRouter} from "next/navigation";

interface DropDownSelectProps {
   title: string,
   titleStyles?: string,
   containerStyles? :string,
   itemStyles? :string,
   constTitle?: string,
   svgStyles?: string,
   itemClick?: (quantity : number) => void,
   changeTittle: boolean,
   isExpanded: boolean,
   sortBy?: any[]
   options: any[]
}


const DropDownSelect: FC<DropDownSelectProps> = ({title, titleStyles, changeTittle, itemClick, svgStyles, itemStyles, constTitle,containerStyles, isExpanded, sortBy,  options}) => {

   const [dropDownTitle, setDropDownTitle] = useState<string>(title)
   const [isOpen, setIsOpen] = useState<boolean>(isExpanded)
   const dispatch = useDispatch();


   return (
       <DropDown isOpen={isOpen} setIsOpen={setIsOpen} title={changeTittle ? dropDownTitle : title} svgStyles={svgStyles} titleStyles={titleStyles} containerStyles={containerStyles}>
          {options.map((item, index) => (
              <div key={index} onClick={() => {
                 setDropDownTitle(constTitle !== undefined ? constTitle + item : item)
                 setIsOpen(!isOpen)
                 if (itemClick) {
                    itemClick(Number(item))
                 }
                 if(sortBy !== undefined && sortBy.length > 0 && sortBy.length === options.length) {
                    dispatch(setSortBy(sortBy[index]))
                 }
              }}
                   className={` cursor-pointer hover:text-gray-400 ${itemStyles} rounded-md`}
              >
                 {item}
              </div>
          ))}

       </DropDown>
   );
};

export default DropDownSelect;
