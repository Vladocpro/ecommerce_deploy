import {useEffect} from 'react';

const useClickOutside = (ref :any, onClickOutside: () => void) => {
   useEffect(() => {
      function handleClickOutside(event: any) {
         if (ref.current && !ref.current.contains(event.target)) {
            onClickOutside();
         }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         // dispose
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [ref, onClickOutside]);
};

export default useClickOutside;
