"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { CartItem } from "./types";

export const cartStorageKey = "titanor-cart";
const emptyCartSnapshot = "[]";

function getSnapshot() {
  if (typeof window === "undefined") {
    return emptyCartSnapshot;
  }

  return window.localStorage.getItem(cartStorageKey) || emptyCartSnapshot;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", callback);
  window.addEventListener("titanor-cart-updated", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("titanor-cart-updated", callback);
  };
}

export function readCartItems(): CartItem[] {
  try {
    return JSON.parse(getSnapshot()) as CartItem[];
  } catch {
    return [];
  }
}

export function writeCartItems(items: CartItem[]) {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  window.dispatchEvent(new Event("titanor-cart-updated"));
}

export function clearCartItems() {
  window.localStorage.removeItem(cartStorageKey);
  window.dispatchEvent(new Event("titanor-cart-updated"));
}

export function useCartItems() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => emptyCartSnapshot);

  return useMemo(() => {
    try {
      return JSON.parse(snapshot) as CartItem[];
    } catch {
      return [];
    }
  }, [snapshot]);
}
