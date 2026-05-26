import { useState, useEffect } from 'react';

export interface SocialLinks {
  github: string;
  linkedin: string;
  facebook: string;
  instagram: string;
}

export const defaultSocials: SocialLinks = {
  github: 'https://github.com/syedalibg',
  linkedin: 'https://linkedin.com/in/syedalibg',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
};

// Global cache to prevent multiple fetches and flickering
let cachedSocials: SocialLinks | null = null;
const listeners = new Set<(s: SocialLinks) => void>();

export function useSocialLinks() {
  const [socials, setSocials] = useState<SocialLinks>(cachedSocials || defaultSocials);
  const [loading, setLoading] = useState(!cachedSocials);

  useEffect(() => {
    const listener = (newSocials: SocialLinks) => {
      setSocials(newSocials);
    };
    listeners.add(listener);

    const fetchSocials = async () => {
      try {
        const res = await fetch('/api/socials');
        if (res.ok) {
          const data = await res.json();
          const merged = { ...defaultSocials, ...data };
          cachedSocials = merged;
          listeners.forEach(l => l(merged));
        }
      } catch (err) {
        console.warn('Failed to load social links from API', err);
      } finally {
        setLoading(false);
      }
    };

    if (!cachedSocials) {
      fetchSocials();
    } else {
      setLoading(false);
    }

    return () => {
      listeners.delete(listener);
    };
  }, []);

  const updateSocialsLocally = (newSocials: SocialLinks) => {
    cachedSocials = newSocials;
    listeners.forEach(l => l(newSocials));
  };

  return { socials, loading, updateSocialsLocally };
}
