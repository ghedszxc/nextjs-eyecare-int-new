import { useState } from "react";

const useToggle = () => {
  const [toggle, setToggle] = useState(false);

  const toggleHandler = () => {
    setToggle((prev) => !prev);
  };

  return { toggle, toggleHandler };
};

export default useToggle;