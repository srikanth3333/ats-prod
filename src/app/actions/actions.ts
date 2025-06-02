"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login({ email, password }: any) {
  const supabase = await createClient();
  const data = {
    email: email,
    password: password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { success: false, error: error?.message };
  }

  return { success: true, error: null };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function currentUser() {
  try {
    const supabase = await createClient();
    const { data: userDetails, error: authError } =
      await supabase.auth.getUser();

    if (authError || !userDetails?.user) {
      console.log("Auth error or no user:", authError);
      return {
        success: false,
        data: null,
        error: authError || new Error("No user found"),
      };
    }

    const userId = userDetails.user.id;
    const { data: userProfile, error: statusError } = await supabase
      .from("user_profile")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    const { data: company, error: companyError } = await supabase
      .from("company")
      .select("*")
      .eq("id", userProfile?.company_id)
      .maybeSingle();

    if (statusError || companyError) {
      console.log("Profile fetch error:", statusError);
      return {
        success: false,
        data: null,
        error: statusError,
      };
    }

    return {
      success: true,
      data: {
        userProfile,
        user: userDetails.user,
        company: company,
      },
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error in currentUser:", error);
    return {
      success: false,
      data: null,
      error: error as Error, // Use generic Error type for safety
    };
  }
}
