// utils/api.ts

export async function fetchData<T = any>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  customHeaders?: HeadersInit
): Promise<T> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...customHeaders,
      },
    };

    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "API request failed");
    }

    const data = await response.json();
    return data as T;
  } catch (error: any) {
    console.error(`${method} ${url} failed:`, error.message);
    throw error;
  }
}
