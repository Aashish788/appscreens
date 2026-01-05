
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

export interface ScreenshotSet {
  id: string;
  title: string;
  subtitle: string;
  image: string | null;
  titleStyles: TextStyles;
  subtitleStyles: TextStyles;
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
