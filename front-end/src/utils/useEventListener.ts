import { MouseEvent, useEffect, useRef } from "react";

const useEventListener = (eventType: string, callback: (e: any) => void, element = window) => {
  const callbackRef = useRef(callback);

  // MAKE SURE THAT WE DON'T HAVE ANY ADDITIONAL RERENDERS THAT WE DON'T NEED
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (element == null) return;

    const handler = (e: Event) => callbackRef.current;
    element.addEventListener(eventType, handler);

    return () => element.removeEventListener(eventType, handler);
  }, [eventType, element]);
};

export default useEventListener;
