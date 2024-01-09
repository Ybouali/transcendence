import { useEffect, useRef, MutableRefObject } from 'react';

interface UseEventListenerProps {
  eventType: string;
  callbackf: (event: MouseEvent) => void;
  element?: EventTarget | null;
}

const useEventListener = ({ eventType, callbackf, element = window }: UseEventListenerProps): void => {
  const callbackRef = useRef<Function>();

  // MAKE SURE THAT WE DON'T HAVE ANY ADDITIONAL RERENDERS THAT WE DON'T NEED
  useEffect(() => {
    callbackRef.current = callbackf;
  }, [callbackf]);

  useEffect(() => {
    if (element == null) return;

    const handler = (e: Event) => callbackRef.current?.(e);
    element.addEventListener(eventType, handler);

    return () => {
      element.removeEventListener(eventType, handler);
    };
  }, [eventType, element]);
};

export default useEventListener;
