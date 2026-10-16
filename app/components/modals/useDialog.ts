"use client"

import {RefObject, useEffect, useRef} from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Modal behaviour shared by the popups: focus moves into the dialog when it opens (to the element marked
// `data-autofocus`, else the first focusable one) and back where it was when it closes,
// Tab stays inside it and Escape closes it.
const useDialog = (isOpen: boolean, onClose: () => void, dialogRef: RefObject<HTMLElement | null>) => {
   const onCloseRef = useRef(onClose)
   useEffect(() => {
      onCloseRef.current = onClose
   })

   useEffect(() => {
      if (!isOpen) return
      const dialog = dialogRef.current
      if (!dialog) return

      const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
      const getFocusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE))

      // The popups fade in from `visibility: hidden`, so focus() can be a no-op on the very first frame: retry briefly
      let frame = 0
      let attempts = 0
      const focusFirst = () => {
         const target = dialog.querySelector<HTMLElement>("[data-autofocus]") ?? getFocusable()[0] ?? dialog
         target.focus()
         if (!dialog.contains(document.activeElement) && attempts++ < 10) {
            frame = requestAnimationFrame(focusFirst)
         }
      }
      focusFirst()

      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key === "Escape") {
            event.preventDefault()
            onCloseRef.current()
            return
         }
         if (event.key !== "Tab") return
         const focusable = getFocusable()
         if (focusable.length === 0) return
         const first = focusable[0]
         const last = focusable[focusable.length - 1]
         if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
            event.preventDefault()
            last.focus()
         } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
         }
      }
      document.addEventListener("keydown", handleKeyDown)

      return () => {
         cancelAnimationFrame(frame)
         document.removeEventListener("keydown", handleKeyDown)
         previouslyFocused?.focus()
      }
   }, [isOpen, dialogRef])
}

export default useDialog;
