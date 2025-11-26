export interface CertificateData {
  recipientName: string;
  title: string;
  description: string;
  date: string;
  issuerName: string;
  issuerTitle: string;
  signatureText: string;
  theme: CertificateTheme;
  companyName: string;
  logoImage?: string;
  logoWidth: number;
  logoTop: number;
  logoLeft: number;
  logoOpacity?: number;
  recipientFont?: 'sans' | 'serif' | 'script' | 'display';
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export enum CertificateTheme {
  CLASSIC = 'CLASSIC',
  MODERN = 'MODERN',
  MINIMAL = 'MINIMAL',
  SMART_WAVE = 'SMART_WAVE',
  WHITE = 'WHITE',
  SILK_RIBBON = 'SILK_RIBBON',
}

export interface AiExtractionResponse {
  recipientName?: string;
  title?: string;
  description?: string;
  date?: string;
  issuerName?: string;
  issuerTitle?: string;
  companyName?: string;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}