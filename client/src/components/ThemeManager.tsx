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
    primary_color: '#800020',
    secondary_color: '#04091e',
    show_top_header: 1,
    top_header_phone: '+953 012 3654 896',
    top_header_email: 'support@apex.edu',
    top_header_bg_color: '#800020',
    top_header_text_color: '#ffffff',
    social_facebook: '#',
    social_twitter: '#',
    social_linkedin: '#',
    social_instagram: '#',
    social_youtube: '#',
    top_header_links: '[]',
    show_main_header: 1,
    univ_tagline: 'Autonomous Institution | Approved by AICTE | Permanently Affiliated',
    accreditation_logos: '[{"id":"naac","title":"NAAC A++","subtitle":"Accredited Grade","image_url":"/naac.png"},{"id":"nba","title":"NBA","subtitle":"Accredited Tier-1","image_url":"/nba.png"},{"id":"nirf","title":"NIRF","subtitle":"Top Engineering","image_url":"/nirf.png"},{"id":"ugc","title":"UGC","subtitle":"Autonomous","image_url":"/ugc.png"}]'
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme-mode') === 'dark';
  });

  // Fetch settings from API
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/settings`)
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

    // Dynamic top header variables
    root.style.setProperty('--color-top-header-bg', settings.top_header_bg_color || '#800020');
    root.style.setProperty('--color-top-header-text', settings.top_header_text_color || '#ffffff');

    // Calculate light/dark offsets
    root.style.setProperty('--color-primary-dark', preset.primaryDark);
    root.style.setProperty('--color-primary-light', preset.primaryLight);

    root.style.setProperty('--color-accent', preset.accent);

    // Update browser title tab dynamically!
    document.title = settings.univ_name + ' | Portal';

    // Update favicon dynamically based on logo!
    if (settings.logo_url) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.logo_url;
    }
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/settings`, {
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
