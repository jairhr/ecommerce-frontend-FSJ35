"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, Product } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (
    productId: number,
    quantity: number
  ) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(
  undefined
);

const CART_STORAGE_KEY = "shopnext_cart";

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    price: Number(product.price),
    stock: Number(product.stock),
  };
}

function normalizeCart(items: CartItem[]): CartItem[] {
  return items.map((item) => ({
    ...item,
    product: normalizeProduct(item.product),
    quantity: Number(item.quantity),
  }));
}

export function CartProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(
        CART_STORAGE_KEY
      );

      if (storedCart) {
        const parsedCart = JSON.parse(
          storedCart
        ) as CartItem[];

        setItems(normalizeCart(parsedCart));
      }
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(items)
    );
  }, [items, hydrated]);

  function addItem(product: Product) {
    const normalizedProduct = normalizeProduct(product);

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          item.product.id === normalizedProduct.id
      );

      if (existingItem) {
        const nextQuantity = Math.min(
          existingItem.quantity + 1,
          normalizedProduct.stock
        );

        return currentItems.map((item) =>
          item.product.id === normalizedProduct.id
            ? {
                ...item,
                product: normalizedProduct,
                quantity: nextQuantity,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          product: normalizedProduct,
          quantity: 1,
        },
      ];
    });
  }

  function removeItem(productId: number) {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.product.id !== productId
      )
    );
  }

  function updateQuantity(
    productId: number,
    quantity: number
  ) {
    setItems((currentItems) =>
      currentItems
        .map((item) => {
          if (item.product.id !== productId) {
            return item;
          }

          const safeQuantity = Math.min(
            Math.max(quantity, 0),
            item.product.stock
          );

          return {
            ...item,
            quantity: safeQuantity,
          };
        })
        .filter((item) => item.quantity > 0)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total +
          item.product.price * item.quantity,
        0
      ),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, totalItems, totalPrice]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}