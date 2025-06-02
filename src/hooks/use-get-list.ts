import { fetchTableDataWithForeignKey } from "@/app/dashboard/actions/common/get/action";
import { RootState } from "@/store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface UseTableDataOptions {
  tableName: string;
  columnToSort?: string;
  sortDirection?: "asc" | "desc";
  searchColumns?: string[];
  foreignKeys?: { [key: string]: any };
  applyUserIdFilter?: boolean;
  profileId?: string;
  initialPageSize?: number;
}

interface UseTableDataReturn {
  // State
  currentPage: number;
  pageSize: number;
  total: number;
  data: any[];
  filters: { [key: string]: any };
  open: boolean;
  loading: boolean;
  searchTerm: string;

  // Actions
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (
    filters:
      | { [key: string]: any }
      | ((prev: { [key: string]: any }) => { [key: string]: any })
  ) => void;
  setOpen: (open: boolean) => void;
  setSearchTerm: (term: string) => void;
  handlePageChange: (page: number, size: number) => void;
  fetchData: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useGetList = ({
  tableName,
  columnToSort = "created_at",
  sortDirection = "asc",
  searchColumns = [],
  foreignKeys = {},
  applyUserIdFilter = false,
  profileId,
  initialPageSize = 10,
}: UseTableDataOptions): UseTableDataReturn => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: any }>({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const user = useSelector((state: RootState) => state.user.user);
  // Use refs to store stable references for options
  const optionsRef = useRef({
    tableName,
    columnToSort,
    sortDirection,
    searchColumns,
    foreignKeys,
    applyUserIdFilter,
    profileId,
  });

  // Update options ref when values change
  useEffect(() => {
    optionsRef.current = {
      tableName,
      columnToSort,
      sortDirection,
      searchColumns,
      foreignKeys,
      applyUserIdFilter,
      profileId,
    };
  }, [
    tableName,
    columnToSort,
    sortDirection,
    searchColumns,
    foreignKeys,
    applyUserIdFilter,
    profileId,
  ]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const options = optionsRef.current;
      const response = await fetchTableDataWithForeignKey<any>({
        tableName: options.tableName,
        page: currentPage,
        pageSize: pageSize,
        columnToSort: options.columnToSort,
        sortDirection: options.sortDirection,
        filters: { ...filters, company_id: user?.company?.id },
        searchTerm: searchTerm ?? searchTerm,
        searchColumns: options.searchColumns,
        foreignKeys: options.foreignKeys,
        applyUserIdFilter: options.applyUserIdFilter,
        profileId: options.profileId,
      });

      setData(response.data);
      setTotal(response.totalCount);
    } catch (error) {
      console.error(`Error fetching ${optionsRef.current.tableName}:`, error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = useCallback((page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  }, []);

  const stableSetCurrentPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const stableSetPageSize = useCallback((size: number) => {
    setPageSize(size);
  }, []);

  const stableSetFilters = useCallback(
    (
      filters:
        | { [key: string]: any }
        | ((prev: { [key: string]: any }) => { [key: string]: any })
    ) => {
      setFilters(filters);
    },
    []
  );

  const stableSetOpen = useCallback((open: boolean) => {
    setOpen(open);
  }, []);

  const stableSetSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return useMemo(
    () => ({
      currentPage,
      pageSize,
      total,
      data,
      filters,
      open,
      loading,
      searchTerm,
      setCurrentPage: stableSetCurrentPage,
      setPageSize: stableSetPageSize,
      setFilters: stableSetFilters,
      setOpen: stableSetOpen,
      setSearchTerm: stableSetSearchTerm,
      handlePageChange,
      fetchData,
      refetch,
    }),
    [
      currentPage,
      pageSize,
      total,
      data,
      filters,
      open,
      loading,
      searchTerm,
      stableSetCurrentPage,
      stableSetPageSize,
      stableSetFilters,
      stableSetOpen,
      stableSetSearchTerm,
      handlePageChange,
      fetchData,
      refetch,
    ]
  );
};
