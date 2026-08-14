import { useState } from "react";

const useThrottling = (
  duration: number,
  initial: boolean = false
): [isThrottling: boolean, ThrottlingHandler: () => void] => {
  // States
  const [isThrottling, setIsThrottling] = useState(initial);

  // Handlers
  const ThrottlingHandler = () => {
    setIsThrottling(true);

    setTimeout(() => {
      setIsThrottling(false);
    }, duration);
  };

  return [isThrottling, ThrottlingHandler];
};

export default useThrottling;
