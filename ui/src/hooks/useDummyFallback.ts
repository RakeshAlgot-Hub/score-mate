import { useState, useEffect } from 'react';

export function useDummyFallback<T>(
  promiseFn: () => Promise<T>,
  fallback: T,
  deps: any[] = []
): { data: T | null; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await promiseFn();
        setData(result);
      } catch (err) {
        console.warn('API call failed, using fallback data:', err);
        setError(err as Error);
        setData(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, deps);

  return { data, loading, error };
}

export async function withDummyFallback<T>(
  promiseFn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await promiseFn();
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return fallback;
  }
}