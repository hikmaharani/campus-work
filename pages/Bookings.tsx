import React, { useState } from 'react';
import { MOCK_BOOKINGS } from '../constants';
import { Booking, BookingStatus } from '../types';
import { Button, Modal, Badge, Input, ToastContainer } from '../components/UI';
import { useApp } from '../App';
import { Calendar, Clock, User, AlertTriangle, FileText, Star } from 'lucide-react';

const Bookings = () => {
  const { showToast } = useApp();
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  
  // Modal States
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'UPCOMING') return b.status === BookingStatus.PENDING || b.status === BookingStatus.CONFIRMED;
    if (activeTab === 'COMPLETED') return b.status === BookingStatus.COMPLETED;
    if (activeTab === 'CANCELLED') return b.status === BookingStatus.CANCELLED;
    return false;
  });

  const openCancelModal = (id: string) => {
    setSelectedBookingId(id);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedBookingId) return;
    
    // Update Status locally
    setBookings(prev => prev.map(b => 
        b.id === selectedBookingId ? { ...b, status: BookingStatus.CANCELLED } : b
    ));
    
    showToast('Pemesanan berhasil dibatalkan.', 'success');
    setCancelModalOpen(false);
    setSelectedBookingId(null);
  };

  const openDetailsModal = (booking: Booking) => {
      setSelectedBooking(booking);
      setDetailsModalOpen(true);
  };

  const openReviewModal = (booking: Booking) => {
      setSelectedBooking(booking);
      setReviewData({ rating: 0, comment: '' });
      setReviewModalOpen(true);
  };

  const handleSubmitReview = () => {
      if (reviewData.rating === 0) {
          showToast('Silakan pilih bintang (1-5).', 'error');
          return;
      }
      showToast('Ulasan berhasil dikirim! Terima kasih.', 'success');
      setReviewModalOpen(false);
      // In a real app, we would mark this booking as "Reviewed" or update the backend
  };

  const StatusBadge = ({ status }: { status: BookingStatus }) => {
    switch(status) {
        case BookingStatus.PENDING: return <Badge color="yellow">Menunggu Konfirmasi</Badge>;
        case BookingStatus.CONFIRMED: return <Badge color="blue">Dikonfirmasi</Badge>;
        case BookingStatus.COMPLETED: return <Badge color="green">Selesai</Badge>;
        case BookingStatus.CANCELLED: return <Badge color="red">Dibatalkan</Badge>;
        default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-primary pl-4">Pesanan Saya</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
        <button 
            onClick={() => setActiveTab('UPCOMING')}
            className={`pb-3 px-6 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'UPCOMING' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
            Berjalan & Pending
        </button>
        <button 
            onClick={() => setActiveTab('COMPLETED')}
            className={`pb-3 px-6 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'COMPLETED' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
            Selesai
        </button>
        <button 
            onClick={() => setActiveTab('CANCELLED')}
            className={`pb-3 px-6 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'CANCELLED' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
            Dibatalkan
        </button>
      </div>

      {/* List */}
      <div className="space-y-4 min-h-[300px]">
        {filteredBookings.length > 0 ? (
            filteredBookings.map(booking => (
                <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:shadow-md transition-shadow animate-in fade-in duration-300">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <StatusBadge status={booking.status} />
                            <span className="text-xs text-gray-500 flex items-center font-medium"><Calendar className="w-3 h-3 mr-1"/> {booking.date}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{booking.serviceTitle}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                            <User className="w-4 h-4 mr-1" />
                            <span className="mr-4">{booking.freelancerName}</span>
                            <span className="font-bold text-primary">Rp {booking.price.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 w-full md:w-auto border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                        <Button variant="outline" size="sm" onClick={() => openDetailsModal(booking)}>
                            Lihat Detail
                        </Button>
                        
                        {booking.status === BookingStatus.PENDING && (
                            <Button variant="danger" size="sm" onClick={() => openCancelModal(booking.id)}>
                                Batalkan
                            </Button>
                        )}
                        
                        {booking.status === BookingStatus.COMPLETED && (
                            <Button variant="secondary" size="sm" onClick={() => openReviewModal(booking)}>
                                <Star className="w-3 h-3 mr-1" /> Beri Ulasan
                            </Button>
                        )}
                    </div>
                </div>
            ))
        ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-medium">Belum ada pesanan di sini.</p>
            </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Batalkan Pesanan?"
        maxWidth="sm"
        footer={
            <>
                <Button variant="ghost" onClick={() => setCancelModalOpen(false)}>Tidak, Kembali</Button>
                <Button variant="danger" onClick={handleConfirmCancel}>Ya, Batalkan</Button>
            </>
        }
      >
        <div className="flex items-start space-x-4">
            <div className="bg-red-100 p-2 rounded-full shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
                <p className="text-gray-600 text-sm leading-relaxed">
                    Apakah Anda yakin ingin membatalkan pemesanan ini? Tindakan ini tidak dapat dikembalikan dan freelancer akan diberitahu.
                </p>
            </div>
        </div>
      </Modal>

      {/* Detail Modal Mock */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title="Detail Pesanan"
        footer={<Button onClick={() => setDetailsModalOpen(false)}>Tutup</Button>}
      >
        {selectedBooking && (
            <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">ID Pemesanan</p>
                    <p className="font-mono text-gray-900">{selectedBooking.id.toUpperCase()}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Layanan</p>
                        <p className="font-medium text-gray-900">{selectedBooking.serviceTitle}</p>
                     </div>
                     <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Freelancer</p>
                        <p className="font-medium text-gray-900">{selectedBooking.freelancerName}</p>
                     </div>
                     <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Tanggal</p>
                        <p className="font-medium text-gray-900">{selectedBooking.date}</p>
                     </div>
                     <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Biaya</p>
                        <p className="font-bold text-primary">Rp {selectedBooking.price.toLocaleString()}</p>
                     </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg mt-4">
                    <p className="text-xs text-gray-500 text-center">Invoice digital tersedia setelah pesanan selesai.</p>
                </div>
            </div>
        )}
      </Modal>

       {/* Review Modal */}
       <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Beri Ulasan"
        footer={
            <>
                <Button variant="ghost" onClick={() => setReviewModalOpen(false)}>Batal</Button>
                <Button onClick={handleSubmitReview}>Kirim Ulasan</Button>
            </>
        }
      >
        {selectedBooking && (
             <div className="space-y-6 text-center">
                <div>
                    <h4 className="font-bold text-gray-900">{selectedBooking.serviceTitle}</h4>
                    <p className="text-sm text-gray-500">Bagaimana pengalaman Anda dengan jasa ini?</p>
                </div>
                
                <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                            key={star}
                            onClick={() => setReviewData({ ...reviewData, rating: star })}
                            className="focus:outline-none transform hover:scale-110 transition-transform"
                        >
                            <Star 
                                className={`w-8 h-8 ${star <= reviewData.rating ? 'fill-secondary text-secondary' : 'text-gray-300'}`} 
                            />
                        </button>
                    ))}
                </div>

                <Input 
                    as="textarea"
                    label="Ulasan Anda"
                    placeholder="Ceritakan pengalaman Anda (Opsional)..."
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    className="text-left h-24"
                />
            </div>
        )}
      </Modal>
    </div>
  );
};

export default Bookings;