import { useEffect, useRef } from 'react';

import { createPortal } from 'react-dom';

/**
 * this fixes a problem I had with react beautiful dnd where
 * when I dragged an item it would just dissapear or go all the way to the top/bottom corners of the page
 */
const useDraggableInPortal = () => {
  const self = useRef({}).current;

  useEffect(() => {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.pointerEvents = 'none';
    div.style.top = '0';
    div.style.width = '100%';
    div.style.height = '100%';
    self.elt = div;
    document.body.appendChild(div);
    return () => {
      document.body.removeChild(div);
    };
  }, [self]);

  return (render) =>
    (provided, ...args) => {
      const element = render(provided, ...args);
      if (provided.draggableProps.style.position === 'fixed') {
        return createPortal(element, self.elt);
      }
      return element;
    };
};

export default useDraggableInPortal;
