"use server";
import { createClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";

export async function updateRecord<T extends object>(
  tableName: string,
  id: string,
  data: Partial<T>
): Promise<{ success: boolean; error: PostgrestError | null; data: T | null }> {
  try {
    console.log("from DB values", data);
    const supabase = await createClient();
    const { data: updatedData, error } = await supabase
      .from(tableName)
      .update({ ...data })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return { success: false, error, data: null };
    }

    return {
      data: updatedData as T,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error(`Error updating record in ${tableName}:`, error);
    return {
      data: null,
      success: false,
      error: error as PostgrestError,
    };
  }
}

export async function updateJobPostingByIds(
  ids: number[],
  jobPostingId: number
) {
  if (!ids || ids.length === 0) {
    return { error: new Error("No IDs provided"), data: null };
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("candidates")
    .update({ job_id: jobPostingId })
    .in("id", ids);

  console.log(error, data);
  return { data, error };
}
