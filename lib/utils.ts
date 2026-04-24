import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTrackingId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ST-';
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatStatus(status: string): string {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatCurrency(amount: string | number | null | undefined): string {
  if (!amount) return '$0.00';
  return `$${parseFloat(String(amount)).toFixed(2)}`;
}

export function isUnauthorizedError(error: Error): boolean {
  return error.message?.includes('401') || error.message?.includes('Unauthorized');
}
