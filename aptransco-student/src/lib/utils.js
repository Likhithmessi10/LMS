import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num) {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatDate(date) {
  return format(new Date(date), 'MMM dd, yyyy');
}

export function formatTime(date) {
  return format(new Date(date), 'hh:mm a');
}