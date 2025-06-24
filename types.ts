
export interface NavItemType {
  name: string;
  path: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}

export interface RichMediaButton {
  id: string;
  text: string;
  actionType: 'reply' | 'open-url';
  actionBody: string;
  columns?: number;
  rows?: number;
}

export interface WelcomeMessageConfig {
  title: string;
  text: string;
  imageUrl: string;
  buttons: RichMediaButton[];
}

export interface QAItem {
  id: string;
  question: string;
  answer: string;
}

export enum MessageMediaType {
  TEXT = 'Text',
  IMAGE = 'Image',
  VIDEO = 'Video',
  DOCUMENT = 'Document',
}

export interface BroadcastMessage {
  id: string;
  content: string;
  mediaType: MessageMediaType;
  mediaUrl?: string; // For Image, Video, Document
  segments: string[]; // User segment IDs or names
  scheduledAt?: Date;
  status: 'Draft' | 'Sent' | 'Scheduled';
}

export interface CustomerTicket {
  id: string;
  userName: string;
  email: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: Date;
}

export interface AppLog {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'error' | 'api';
}
