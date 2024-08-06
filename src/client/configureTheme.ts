/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2024 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

const configureTheme = () => {
  const getStoredTheme = () => localStorage.getItem('theme') as 'dark' | 'light' | null;
  // const setStoredTheme = (theme: string) => localStorage.setItem('theme', theme);

  const getPreferredTheme = (): 'dark' | 'light' => {
    const storedTheme = getStoredTheme();
    if (storedTheme) return storedTheme;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = (theme: 'dark' | 'light') => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  };

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const storedTheme = getStoredTheme();
    if (!storedTheme) setTheme(getPreferredTheme());
  });

  setTheme(getPreferredTheme());
};

export default configureTheme;
