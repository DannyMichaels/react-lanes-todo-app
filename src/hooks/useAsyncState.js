import { useState, useCallback } from 'react';

// when a setState action needs to be awaited
export default function useAsyncState(defaultValue) {
  const [state, _setState] = useState(defaultValue);

  const setState = useCallback(async (newState) => {
    return new Promise((resolve) => _setState(newState) || resolve());
  }, []);

  return [state, setState];
}
