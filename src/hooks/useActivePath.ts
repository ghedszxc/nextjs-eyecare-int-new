import { usePathname } from 'next/navigation'

/** Tracks the current path, updating on both browser and client-side navigation. */
export const useActivePath = () => usePathname() ?? ''
