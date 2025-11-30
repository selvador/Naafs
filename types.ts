

export enum ViewState {
  WELCOME = 'WELCOME',
  AUTH = 'AUTH',
  HOME = 'HOME',
  CHAT = 'CHAT',
  JOURNAL = 'JOURNAL',
  MOOD = 'MOOD',
  PROFILE = 'PROFILE',
  THERAPISTS = 'THERAPISTS',
  MANAGEMENT = 'MANAGEMENT',
  CASE_MANAGER = 'CASE_MANAGER'
}

export type UserRole = 'PATIENT' | 'THERAPIST' | 'MANAGEMENT' | 'CASE_MANAGER';
export type Language = 'en' | 'ar' | 'fr';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Therapist {
  id: string;
  name: string;
  specialization: string;
  qualifications: string;
  bio: string;
  contact: string;
  whatsapp?: string; // WhatsApp number for direct calls
  isApproved: boolean;
  rating: number;
  reviews: Review[];
  avatar?: string; // Base64 string for profile picture
}

export interface UserProfile {
  // Patient Editable
  name: string;
  age: string;
  gender: string;
  contact: string;
  phoneNumber?: string;
  emergencyContact: string;
  avatar?: string; // Base64 string for profile picture
  
  // Specialist/Therapist Editable (Restricted)
  diagnosis: string;
  history: string;
  treatmentNotes: string;
}

export type CaseStatus = 'ACTIVE' | 'REVIEW' | 'ARCHIVED' | 'CRITICAL';

export interface CaseFile {
  id: string;
  patientName: string;
  age: string;
  contact: string;
  diagnosis: string;
  clinicalHistory: string;
  
  // The "Recommendations" logic
  clinicalDirectives: string;
  
  // Doctor's specific opinion/notes
  doctorOpinion?: string;
  
  // Collaboration
  assignedTherapistIds: string[]; 
  
  status: CaseStatus;
  lastUpdated: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface MoodEntry {
  id: string;
  timestamp: number;
  score: number; // 1-5
  tags: string[];
  note?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  insight?: string; // AI generated insight
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  STREAMING = 'STREAMING',
  ERROR = 'ERROR'
}