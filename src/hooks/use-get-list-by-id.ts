import { getListDataById } from "@/app/dashboard/actions/common/get/action";
import { useEffect, useState } from "react";

interface UseListDataByIdResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGetListById<T>(
  dbName: string,
  selectItems: string,
  id: string | number | undefined | null
): UseListDataByIdResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getListDataById<T>(dbName, selectItems, id);

      if (result.success) {
        // Ensure result.data is of type T before setting
        setData((result.data as T) ?? null);
      } else {
        setError(result.error || "Failed to fetch data");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dbName, selectItems, id]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
