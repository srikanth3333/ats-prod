import { useCallback, useEffect, useState } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseFetchOptions {
  immediate?: boolean; // Auto-fetch on mount
  dependencies?: any[]; // Re-fetch when these change
}

export function useFetch<T>(
  url: string | null,
  options: RequestInit = {},
  fetchOptions: UseFetchOptions = {}
) {
  const { immediate = true, dependencies = [] } = fetchOptions;

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: immediate && !!url,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!url) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : "An error occurred",
      });
    }
  }, [url, options]);

  useEffect(() => {
    if (immediate && url) {
      fetchData();
    }
  }, [fetchData, immediate, ...dependencies]);

  const refetch = useCallback(() => {
    if (url) fetchData();
  }, [fetchData, url]);

  return {
    ...state,
    refetch,
  };
}
