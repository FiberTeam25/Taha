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
}

export enum CertificateTheme {
  CLASSIC = 'CLASSIC',
  MODERN = 'MODERN',
  MINIMAL = 'MINIMAL',
  SMART_WAVE = 'SMART_WAVE',
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