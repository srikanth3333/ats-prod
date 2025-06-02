"use client";
import { login } from "@/app/actions/actions";
import SubmitForm from "@/components/common/submit-form";
import { formInputsLogin } from "@/utils/table-json/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const handleSubmit = async (values: Record<string, any>) => {
    const result = await login({
      email: values?.email,
      password: values?.password,
    });
    if (result?.success) {
      router.push("/dashboard");
    }
    return {
      ...result,
      error: result.error === null ? undefined : result.error,
    };
  };

  return (
    <div className="h-[100vh] flex items-center justify-center bg-gray-50">
      <div className="bg-white p-5 shadow-md rounded-lg max-w-xl">
        <h1>Login </h1>
        <SubmitForm fields={formInputsLogin} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
