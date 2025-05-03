import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumberWithThousandSeparator(number: number) {
  const numberStr = number.toString();

  return numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
