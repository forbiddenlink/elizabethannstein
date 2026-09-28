/**
 * localStorage key for the visitor's explicit theme choice. Shared by the pre-paint script in
 * the root layout and `ThemeToggle`. It lives outside the 'use client' module because a server
 * component importing a constant from a client module receives a client reference, not the string.
 */
export const THEME_STORAGE_KEY = 'le-theme'
