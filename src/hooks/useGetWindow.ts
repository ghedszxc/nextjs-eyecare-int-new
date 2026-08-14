import { useEffect, useState } from "react";

const useGetWindow = (): (Window & typeof globalThis) | undefined => {
  const [win, setWin] = useState<(Window & typeof globalThis) | undefined>();

  useEffect(() => {
    if (globalThis?.window) {
      setWin(globalThis.window);
    }
  }, []);

  return win;
};

export default useGetWindow;
