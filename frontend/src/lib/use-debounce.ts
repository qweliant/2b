import { useEffect, useRef, useState, MutableRefObject } from "react";

const useDebounce = (value: string, delay: number = 500): string => {
  const [debouncedValue, setDebouncedValue] = useState<string>(value);
  const timerRef: MutableRefObject<NodeJS.Timeout | undefined> = useRef();

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
      console.log("Debounced value: ", value);
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;