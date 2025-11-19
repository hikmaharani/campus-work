import { useState, useEffect } from 'react';
import { MOCK_BOOKINGS } from '../constants';
import { Booking, BookingStatus, Role } from '../types';
import { Button, Modal, Badge, Input } from '../components/UI';
import { useApp } from '../App';
import { Calendar, Clock, User, AlertTriangle, FileText, Star, RefreshCw, Check, X as XIcon } from 'lucide-react';

const Bookings = () => {
  const { showToast, user, activeRole, updateUser } = useApp();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  
  // Modal States
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });

  // Load bookings on mount
  useEffect(() => {
      const storedBookingsStr = localStorage.getItem('campuswork_db_bookings');
      if (storedBookingsStr) {
          setBookings(JSON.parse(storedBookingsStr));
      } else {
          // Fallback to MOCK data if empty
          setBookings(MOCK_BOOKINGS);
          localStorage.setItem('campuswork_db_bookings', JSON.stringify(MOCK_BOOKINGS));
      }
  }, []);

  // Filter logic based on Active Role (Client sees own orders, Freelancer sees incoming jobs)
  const filteredBookings = bookings.filter(b => {
    // First, check ownership based on role
    if (!user) return false;
    
    let isOwner = false;
    if (activeRole === Role.FREELANCER) {
        isOwner = b.freelancerId === user.id;
    } else {
        // Default to Client view
        isOwner = b.clientId === user.id;
    }

    if (!isOwner) return false;

    // Then check Tab status
    if (activeTab === 'UPCOMING') return b.status === BookingStatus.PENDING || b.status === BookingStatus.CONFIRMED;
    if (activeTab === 'COMPLETED') return b.status === BookingStatus.COMPLETED;
    if (activeTab === 'CANCELLED') return b.status === BookingStatus.CANCELLED;
    return false;
  });

  const updateBookingStatus = (id: string, newStatus: BookingStatus) => {
      const updatedBookings = bookings.map(b => 
          b.id === id ? { ...b, status: newStatus } : b
      );
      setBookings(updatedBookings);
      localStorage.setItem('campuswork_db_bookings', JSON.stringify(updatedBookings));
      return updatedBookings;
  };

  const openCancelModal = (id: string) => {
    setSelectedBookingId(id);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedBookingId) return;
    
    updateBookingStatus(selectedBookingId, BookingStatus.CANCELLED);
    
    showToast('Pemesanan berhasil dibatalkan.', 'success');
    setCancelModalOpen(false);
    setSelectedBookingId(null);
  };

  const handleRefund = (booking: Booking) => {
    if (!user) return;
    
    // Calculate Refund
    updateBookingStatus(booking.id, BookingStatus.CANCELLED);
    
    // Return money to user balance
    const newBalance = user.balance + booking.price;
    updateUser({ balance: newBalance });

    showToast(`Refund berhasil! Rp ${booking.price.toLocaleString()} dikembalikan ke saldo Anda.`, 'success');
  };

  const handleFreelancerAction = (id: string, action: 'confirm' | 'reject' | 'complete') => {
      if (action === 'confirm') {
          updateBookingStatus(id, BookingStatus.CONFIRMED);
          showToast('Pesanan dikonfirmasi! Silakan mulai kerjakan.', 'success');
      } else if (action === 'reject') {
          updateBookingStatus(id, BookingStatus.CANCELLED);
          showToast('Pesanan ditolak.', 'info');
      } else if (action === 'complete') {
          updateBookingStatus(id, BookingStatus.COMPLETED);
          showToast('Pesanan ditandai selesai.', 'success');
      }
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
  };

  const StatusBadge = ({ status }: { status: BookingStatus }) => {
    switch(status) {
        case BookingStatus.PENDING: return <Badge color="yellow">Menunggu Konfirmasi</Badge>;
        case BookingStatus.CONFIRMED: return <Badge color="blue">Sedang Dikerjakan</Badge>;
        case BookingStatus.COMPLETED: return <Badge color="green">Selesai</Badge>;
        case BookingStatus.CANCELLED: return <Badge color="red">Dibatalkan</Badge>;
        default: return null;
    }
  };

  const isOverdue = (deadline: string) => {
      return new Date() > new Date(deadline);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-primary pl-4">
            {activeRole === Role.FREELANCER ? 'Pesanan Masuk' : 'Pesanan Saya'}
        </h1>
        {activeRole === Role.FREELANCER && (
            <Badge color="blue">Mode Freelancer</Badge>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
        <button 
            onClick={() => setActiveTab('UPCOMING')}
            className={`pb-3 px-6 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'UPCOMING' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
            {activeRole === Role.FREELANCER ? 'Perlu Dikerjakan' : 'Berjalan & Pending'}
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
                <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 hover:shadow-md transition-shadow animate-in fade-in duration-300">
                    <div className="flex-1 w-full">
                        <div className="flex items-center justify-between lg:justify-start gap-3 mb-2">
                            <StatusBadge status={booking.status} />
                            <span className="text-xs text-gray-500 flex items-center font-medium bg-gray-50 px-2 py-1 rounded">
                                <Calendar className="w-3 h-3 mr-1"/> Dipesan: {booking.date}
                            </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{booking.serviceTitle}</h3>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600 mt-2">
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-1.5 text-gray-400" />
                                {activeRole === Role.FREELANCER ? (
                                    <span>Klien: <b>{booking.clientName || 'Mahasiswa'}</b></span>
                                ) : (
                                    <span>Freelancer: <b>{booking.freelancerName}</b></span>
                                )}
                            </div>
                            <div className="flex items-center">
                                <Clock className={`w-4 h-4 mr-1.5 ${isOverdue(booking.deadline) && booking.status !== BookingStatus.COMPLETED ? 'text-red-500' : 'text-gray-400'}`} />
                                <span className={`${isOverdue(booking.deadline) && booking.status !== BookingStatus.COMPLETED ? 'text-red-600 font-bold' : ''}`}>
                                    Deadline: {booking.deadline} {isOverdue(booking.deadline) && booking.status !== BookingStatus.COMPLETED ? '(Terlambat)' : ''}
                                </span>
                            </div>
                            <div className="font-bold text-primary bg-red-50 px-3 py-0.5 rounded-full w-fit">
                                Rp {booking.price.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 w-full lg:w-auto border-t lg:border-t-0 border-gray-100 pt-4 lg:pt-0 justify-end">
                        <Button variant="outline" size="sm" onClick={() => openDetailsModal(booking)}>
                            Detail
                        </Button>
                        
                        {/* CLIENT ACTIONS */}
                        {activeRole !== Role.FREELANCER && (
                            <>
                                {booking.status === BookingStatus.PENDING && (
                                    <Button variant="danger" size="sm" onClick={() => openCancelModal(booking.id)}>
                                        Batalkan
                                    </Button>
                                )}
                                {/* Refund Button Logic: Show if overdue and not completed/cancelled */}
                                {isOverdue(booking.deadline) && 
                                 (booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED) && (
                                    <Button variant="danger" size="sm" onClick={() => handleRefund(booking)}>
                                        <RefreshCw className="w-3 h-3 mr-2" /> Ajukan Refund
                                    </Button>
                                )}
                                {booking.status === BookingStatus.COMPLETED && (
                                    <Button variant="secondary" size="sm" onClick={() => openReviewModal(booking)}>
                                        <Star className="w-3 h-3 mr-1" /> Beri Ulasan
                                    </Button>
                                )}
                            </>
                        )}

                        {/* FREELANCER ACTIONS */}
                        {activeRole === Role.FREELANCER && (
                            <>
                                {booking.status === BookingStatus.PENDING && (
                                    <>
                                        <Button variant="outline" size="sm" onClick={() => handleFreelancerAction(booking.id, 'reject')} className="text-red-600 border-red-200 hover:bg-red-50">
                                            <XIcon className="w-4 h-4 mr-1" /> Tolak
                                        </Button>
                                        <Button size="sm" onClick={() => handleFreelancerAction(booking.id, 'confirm')}>
                                            <Check className="w-4 h-4 mr-1" /> Terima
                                        </Button>
                                    </>
                                )}
                                {booking.status === BookingStatus.CONFIRMED && (
                                    <Button variant="secondary" size="sm" onClick={() => handleFreelancerAction(booking.id, 'complete')}>
                                        <Check className="w-4 h-4 mr-1" /> Tandai Selesai
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            ))
        ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-medium">Belum ada pesanan di daftar ini.</p>
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
                    Apakah Anda yakin ingin membatalkan pemesanan ini? Tindakan ini tidak dapat dikembalikan.
                </p>
            </div>
        </div>
      </Modal>

      {/* Detail Modal */}
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
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status</p>
                        <p className="font-medium text-gray-900">{selectedBooking.status}</p>
                     </div>
                     <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Dipesan Tanggal</p>
                        <p className="font-medium text-gray-900">{selectedBooking.date}</p>
                     </div>
                     <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Deadline</p>
                        <p className={`font-bold ${isOverdue(selectedBooking.deadline) && selectedBooking.status !== BookingStatus.COMPLETED ? 'text-red-600' : 'text-gray-900'}`}>
                            {selectedBooking.deadline}
                        </p>
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