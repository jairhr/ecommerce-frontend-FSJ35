"use server";

import { redirect } from "next/navigation";
import {
  getAuthToken,
  removeAuthToken,
  setAuthToken,
} from "@/lib/auth";
import type {
  ApiResponse,
  LoginResponse,
  User,
} from "@/lib/types";

const BASE_URL = process.env.BASE_URL;

if (!BASE_URL) {
  throw new Error("BASE_URL is not configured");
}

interface AuthState {
  success: boolean;
  message: string;
}

interface RegisterResponse {
  user: User;
  token: string;
  token_type: string;
}

async function getErrorMessage(
  response: Response
): Promise<string> {
  try {
    const data = (await response.json()) as {
      message?: string;
      errors?: Record<string, string[]>;
    };

    if (data.errors) {
      const firstError = Object.values(data.errors)[0]?.[0];

      if (firstError) {
        return firstError;
      }
    }

    return data.message ?? "Ocurrió un error inesperado.";
  } catch {
    return "No fue posible comunicarse con el servidor.";
  }
}

export async function login(
  _previousState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(
    formData.get("email") ?? ""
  ).trim();

  const password = String(
    formData.get("password") ?? ""
  );

  const redirectTo =
    String(
      formData.get("redirectTo") ?? "/"
    );

  if (!email || !password) {
    return {
      success: false,
      message: "Ingresa tu correo y contraseña.",
    };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/api/login`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return {
        success: false,
        message: await getErrorMessage(response),
      };
    }

    const data =
      (await response.json()) as ApiResponse<LoginResponse>;

    await setAuthToken(data.data.token);
  } catch {
    return {
      success: false,
      message:
        "No fue posible conectarse con la API.",
    };
  }

  redirect(
    redirectTo.startsWith("/")
      ? redirectTo
      : "/"
  );
}

export async function register(
  _previousState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const email = String(
    formData.get("email") ?? ""
  ).trim();

  const password = String(
    formData.get("password") ?? ""
  );

  const passwordConfirmation = String(
    formData.get("password_confirmation") ?? ""
  );

  if (
    !name ||
    !email ||
    !password ||
    !passwordConfirmation
  ) {
    return {
      success: false,
      message: "Completa todos los campos.",
    };
  }

  if (password !== passwordConfirmation) {
    return {
      success: false,
      message: "Las contraseñas no coinciden.",
    };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/api/register`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation:
            passwordConfirmation,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return {
        success: false,
        message: await getErrorMessage(response),
      };
    }

    const data =
      (await response.json()) as ApiResponse<RegisterResponse>;

    await setAuthToken(data.data.token);
  } catch {
    return {
      success: false,
      message:
        "No fue posible conectarse con la API.",
    };
  }

  redirect("/");
}

export async function logout(): Promise<void> {
  const token = await getAuthToken();

  if (token) {
    try {
      await fetch(`${BASE_URL}/api/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });
    } catch {
      // Aunque Laravel falle,
      // eliminamos la sesión local.
    }
  }

  await removeAuthToken();

  redirect("/");
}