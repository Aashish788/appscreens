
import React from 'react';
import { DeviceMetadata, Template } from './types';

export const DEVICES: DeviceMetadata[] = [
  { id: 'iphone16pro', name: 'iPhone 16 Pro', width: 1179, height: 2556, aspectRatio: '9:19.5', platform: 'ios' },
  { id: 'iphone16promax', name: 'iPhone 16 Pro Max', width: 1290, height: 2796, aspectRatio: '9:19.5', platform: 'ios' },
  { id: 'ipadpro', name: 'iPad Pro 12.9"', width: 2048, height: 2732, aspectRatio: '4:3', platform: 'ios' },
  { id: 'pixel9pro', name: 'Pixel 9 Pro', width: 1344, height: 2992, aspectRatio: '9:20', platform: 'android' },
];

export const TEMPLATES: Template[] = [
  // --- ORIGINAL FAVORITES (Preserved) ---
  {
    id: 'titanium-minimal',
    name: 'Titanium Pro',
    category: 'Modern',
    previewColor: '#000000',
    styles: { primaryColor: '#000000', secondaryColor: '#1A1A1A', backgroundType: 'spotlight', textAlign: 'center', deviceColor: 'titanium', deviceTilt: 0, deviceScale: 0.9, showDecorations: true, shadowIntensity: 'floating', borderAccent: true }
  },
  {
    id: 'linear-obsidian',
    name: 'Obsidian Flow',
    category: 'SaaS',
    previewColor: '#5E6AD2',
    styles: { primaryColor: '#5E6AD2', secondaryColor: '#050505', backgroundType: 'mesh', textAlign: 'left', deviceColor: 'black', deviceTilt: 15, deviceRotation: -5, deviceScale: 1.1, showDecorations: true, shadowIntensity: 'heavy' }
  },
  {
    id: 'stripe-indigo',
    name: 'Indigo Pulse',
    category: 'Fintech',
    previewColor: '#635BFF',
    styles: { primaryColor: '#635BFF', secondaryColor: '#00D4FF', backgroundType: 'gradient', gradientAngle: 135, textAlign: 'center', deviceColor: 'silver', deviceTilt: -12, deviceScale: 0.95, showDecorations: true, shadowIntensity: 'grounded' }
  },
  {
    id: 'airbnb-editorial',
    name: 'Luxe Editorial',
    category: 'Luxury',
    previewColor: '#FF385C',
    styles: { primaryColor: '#FF385C', secondaryColor: '#FFFFFF', backgroundType: 'solid', textAlign: 'left', deviceColor: 'gold', deviceTilt: 0, deviceScale: 0.85, showDecorations: false, shadowIntensity: 'soft' }
  },
  {
    id: 'nordic-glass',
    name: 'Nordic Glass',
    category: 'Editorial',
    previewColor: '#8E9AAF',
    styles: { primaryColor: '#8E9AAF', secondaryColor: '#CBC0D3', backgroundType: 'glass', textAlign: 'center', deviceColor: 'silver', deviceTilt: 5, deviceScale: 0.9, showDecorations: true, shadowIntensity: 'soft' }
  },
  {
    id: 'cyberpunk-neon',
    name: 'Neon Velocity',
    category: 'Social',
    previewColor: '#00FF88',
    styles: { primaryColor: '#00FF88', secondaryColor: '#BC00FF', backgroundType: 'mesh', textAlign: 'right', deviceColor: 'black', deviceTilt: -20, deviceScale: 1.2, showDecorations: true, shadowIntensity: 'floating' }
  },

  // --- NEW FINTECH & ELITE WEALTH ---
  {
    id: 'revolut-metal',
    name: 'Metal Midnight',
    category: 'Fintech',
    previewColor: '#0A0A0B',
    styles: { primaryColor: '#0A0A0B', secondaryColor: '#2D3748', backgroundType: 'mesh', textAlign: 'center', deviceColor: 'titanium', deviceTilt: 0, deviceScale: 0.92, showDecorations: true, shadowIntensity: 'heavy', borderAccent: true }
  },
  {
    id: 'monzo-coral',
    name: 'Coral Glow',
    category: 'Fintech',
    previewColor: '#FF4D4D',
    styles: { primaryColor: '#FF4D4D', secondaryColor: '#FF8080', backgroundType: 'spotlight', textAlign: 'left', deviceColor: 'silver', deviceTilt: 10, deviceScale: 1.0, shadowIntensity: 'soft' }
  },
  {
    id: 'visa-infinite',
    name: 'Infinite Navy',
    category: 'Fintech',
    previewColor: '#002B5B',
    styles: { primaryColor: '#002B5B', secondaryColor: '#004C99', backgroundType: 'glass', textAlign: 'right', deviceColor: 'gold', deviceTilt: -15, deviceScale: 1.1, shadowIntensity: 'heavy' }
  },

  // --- NEW SAAS & CLOUD ---
  {
    id: 'notion-minimal',
    name: 'Notion Clean',
    category: 'SaaS',
    previewColor: '#FFFFFF',
    styles: { primaryColor: '#FFFFFF', secondaryColor: '#F7F7F7', backgroundType: 'solid', textAlign: 'center', deviceColor: 'black', deviceTilt: 0, deviceScale: 0.85, shadowIntensity: 'soft' }
  },
  {
    id: 'slack-aubergine',
    name: 'Aubergine Hub',
    category: 'SaaS',
    previewColor: '#4A154B',
    styles: { primaryColor: '#4A154B', secondaryColor: '#361037', backgroundType: 'gradient', gradientAngle: 180, textAlign: 'left', deviceColor: 'silver', deviceTilt: 5, deviceScale: 0.95, showDecorations: true }
  },
  {
    id: 'figma-space',
    name: 'Creative Canvas',
    category: 'SaaS',
    previewColor: '#1E1E1E',
    styles: { primaryColor: '#1E1E1E', secondaryColor: '#FF7262', backgroundType: 'mesh', textAlign: 'center', deviceColor: 'black', deviceTilt: -10, deviceRotation: 5, deviceScale: 1.0 }
  },

  // --- NEW LUXURY & LIFESTYLE ---
  {
    id: 'vogue-noir',
    name: 'High Fashion',
    category: 'Luxury',
    previewColor: '#000000',
    styles: { primaryColor: '#000000', secondaryColor: '#FFFFFF', backgroundType: 'abstract', textAlign: 'center', deviceColor: 'gold', deviceTilt: -20, deviceScale: 1.3, shadowIntensity: 'floating' }
  },
  {
    id: 'hermes-orange',
    name: 'Hermès Sun',
    category: 'Luxury',
    previewColor: '#FF7700',
    styles: { primaryColor: '#FF7700', secondaryColor: '#FFFFFF', backgroundType: 'solid', textAlign: 'left', deviceColor: 'gold', deviceTilt: 0, deviceScale: 0.8, shadowIntensity: 'soft' }
  },
  {
    id: 'tiffany-teal',
    name: 'Blue Box',
    category: 'Luxury',
    previewColor: '#81D8D0',
    styles: { primaryColor: '#81D8D0', secondaryColor: '#FFFFFF', backgroundType: 'glass', textAlign: 'right', deviceColor: 'silver', deviceTilt: 15, deviceScale: 1.0, shadowIntensity: 'soft' }
  },

  // --- NEW HEALTH & WELLNESS ---
  {
    id: 'headspace-zen',
    name: 'Zen Mindset',
    category: 'Health',
    previewColor: '#FF9E2C',
    styles: { primaryColor: '#FF9E2C', secondaryColor: '#FFFFFF', backgroundType: 'gradient', gradientAngle: 45, textAlign: 'center', deviceColor: 'silver', deviceTilt: 0, deviceScale: 0.9, shadowIntensity: 'soft' }
  },
  {
    id: 'calm-mist',
    name: 'Deep Mist',
    category: 'Health',
    previewColor: '#4A90E2',
    styles: { primaryColor: '#4A90E2', secondaryColor: '#B8E986', backgroundType: 'mesh', textAlign: 'left', deviceColor: 'silver', deviceTilt: -5, deviceScale: 1.05, shadowIntensity: 'soft' }
  },
  {
    id: 'strava-pulse',
    name: 'Athlete Pulse',
    category: 'Health',
    previewColor: '#FC4C02',
    styles: { primaryColor: '#FC4C02', secondaryColor: '#000000', backgroundType: 'spotlight', textAlign: 'center', deviceColor: 'black', deviceTilt: 0, deviceScale: 0.95, shadowIntensity: 'heavy' }
  },

  // --- NEW SOCIAL & ENTERTAINMENT ---
  {
    id: 'twitch-glitch',
    name: 'Streamer Prime',
    category: 'Social',
    previewColor: '#9146FF',
    styles: { primaryColor: '#9146FF', secondaryColor: '#000000', backgroundType: 'mesh', textAlign: 'left', deviceColor: 'black', deviceTilt: 20, deviceRotation: 10, deviceScale: 1.4, shadowIntensity: 'floating' }
  },
  {
    id: 'netflix-red',
    name: 'Crimson Cinema',
    category: 'Entertainment',
    previewColor: '#E50914',
    styles: { primaryColor: '#E50914', secondaryColor: '#000000', backgroundType: 'spotlight', textAlign: 'center', deviceColor: 'black', deviceTilt: 0, deviceScale: 1.1, shadowIntensity: 'heavy' }
  },
  {
    id: 'spotify-neon',
    name: 'Audio Pulse',
    category: 'Entertainment',
    previewColor: '#1DB954',
    styles: { primaryColor: '#1DB954', secondaryColor: '#191414', backgroundType: 'mesh', textAlign: 'right', deviceColor: 'black', deviceTilt: -15, deviceScale: 1.05, shadowIntensity: 'floating' }
  },

  // --- NEW GAMING ---
  {
    id: 'razer-blade',
    name: 'Snake Neon',
    category: 'Gaming',
    previewColor: '#44FF00',
    styles: { primaryColor: '#44FF00', secondaryColor: '#000000', backgroundType: 'spotlight', textAlign: 'center', deviceColor: 'black', deviceTilt: 25, deviceRotation: -10, deviceScale: 1.25, shadowIntensity: 'floating' }
  },
  {
    id: 'steam-deck',
    name: 'Vapor Slate',
    category: 'Gaming',
    previewColor: '#1B2838',
    styles: { primaryColor: '#1B2838', secondaryColor: '#66C0F4', backgroundType: 'mesh', textAlign: 'left', deviceColor: 'titanium', deviceTilt: -5, deviceScale: 1.0, shadowIntensity: 'heavy' }
  },

  // --- TRAVEL & CREATIVE ---
  {
    id: 'airbnb-editorial-alt',
    name: 'Venture Clean',
    category: 'Travel',
    previewColor: '#FF5A5F',
    styles: { primaryColor: '#FFFFFF', secondaryColor: '#FF5A5F', backgroundType: 'solid', textAlign: 'center', deviceColor: 'silver', deviceTilt: 0, deviceScale: 0.85, shadowIntensity: 'soft' }
  },
  {
    id: 'dribbble-shot',
    name: 'Designer Shot',
    category: 'Creative',
    previewColor: '#EA4C89',
    styles: { primaryColor: '#EA4C89', secondaryColor: '#FFFFFF', backgroundType: 'gradient', gradientAngle: 135, textAlign: 'center', deviceColor: 'gold', deviceTilt: 0, deviceScale: 0.9, shadowIntensity: 'floating' }
  },
  {
    id: 'adobe-express',
    name: 'Express Flow',
    category: 'Creative',
    previewColor: '#FA0F00',
    styles: { primaryColor: '#FA0F00', secondaryColor: '#FFFFFF', backgroundType: 'mesh', textAlign: 'left', deviceColor: 'black', deviceTilt: 5, deviceScale: 1.0, shadowIntensity: 'heavy' }
  }
];

const DEFAULT_TITLE_STYLES = {
  color: '#FFFFFF',
  fontSize: 28,
  fontFamily: 'Inter, sans-serif',
  fontWeight: 900,
  letterSpacing: -1,
  lineHeight: 1.1,
  textShadow: true,
  verticalPosition: 12,
};

const DEFAULT_SUBTITLE_STYLES = {
  color: 'rgba(255,255,255,0.7)',
  fontSize: 14,
  fontFamily: 'Inter, sans-serif',
  fontWeight: 600,
  letterSpacing: 0,
  lineHeight: 1.4,
  textShadow: false,
  verticalPosition: 12,
};

export const INITIAL_SCREENSHOTS = [
  { id: '1', title: 'Ultimate Control', subtitle: 'Harness the power of professional automation.', image: null, titleStyles: { ...DEFAULT_TITLE_STYLES }, subtitleStyles: { ...DEFAULT_SUBTITLE_STYLES } },
  { id: '2', title: 'Seamless Sync', subtitle: 'Your data, everywhere, all at once.', image: null, titleStyles: { ...DEFAULT_TITLE_STYLES }, subtitleStyles: { ...DEFAULT_SUBTITLE_STYLES } },
  { id: '3', title: 'Ironclad Security', subtitle: 'Encryption that sets the global standard.', image: null, titleStyles: { ...DEFAULT_TITLE_STYLES }, subtitleStyles: { ...DEFAULT_SUBTITLE_STYLES } },
];

export { DEFAULT_TITLE_STYLES, DEFAULT_SUBTITLE_STYLES };

export const Icons = {
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  Sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09-3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  Device: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  ),
  ArrowDownTray: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  ),
  Magic: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-3.447c.102-.62-.435-1.189-1.057-1.139l-3.456.281 2.223-2.511m3.231 4.59L18.903 20.2M5.898 6.961L4.541 1.89m0 0l-2.51 2.225.569-3.447c.102-.62-.435-1.189-1.057-1.139l-3.456.281 2.223-2.511m3.231 4.59L9.761 5.489" />
    </svg>
  ),
  Eye: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.044 7.433 5 12 5c4.567 0 8.57 3.044 9.964 6.678.07.183.07.384 0 .568C20.567 15.956 16.567 19 12 19c-4.567 0-8.57-3.044-9.964-6.678z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};
