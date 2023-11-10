import { useState, useRef } from "react"

export function useHoverMenu(delay = 150) {
    const [show, setShow] = useState(false)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    function open() {
      if (timer.current !== null) {
        clearTimeout(timer.current)
        timer.current = null
      }
      setShow(true)
    }

    function close() {
      setShow(false)
    }

    function delayClose() {
      timer.current = setTimeout(() => {
        setShow(false)
      }, delay)
    }

    return { show, setShow, timer, open, close, delayClose }
  }