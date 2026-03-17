import { createContext, useContext } from 'react';
import { useDarkNavigation } from '../hooks/useDarkNavigation';
import DarknessOverlay from '../components/ui/DarknessOverlay';

const NavigationContext = createContext();

export function NavigationProvider({ children }) {
  const navigation = useDarkNavigation();

  return (
    <NavigationContext.Provider value={navigation}>
      {children}
      {navigation.darkness.active && (
        <DarknessOverlay
          position={navigation.darkness.position}
          onComplete={navigation.handleDarknessComplete}
        />
      )}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}