// components/EasterEggManager.jsx (actualizado)
import React, { createContext, useState, useContext, useEffect } from 'react';

const EasterEggContext = createContext();

export const useEasterEggs = () => {
  const context = useContext(EasterEggContext);
  if (!context) {
    throw new Error('useEasterEggs debe ser usado dentro de EasterEggProvider');
  }
  return context;
};

export const EasterEggProvider = ({ children }) => {
  const [unlockedEggs, setUnlockedEggs] = useState([]);
  const [activeEffects, setActiveEffects] = useState({});
  const [notification, setNotification] = useState(null);

  // Cargar Easter Eggs desbloqueados de localStorage
  useEffect(() => {
    const saved = localStorage.getItem('easterEggs');
    if (saved) {
      setUnlockedEggs(JSON.parse(saved));
    }
  }, []);

  // Guardar en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('easterEggs', JSON.stringify(unlockedEggs));
  }, [unlockedEggs]);

  const unlockEgg = (eggId, eggName) => {
    if (!unlockedEggs.includes(eggId)) {
      const newUnlocked = [...unlockedEggs, eggId];
      setUnlockedEggs(newUnlocked);
      showNotification(`¡Easter Egg Desbloqueado! 🎮\n${eggName}`);
    }
  };

  const activateEffect = (effectId, duration = 10000) => {
    setActiveEffects(prev => ({
      ...prev,
      [effectId]: true
    }));

    // Si tiene duración, desactivar después
    if (duration > 0) {
      setTimeout(() => {
        deactivateEffect(effectId);
      }, duration);
    }
  };

  const deactivateEffect = (effectId) => {
    setActiveEffects(prev => {
      const newEffects = { ...prev };
      delete newEffects[effectId];
      return newEffects;
    });
  };

  const showNotification = (message, duration = 3000) => {
    setNotification(message);
    setTimeout(() => setNotification(null), duration);
  };

  const isEggUnlocked = (eggId) => unlockedEggs.includes(eggId);
  const isEffectActive = (effectId) => activeEffects[effectId] || false;

  const value = {
    unlockedEggs,
    activeEffects,
    notification,
    unlockEgg,
    activateEffect,
    deactivateEffect,
    showNotification,
    isEggUnlocked,
    isEffectActive
  };

  return (
    <EasterEggContext.Provider value={value}>
      {children}
      {notification && (
        <div className="easter-egg-notification">
          <div className="notification-content">
            <span className="notification-icon">🎮</span>
            <span className="notification-text">{notification}</span>
          </div>
        </div>
      )}
    </EasterEggContext.Provider>
  );
};