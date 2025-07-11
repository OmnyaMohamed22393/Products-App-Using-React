import { useEffect, useRef } from 'react';
import { useBlocker } from 'react-router-dom';

export const useFormChangeDetection = (hasUnsavedChanges) => {
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);
  
  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChangesRef.current &&
      currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChangesRef.current) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return blocker;
};
