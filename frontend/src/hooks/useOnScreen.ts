import { RefObject, useEffect, useState } from 'react'

export const useOnScreen = (ref: RefObject<HTMLDivElement>, thresholdValue?: number, rootMargin = '0px') => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: thresholdValue, rootMargin },
    )

    const currentElement = ref?.current

    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      currentElement && observer.unobserve(currentElement)
    }
  })

  return isVisible
}
