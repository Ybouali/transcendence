import useEventListener from "./useEventListener";

const useClickOutside = <T extends HTMLElement>(ref: React.RefObject<T>, cb: (e: MouseEvent) => void) => {
    useEventListener(
      "click",
      (e) => {
        if (ref.current === null || ref.current.contains(e.target)) return;
        cb(e);
      }
    );
  };
  
  export default useClickOutside;