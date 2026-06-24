import React, { createContext, useContext, useState, useEffect } from 'react';
import { Settings } from '../types';

export const colorPresets = {
  crimson: {
    primary: '#f8b600',      // Education Gold
    primaryDark: '#d97706',
    primaryLight: '#fef3c7',
    secondary: '#04091e',    // Deep Navy
    accent: '#f8b600',       // Gold Accent
  },
  emerald: {
    primary: '#047857',      // Emerald Green
    primaryDark: '#065f46',
    primaryLight: '#f0fdf4',
    secondary: '#1e293b',    // Slate Gray
    accent: '#8a8a8a',       // Silver
  },
  sapphire: {
    primary: '#1d4ed8',      // Sapphire Blue
    primaryDark: '#1e40af',
    primaryLight: '#eff6ff',
    secondary: '#0b0f19',    // Deep Navy
    accent: '#f59e0b',       // Amber Gold
  },
  midnight: {
    primary: '#4c1d95',      // Midnight Purple
    primaryDark: '#2e1065',
    primaryLight: '#f5f3ff',
    secondary: '#090514',    // Midnight Dark
    accent: '#c2410c',       // Bronze
  }
};

interface ThemeContextType {
  settings: Settings;
  updateSettings: (newSettings: Settings) => Promise<boolean>;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<Settings>({
    univ_name: 'Apex University',
    logo_url: '',
    theme_preset: 'crimson',
    primary_color: '#f8b600',
    secondary_color: '#04091e'
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme-mode') === 'dark';
  });

  // Fetch settings from API
  useEffect(() => {
    fetch('http://localhost:5001/api/settings')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch settings');
        return res.json();
      })
      .then(data => {
        if (data && data.univ_name) {
          setSettingsState(data);
        }
      })
      .catch(err => console.warn('Could not load branding settings from server, using defaults:', err.message));
  }, []);

  // Sync color variables to DOM :root
  useEffect(() => {
    const root = document.documentElement;
    const preset = colorPresets[settings.theme_preset] || colorPresets.crimson;

    // Use custom settings if explicitly defined, otherwise preset
    const prim = settings.primary_color || preset.primary;
    const sec = settings.secondary_color || preset.secondary;

    root.style.setProperty('--color-primary', prim);
    root.style.setProperty('--color-secondary', sec);

    // Calculate light/dark offsets
    root.style.setProperty('--color-primary-dark', preset.primaryDark);
    root.style.setProperty('--color-primary-light', preset.primaryLight);

    root.style.setProperty('--color-accent', preset.accent);

    // Update browser title tab dynamically!
    document.title = settings.univ_name + ' | Portal';
  }, [settings]);

  // Sync dark mode class
  useEffect(() => {
    const body = document.body;
    if (darkMode) {
      body.classList.add('dark');
      localStorage.setItem('theme-mode', 'dark');
    } else {
      body.classList.remove('dark');
      localStorage.setItem('theme-mode', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const updateSettings = async (newSettings: Settings) => {
    try {
      const res = await fetch('http://localhost:5001/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        setSettingsState(newSettings);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      // Fallback update in case server is restarting
      setSettingsState(newSettings);
      return true;
    }
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
