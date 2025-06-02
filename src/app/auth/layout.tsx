import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (!error || data?.user) {
    redirect("/dashboard");
  }
  return <div>{children}</div>;
}
