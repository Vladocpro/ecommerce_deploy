"use client"

import {RefObject, useEffect, useRef} from 'react';

const useClickOutside = (ref: RefObject<HTMLElement | null>, onClickOutside: () => void) => {
   // Callers pass an inline arrow; reading it through a ref avoids re-subscribing on every render
   const callbackRef = useRef(onClickOutside)
   useEffect(() => {
      callbackRef.current = onClickOutside
   })

   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
            callbackRef.current();
         }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [ref]);
};

export default useClickOutside;
