// Types for GramLipi - Document & Notice Simplifier (Module 3)

export type Language = "en" | "kn";

export type DocumentSourceType = "upload" | "camera";

export interface UploadedDocument {
  id: string;
  fileName: string;
  sourceType: DocumentSourceType;
  imageDataUrl: string;
  uploadedAt: string;
}

export interface OCRResult {
  documentId: string;
  rawText: string;
  editedText: string;
  confidence: number;
  processedAt: string;
}

export interface SimplifiedDocument {
  documentId: string;
  originalText: string;
  simplifiedText: string;
  language: Language;
}

export interface DocumentSummary {
  documentId: string;
  mainPurpose: string;
  importantDates: string[];
  requiredActions: string[];
  keyPoints: string[];
  language: Language;
}

export interface ComplaintDetails {
  issueTitle: string;
  location: string;
  description: string;
  date: string;
  authorityName: string;
}

export interface ComplaintLetter {
  id: string;
  details: ComplaintDetails;
  subject: string;
  greeting: string;
  body: string;
  closingStatement: string;
  language: Language;
  generatedAt: string;
}

export type ProcessingStage =
  | "idle"
  | "uploading"
  | "ocr"
  | "simplifying"
  | "summarizing"
  | "done"
  | "error";

export interface GramLipiState {
  document: UploadedDocument | null;
  ocrResult: OCRResult | null;
  simplifiedDocument: SimplifiedDocument | null;
  summary: DocumentSummary | null;
  stage: ProcessingStage;
  error: string | null;
}