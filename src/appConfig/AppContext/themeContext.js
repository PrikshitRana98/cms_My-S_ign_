import {createContext, useContext} from 'react';
import Color from '../../Assets/Color/Color';
export const ThemeContext = createContext(Color.lightThemeColors);
export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within a AuthContextProvider');
  }

  return context;
};
