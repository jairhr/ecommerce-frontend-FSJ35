"use server";

import { revalidatePath } from "next/cache";
import { getAuthToken } from "@/lib/auth";
import type {
  ApiResponse,
  PaymentResponse,
} from "@/lib/types";

const BASE_URL = process.env.BASE_URL;

export interface CreatePaymentResult {
  success: boolean;
  message: string;
  data?: PaymentResponse;
}

export async function createPaymentIntent(
  orderId: number
): Promise<CreatePaymentResult> {
  try {
    if (!BASE_URL) {
      throw new Error("BASE_URL no está configurada");
    }

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return {
        success: false,
        message: "El ID de la orden no es válido",
      };
    }

    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        message: "Debes iniciar sesión para realizar el pago",
      };
    }

    const response = await fetch(
      `${BASE_URL}/api/orders/${orderId}/payment`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const result =
      (await response.json()) as ApiResponse<PaymentResponse>;

    if (!response.ok) {
      return {
        success: false,
        message:
          result.message || "No se pudo preparar el pago",
      };
    }

    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);

    return {
      success: true,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    console.error(
      "Error al crear PaymentIntent:",
      error
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error al preparar el pago",
    };
  }
}