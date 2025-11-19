import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, ArrowLeft, CheckCircle, ShieldCheck, MessageSquare, MapPin, Share2, Heart, Lock } from 'lucide-react';
import { Button, Badge, Modal } from '../components/UI';
import { MOCK_SERVICES } from '../constants';
import { Service, ChatThread } from '../types';
import { useApp } from '../App';

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, showToast } = useApp();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API Latency
    setTimeout(() => {
      if (id) {
        const found = MOCK_SERVICES.find(s => s.id === id);
        setService(found || null);
      }
      setIsLoading(false);
    }, 600);
  }, [id]);

  const checkAuthAndProceed = (action: 'booking' | 'chat') => {
      if (!user) {
          showToast('Silakan login terlebih dahulu untuk melanjutkan.', 'info');
          // Redirect to login with return path
          navigate('/login', { state: { from: location.pathname } });
          return;
      }

      if (action === 'booking') {
        showToast('Permintaan booking terkirim! Cek status di menu Bookings.', 'success');
        setTimeout(() => {
            navigate('/bookings');
        }, 1000);
      } else {
          handleChatInitiation();
      }
  };

  const handleChatInitiation = () => {
      if (!user || !service) return;

      const dbChatsStr = localStorage.getItem('campuswork_db_chats');
      let dbChats: ChatThread[] = dbChatsStr ? JSON.parse(dbChatsStr) : [];

      // Check if chat exists between these two
      let existingChat = dbChats.find(c => 
          c.participants.includes(user.id) && c.participants.includes(service.freelancerId)
      );

      let chatIdTarget = '';

      if (existingChat) {
          chatIdTarget = existingChat.id;
      } else {
          // Create new chat
          const newChat: ChatThread = {
              id: 'chat_' + Math.random().toString(36).substr(2, 9),
              participants: [user.id, service.freelancerId],
              participantDetails: {
                  [user.id]: { name: user.name, avatar: user.avatarUrl },
                  [service.freelancerId]: { name: service.freelancerName, avatar: `https://ui-avatars.com/api/?name=${service.freelancerName}&background=random` }
              },
              messages: [],
              lastMessage: '',
              lastTimestamp: Date.now()
          };
          dbChats.push(newChat);
          localStorage.setItem('campuswork_db_chats', JSON.stringify(dbChats));
          chatIdTarget = newChat.id;
      }

      // Navigate to chat with the ID
      navigate('/chat', { state: { activeChatId: chatIdTarget } });
  };

  const handleShare = () => {
      showToast('Link disalin ke clipboard!', 'success');
  };

  const handleWishlist = () => {
      setIsWishlisted(!isWishlisted);
      showToast(isWishlisted ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit', 'success');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>;
  }

  if (!service) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">Layanan Tidak Ditemukan</h2>
            <p className="text-gray-500 mb-6">Layanan yang Anda cari mungkin sudah dihapus atau tidak tersedia.</p>
            <Button onClick={() => navigate('/dashboard')}>Kembali ke Dashboard</Button>
        </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Breadcrumb / Back */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </button>
        <div className="flex gap-2">
            <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors" title="Bagikan">
                <Share2 className="w-5 h-5" />
            </button>
            <button onClick={handleWishlist} className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${isWishlisted ? 'text-red-500' : 'text-gray-500'}`} title="Simpan">
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="aspect-video w-full bg-gray-100 rounded-2xl overflow-hidden shadow-sm relative group">
            <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
          </div>

          {/* Header Info */}
          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <Badge color="blue">{service.category}</Badge>
                <Badge color="green"><CheckCircle className="w-3 h-3 mr-1"/>Tersedia</Badge>
             </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 leading-tight">{service.title}</h1>
            
            <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4 md:gap-6">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 fill-current mr-1.5" />
                <span className="font-bold text-gray-900 text-lg mr-1">{service.rating}</span>
                <span className="text-gray-500 underline cursor-pointer">({service.reviewCount} ulasan)</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-400 mr-1.5" />
                UNSRI Bukit / Indralaya
              </div>
              <div className="flex items-center">
                <ShieldCheck className="w-4 h-4 text-green-500 mr-1.5" />
                Terverifikasi Mahasiswa
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-4">Tentang Jasa Ini</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg font-light">
              {service.description}
            </p>
            
            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3"><CheckCircle className="w-5 h-5 text-green-700"/></div>
                    <div>
                        <h4 className="font-bold text-gray-900 font-heading">Kualitas Terjamin</h4>
                        <p className="text-sm text-gray-500">Dikerjakan dengan teliti dan profesional.</p>
                    </div>
                </div>
                <div className="flex items-start">
                     <div className="bg-blue-100 p-2 rounded-full mr-3"><MessageSquare className="w-5 h-5 text-blue-700"/></div>
                    <div>
                        <h4 className="font-bold text-gray-900 font-heading">Konsultasi Gratis</h4>
                        <p className="text-sm text-gray-500">Diskusikan kebutuhanmu sebelum memesan.</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-heading font-bold text-gray-900">Ulasan Pengguna</h2>
                 <Button variant="outline" size="sm">Lihat Semua</Button>
             </div>
             <div className="space-y-6">
                {[1, 2, 3].slice(0, service.reviewCount > 2 ? 3 : service.reviewCount).map(i => (
                    <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 overflow-hidden">
                                    <img src={`https://ui-avatars.com/api/?name=User+Reviewer+${i}&background=random`} alt="Reviewer" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 font-heading">Mahasiswa {String.fromCharCode(64+i)}</p>
                                    <p className="text-xs text-gray-500">2 hari yang lalu</p>
                                </div>
                            </div>
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-current" />)}
                            </div>
                        </div>
                        <p className="text-gray-600">"Sangat puas dengan hasilnya! Pengerjaan cepat dan komunikasi lancar. Recommended banget buat yang butuh mendadak."</p>
                    </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Sidebar (Sticky) */}
        <div className="lg:col-span-1 relative">
          <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 ring-1 ring-black/5">
            <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Total Harga</span>
              <span className="text-3xl font-heading font-bold text-primary">Rp {service.price.toLocaleString()}</span>
            </div>

            <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Waktu Pengerjaan</span>
                    <span className="font-semibold text-gray-900">1-3 Hari</span>
                </div>
                 <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Revisi</span>
                    <span className="font-semibold text-gray-900">2x Revisi</span>
                </div>
            </div>

            <div className="space-y-3">
                <Button onClick={() => checkAuthAndProceed('booking')} fullWidth size="lg" className="shadow-blue-200 shadow-lg font-heading">
                    {!user && <Lock className="w-4 h-4 mr-2" />}
                    Pesan Sekarang
                </Button>
                <Button onClick={() => checkAuthAndProceed('chat')} variant="outline" fullWidth size="lg" className="font-heading">
                    <MessageSquare className="w-4 h-4 mr-2" /> Chat Freelancer
                </Button>
                {!user && (
                    <p className="text-xs text-center text-gray-500 mt-2">Anda perlu masuk untuk memesan jasa ini.</p>
                )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Ditawarkan Oleh</p>
                <div className="flex items-center cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors group">
                    <div className="relative">
                        <img src={`https://ui-avatars.com/api/?name=${service.freelancerName}&background=random`} alt="Freelancer" className="w-12 h-12 rounded-full mr-3 border-2 border-white shadow-sm group-hover:scale-105 transition-transform" />
                        <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 font-heading">{service.freelancerName}</p>
                        <p className="text-xs text-gray-500">Mahasiswa UNSRI</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-gray-600" />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for icon
const ChevronRight = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);

export default ServiceDetail;