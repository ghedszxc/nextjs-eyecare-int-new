import { useState, useEffect } from "react";

interface RefObject {
  current: HTMLElement;
}

interface Props {
  once?: boolean;
  tresholdValue?: number;
}

function useOnScreen(
  ref: RefObject,
  { once = false, tresholdValue = 0.5 }: Props = {}
) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    if (ref.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
          if (once && entry.isIntersecting) {
            observer!.disconnect();
          }
        },
        { threshold: tresholdValue }
      );
      observer.observe(ref.current);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [ref, once, tresholdValue]);

  return isVisible;
}

export default useOnScreen;
