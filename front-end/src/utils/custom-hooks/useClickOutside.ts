import { RefObject, useEffect } from 'react';
import useEventListener from './useEventListener';

interface UseClickOutsideProps {
  ref: RefObject<HTMLElement>;
  callback: (event: MouseEvent) => void;
}

const useClickOutside = ({ ref, callback }: UseClickOutsideProps): void => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    };

  //   eventType: string;
  // callback: (event: Event) => void;
  // element?: EventTarget | null;

    useEventListener({ eventType: 'click', callbackf: handleClickOutside, element: document });

    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref, callback]);
};

export default useClickOutside;