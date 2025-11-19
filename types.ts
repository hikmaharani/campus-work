export enum Role {
  NONE = 'NONE',
  FREELANCER = 'FREELANCER',
  CLIENT = 'CLIENT',
  BOTH = 'BOTH'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  balance: number;
}

export interface Service {
  id: string;
  freelancerId: string;
  freelancerName: string;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  freelancerName: string;
  date: string;
  status: BookingStatus;
  price: number;
}

export interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: number; // Unix timestamp
    isRead: boolean;
}

export interface ChatThread {
  id: string;
  participants: string[]; // User IDs
  participantDetails: { [key: string]: { name: string, avatar: string } }; // Cache details
  messages: Message[];
  lastMessage: string;
  lastTimestamp: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  date: string;
}