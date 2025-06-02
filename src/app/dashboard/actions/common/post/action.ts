"use server";
import { CrudResponse, TableData } from "@/types/supabaseTypes";
import { createClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";

export async function createRecord<T extends object>(
  tableName: string,
  data: TableData<T>
): Promise<CrudResponse<T>> {
  try {
    const supabase = await createClient();
    const { data: createdData, error } = await supabase
      .from(tableName)
      .insert(data)
      .select("*")
      .single();

    if (error) {
      return { success: false, error: error, data: null };
    }

    return {
      data: (createdData as T) || null,
      success: true,
      error,
    };
  } catch (error) {
    console.error(`Error creating record in ${tableName}:`, error);
    return {
      data: null,
      success: false,
      error: error as PostgrestError,
    };
  }
}

export async function createRecordBulk<T extends object>(
  tableName: string,
  data: TableData<T>
): Promise<CrudResponse<T>> {
  try {
    const supabase = await createClient();
    const { data: createdData, error } = await supabase
      .from(tableName)
      .insert(data)
      .select("*");

    if (error) {
      return { success: false, error: error, data: null };
    }

    return {
      data: (createdData as T) || null,
      success: true,
      error,
    };
  } catch (error) {
    console.error(`Error creating record in ${tableName}:`, error);
    return {
      data: null,
      success: false,
      error: error as PostgrestError,
    };
  }
}
