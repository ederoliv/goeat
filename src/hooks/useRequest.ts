import { useEffect, useState } from 'react';

interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: unknown;
}

export function useRequest<T>(fetcher: () => Promise<T>, deps: unknown[]): RequestState<T> {
  const [state, setState] = useState<RequestState<T>>({ data: null, loading: true, error: null });

  useEffect(() => {
    let active = true;
    setState(prev => ({ ...prev, loading: true, error: null }));
    fetcher().then(
      data => active && setState({ data, loading: false, error: null }),
      error => active && setState({ data: null, loading: false, error }),
    );
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
