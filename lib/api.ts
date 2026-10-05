import type {
  ApiResponse,
  Order,
  PaymentResponse,
  Product,
} from "./types";

const BASE_URL = process.env.BASE_URL;

if (!BASE_URL) {
  throw new Error("BASE_URL is not configured");
}

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data = (await response.json()) as T;

  if (!response.ok) {
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      throw new Error(data.message);
    }

    throw new Error("Error communicating with the API");
  }

  return data;
}

export async function getProducts(): Promise<Product[]> {
  const response = await apiFetch<ApiResponse<Product[]>>(
    "/api/products"
  );

  return response.data;
}

export async function getProduct(
  id: string
): Promise<Product> {
  const response = await apiFetch<ApiResponse<Product>>(
    `/api/products/${id}`
  );

  return response.data;
}

export async function getOrders(
  token: string
): Promise<Order[]> {
  const response = await apiFetch<ApiResponse<Order[]>>(
    "/api/orders",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  return response.data;
}

export async function getOrder(
  id: string,
  token: string
): Promise<Order> {
  const response = await apiFetch<ApiResponse<Order>>(
    `/api/orders/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  return response.data;
}

export async function createPaymentIntent(
  orderId: number,
  token: string
): Promise<PaymentResponse> {
  const response = await apiFetch<ApiResponse<PaymentResponse>>(
    `/api/orders/${orderId}/payment`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}