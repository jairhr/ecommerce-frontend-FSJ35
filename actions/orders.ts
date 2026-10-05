"use server";

import { revalidatePath } from "next/cache";
import { getAuthToken } from "@/lib/auth";
import type { ApiResponse, Order } from "@/lib/types";

const BASE_URL = process.env.BASE_URL;

export interface CreateOrderItem {
  product_id: number;
  quantity: number;
}

export interface CreateOrderResult {
  success: boolean;
  message: string;
  data?: Order;
}

export async function createOrder(
  items: CreateOrderItem[],
): Promise<CreateOrderResult> {
  try {
    if (!BASE_URL) {
      throw new Error("BASE_URL no está configurada");
    }

    if (!items.length) {
      return {
        success: false,
        message: "El carrito está vacío",
      };
    }

    const invalidItem = items.find(
      (item) =>
        !Number.isInteger(item.product_id) ||
        item.product_id <= 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0,
    );

    if (invalidItem) {
      return {
        success: false,
        message: "Los productos del carrito no son válidos",
      };
    }

    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        message: "Debes iniciar sesión para realizar la compra",
      };
    }

    const response = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items,
      }),
      cache: "no-store",
    });

    const result =
      (await response.json()) as ApiResponse<Order>;

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "No se pudo crear la orden",
      };
    }

    revalidatePath("/orders");

    return {
      success: true,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    console.error("Error al crear la orden:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error al crear la orden",
    };
  }
}