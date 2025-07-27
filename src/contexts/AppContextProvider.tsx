import React, { ReactNode } from 'react';
import { AppProvider as Provider } from './AppContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return <Provider>{children}</Provider>;
}; 