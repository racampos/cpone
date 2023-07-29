import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string) => {
  return date
    .replace(/(?!^)-/g, '')
    .replace(/(\d{2})/, '$1/')
    .replace(/(\d{2}\/\d{2})/, '$1/')
    .slice(0, 10);
};
