import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/UI';
import { Search, MessageSquare, CheckCircle, CreditCard, UserPlus, ShieldCheck, Smile } from 'lucide-react';
import { useApp } from '../App';

const HowItWorks = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  const StepCard = ({ number, icon: Icon, title, desc }: any) => (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-gray-100">
      <div className="w-16 h-16 rounded-2xl bg-red-50 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <div className="mb-2">
        <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold mb-2">Langkah {number}</span>
        <h3 className="text-xl font-heading font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );

  return (
    <div className="pb-16">
      {/* Hero Header */}
      <div className="text-center py-16 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 mb-6 leading-tight">
          Cara Mudah Menyelesaikan <br/>
          <span className="text-primary">Tugas & Proyek</span> Kamu
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          CampusGig menghubungkan kamu dengan mahasiswa bertalenta untuk membantu segala kebutuhan akademik dan kreatifmu.
        </p>
        {!user && (
             <Button size="lg" onClick={() => navigate('/register')} className="px-8 py-4 text-base shadow-xl shadow-red-100">
                Mulai Sekarang - Gratis
             </Button>
        )}
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 relative">
        {/* Connecting line for desktop */}
        <div className="hidden lg:block absolute top-14 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>
        
        <StepCard 
            number="1" 
            icon={Search} 
            title="Cari Jasa" 
            desc="Jelajahi ribuan jasa dari mahasiswa terverifikasi. Gunakan fitur pencarian untuk menemukan yang spesifik."
        />
        <StepCard 
            number="2" 
            icon={MessageSquare} 
            title="Diskusi & Deal" 
            desc="Chat dengan freelancer, diskusikan detail pekerjaan, nego harga, dan sepakati tenggat waktu."
        />
        <StepCard 
            number="3" 
            icon={CreditCard} 
            title="Pembayaran Aman" 
            desc="Lakukan pembayaran ke sistem CampusGig. Dana aman tersimpan sampai pekerjaan selesai."
        />
        <StepCard 
            number="4" 
            icon={CheckCircle} 
            title="Terima Hasil" 
            desc="Review hasil pekerjaan. Jika puas, setujui pesanan dan dana akan diteruskan ke freelancer."
        />
      </div>

      {/* Trust Section */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Kenapa Memilih CampusGig?</h2>
            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg">Verifikasi Mahasiswa (KTM)</h4>
                        <p className="text-gray-600">Semua freelancer adalah mahasiswa aktif yang telah diverifikasi identitasnya. Aman dan terpercaya.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-secondary">
                        <Smile className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg">Harga Bersahabat</h4>
                        <p className="text-gray-600">Standar harga yang disesuaikan dengan kantong mahasiswa. Hemat tapi berkualitas.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex-1 bg-gray-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">Ingin Menawarkan Jasa?</h3>
            <p className="text-gray-600 mb-6">Hasilkan uang tambahan dengan skill yang kamu miliki.</p>
            <div className="bg-white p-4 rounded-xl shadow-sm inline-flex items-center gap-3 mb-6">
                <UserPlus className="w-5 h-5 text-primary" />
                <span className="font-bold text-gray-900">Daftar sebagai Freelancer</span>
            </div>
            <br/>
            <Button onClick={() => navigate('/register')} variant="outline">Gabung Jadi Freelancer</Button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;