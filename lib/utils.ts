/**
 * Utility function to merge Tailwind CSS classes
 * Install clsx and tailwind-merge for full functionality:
 * npm install clsx tailwind-merge
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
