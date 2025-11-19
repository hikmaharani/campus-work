import { Service, Booking, BookingStatus, ChatThread, Notification } from './types';

export const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    freelancerId: 'f1',
    freelancerName: 'Sarah J.',
    title: 'Les Privat Kalkulus & Fisika Dasar',
    description: 'Bimbingan belajar intensif untuk mahasiswa semester 1 & 2. Dijamin paham konsep!',
    category: 'Academic',
    price: 50000,
    rating: 4.8,
    reviewCount: 24,
    imageUrl: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: '2',
    freelancerId: 'f2',
    freelancerName: 'Dimas Tech',
    title: 'Jasa Install Ulang Laptop & Software',
    description: 'Laptop lemot? Kena virus? Saya bantu bersihkan dan install ulang OS + Office.',
    category: 'Technical',
    price: 75000,
    rating: 4.9,
    reviewCount: 15,
    imageUrl: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: '3',
    freelancerId: 'f3',
    freelancerName: 'Ani Design',
    title: 'Desain Poster & PPT Menarik',
    description: 'Butuh desain untuk tugas atau event kampus? Pengerjaan cepat 1x24 jam.',
    category: 'Creative',
    price: 35000,
    rating: 4.5,
    reviewCount: 8,
    imageUrl: 'https://picsum.photos/400/300?random=3'
  },
  {
    id: '4',
    freelancerId: 'f4',
    freelancerName: 'Budi Photo',
    title: 'Fotografer Wisuda & Event',
    description: 'Abadikan momen spesialmu dengan kualitas DSLR profesional.',
    category: 'Creative',
    price: 150000,
    rating: 5.0,
    reviewCount: 42,
    imageUrl: 'https://picsum.photos/400/300?random=4'
  }
];

// Updated MOCK_BOOKINGS to align with new types (clientId, deadline)
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    serviceId: '1',
    serviceTitle: 'Les Privat Kalkulus',
    freelancerName: 'Sarah J.',
    freelancerId: 'f1',
    clientId: 'me', // Assuming 'me' is the logged in user id for demo
    clientName: 'Me',
    date: '2023-10-25',
    deadline: '2023-10-30',
    status: BookingStatus.PENDING,
    price: 50000
  },
  {
    id: 'b2',
    serviceId: '3',
    serviceTitle: 'Desain Poster',
    freelancerName: 'Ani Design',
    freelancerId: 'f3',
    clientId: 'me',
    clientName: 'Me',
    date: '2023-10-20',
    deadline: '2023-10-22',
    status: BookingStatus.COMPLETED,
    price: 35000
  },
  {
    id: 'b3',
    serviceId: '2',
    serviceTitle: 'Install Ulang Laptop',
    freelancerName: 'Dimas Tech',
    freelancerId: 'f2',
    clientId: 'me',
    clientName: 'Me',
    date: '2023-10-15',
    deadline: '2023-10-16',
    status: BookingStatus.CANCELLED,
    price: 75000
  }
];

export const MOCK_CHATS: ChatThread[] = [
  {
    id: 'c1',
    participants: ['me', 'f1'],
    participantDetails: {
      'f1': { name: 'Sarah J.', avatar: 'https://picsum.photos/50/50?random=10' },
      'me': { name: 'Me', avatar: '' }
    },
    messages: [
        { id: 'm1', text: 'Halo kak, apakah slot masih ada?', senderId: 'me', timestamp: 1698200000000, isRead: true },
        { id: 'm2', text: 'Masih kak, untuk hari apa?', senderId: 'f1', timestamp: 1698200060000, isRead: true },
        { id: 'm3', text: 'Oke, kita ketemu di perpus jam 3 ya.', senderId: 'f1', timestamp: 1698203400000, isRead: false }
    ],
    lastMessage: 'Oke, kita ketemu di perpus jam 3 ya.',
    lastTimestamp: 1698203400000,
  },
  {
    id: 'c2',
    participants: ['me', 'f2'],
    participantDetails: {
      'f2': { name: 'Dimas Tech', avatar: 'https://picsum.photos/50/50?random=11' },
      'me': { name: 'Me', avatar: '' }
    },
    messages: [
        { id: 'm1', text: 'Laptopnya sudah bisa diambil kak.', senderId: 'f2', timestamp: 1698100000000, isRead: true }
    ],
    lastMessage: 'Laptopnya sudah bisa diambil kak.',
    lastTimestamp: 1698100000000,
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Booking Confirmed',
    message: 'Your booking with Sarah J. has been confirmed.',
    isRead: false,
    date: '2 mins ago'
  },
  {
    id: 'n2',
    title: 'Withdrawal Success',
    message: 'Your fund withdrawal of Rp 150.000 has been processed.',
    isRead: true,
    date: '1 day ago'
  }
];

export const CATEGORIES = ['All', 'Academic', 'Creative', 'Technical', 'Other'];