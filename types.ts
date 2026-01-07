
export type DeviceType = 'iphone16pro' | 'iphone16promax' | 'ipadpro' | 'pixel9pro';

export interface DeviceMetadata {
  id: DeviceType;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  platform: 'ios' | 'android';
}

export interface AppStyles {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  backgroundType: 'gradient' | 'mesh' | 'glass' | 'panoramic' | 'abstract' | 'ai-generated' | 'solid' | 'spotlight';
  backgroundImage?: string;
  gradientAngle: number;
  cornerRadius: number;
  deviceTilt: number;
  deviceRotation: number;
  deviceScale: number;
  deviceVerticalPosition: number; // percentage offset from default position
  deviceHorizontalPosition: number; // percentage offset from default horizontal position
  frameRotation: number; // rotation angle for the entire frame (like straighten in cropping)
  showShadows: boolean;
  textAlign: 'left' | 'center' | 'right';
  deviceColor: 'titanium' | 'black' | 'silver' | 'gold';
  showHeatmap: boolean;
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  showDecorations: boolean;
  shadowIntensity: 'none' | 'soft' | 'heavy' | 'floating' | 'grounded';
  layoutDensity: 'airy' | 'compact';
  textBlur?: boolean;
  borderAccent?: boolean;
  showDevice: boolean;
  // --- New Premium DIY Styles ---
  noiseOpacity: number;
  glassBlur: number;
  reflectionOpacity: number;
  backgroundPattern: 'none' | 'grid' | 'dots' | 'plus';
  frameGap: number;
  // --- Even More Premium DIY Styles ---
  interactiveTilt: boolean;
  showFloatingShapes: boolean;
  meshAnimationSpeed: number; // 0 to 100
}

export interface TextStyles {
  color: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  letterSpacing: number;
  lineHeight: number;
  textShadow: boolean;
  verticalPosition: number; // percentage from top
}

export interface Sticker {
  id: string;
  url: string;
  x: number; // percentage
  y: number; // percentage
  scale: number;
  rotation: number;
  opacity: number;
}

// New: Floating Image element for canvas
export interface FloatingImage {
  id: string;
  url: string;
  x: number; // percentage from left
  y: number; // percentage from top
  width: number; // percentage of frame width
  height: number; // percentage of frame height
  rotation: number;
  opacity: number;
  zIndex: number;
}

// New: Floating Text element for canvas
export interface FloatingText {
  id: string;
  content: string;
  x: number; // percentage from left
  y: number; // percentage from top
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  color: string;
  rotation: number;
  opacity: number;
  textAlign: 'left' | 'center' | 'right';
  zIndex: number;
}

export interface ScreenshotSet {
  id: string;
  title: string;
  subtitle: string;
  image: string | null;
  titleStyles: TextStyles;
  subtitleStyles: TextStyles;
  styles?: Partial<AppStyles>;
  stickers?: Sticker[];
  // New canvas elements
  hideDevice?: boolean;
  floatingImages?: FloatingImage[];
  floatingTexts?: FloatingText[];
}

export interface AIAnalysisResult {
  colors: string[];
  suggestedCaptions: {
    title: string;
    subtitle: string;
  }[];
  styleRecommendation: string;
  scenePrompt: string;
}

export interface Template {
  id: string;
  name: string;
  category: 'Modern' | 'Fintech' | 'Luxury' | 'SaaS' | 'Social' | 'Editorial' | 'Health' | 'Gaming' | 'Travel' | 'Creative' | 'Entertainment';
  styles: Partial<AppStyles>;
  previewColor: string;
  previewImage?: string;
}
