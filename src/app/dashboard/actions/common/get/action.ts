"use server";
import { FetchTableDataParams, PaginatedResponse } from "@/types/supabaseTypes";
import { createClient } from "@/utils/supabase/server";

export async function fetchTableDataWithForeignKey<T>({
  tableName,
  page = 1,
  pageSize = 10,
  columnToSort = "id",
  sortDirection = "asc",
  filters = {},
  searchTerm = "",
  searchColumns = [],
  foreignKeys = {},
  applyUserIdFilter = true,
  profileId,
}: FetchTableDataParams): Promise<PaginatedResponse<T>> {
  try {
    const supabase = await createClient();
    const offset = (page - 1) * pageSize;
    let userId: string | undefined;
    if (applyUserIdFilter) {
      userId = profileId;
    }
    let selectFields;
    selectFields = [
      "*",
      ...Object.entries(foreignKeys).map(
        ([fk, fields]) => `${fk}:${fk}(${fields.join(",")})`
      ),
    ].join(",");

    let query = supabase
      .from(tableName)
      .select(selectFields, { count: "exact" });

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value === "object" && value.operator && value.value) {
          const { operator, value: filterValue } = value;
          if (filterValue === "") return;

          if (["eq", "gt", "gte", "lt", "lte", "ne"].includes(operator)) {
            query = query.filter(key, operator, filterValue);
          } else if (operator === "ilike") {
            query = query.ilike(key, `%${filterValue}%`);
          } else if (["contains"].includes(operator)) {
            query = query.contains(key, filterValue);
          }
        } else {
          query = query.eq(key, value);
        }
      }
    });

    // Apply search
    if (searchTerm && searchColumns.length > 0) {
      const searchConditions = searchColumns
        .filter((col) => typeof col === "string") // Ensure valid columns
        .map((column) => `${column}.ilike.%${searchTerm}%`);
      if (searchConditions.length > 0) {
        query = query.or(searchConditions.join(","));
      }
    }

    // Apply sorting and pagination
    query = query
      .order(columnToSort, { ascending: sortDirection === "asc" })
      .range(offset, offset + pageSize - 1);

    // Execute query
    const { data, error, count } = await query;
    if (error) {
      throw new Error(
        `Error fetching data from ${tableName}: ${error.message}`
      );
    }

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data: data as T[],
      totalCount: totalItems,
      page,
      pageSize,
      totalPages,
    };
  } catch (error) {
    console.error("Error in fetchTableData:", error);
    throw error;
  }
}

export async function getListDataById<T>(
  dbName: string,
  selectItems: string,
  id: string | number | undefined
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(dbName)
      .select(selectItems)
      .eq("id", id)
      .order("created_at", { ascending: true })
      .maybeSingle();

    if (error) {
      console.error("Error fetching :", error.message);
      return { error: error.message, success: false };
    }

    return {
      success: true,
      data: data,
    };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      success: false,
      data: null,
      error:
        err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}
