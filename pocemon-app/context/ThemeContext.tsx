// import { createContext, useState, useEffect } from 'react';
// import type { ReactNode } from 'react';

// type Theme = 'light' | 'dark';

// type ThemeContextType = {
//   theme: Theme;
//   setTheme: (theme: Theme) => void;
// };

// export const ThemeContext = createContext<ThemeContextType>({
//   theme: 'dark',
//   setTheme: () => {},
// });

// export function ThemeProvider({ children }: { children: ReactNode }) {
//   const [theme, setTheme] = useState<Theme>(
//     (localStorage.getItem('app-theme') as Theme) || 'dark'
//   );

//   useEffect(() => {
//     localStorage.setItem('app-theme', theme);
//     document.documentElement.setAttribute('data-theme', theme);
//   }, [theme]);

//   return (
//     <ThemeContext.Provider value={{ theme, setTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }
