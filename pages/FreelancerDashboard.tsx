import React, { useState, useRef } from 'react';
import { useApp } from '../App';
import { Button, Modal, Input } from '../components/UI';
import { Plus, DollarSign, Star, Briefcase, TrendingUp, AlertCircle, Upload, Check, Edit3, Trash2, X } from 'lucide-react';
import { MOCK_SERVICES } from '../constants';

const FreelancerDashboard = () => {
  const { user, showToast, updateUser, addNotification } = useApp();
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  // Edit Service State
  const [myServices, setMyServices] = useState(MOCK_SERVICES.slice(0, 2)); // In real app, fetch from backend
  const [editServiceData, setEditServiceData] = useState<any>(null);

  // Add Service States
  const [newService, setNewService] = useState({ title: '', category: 'Academic', price: '', description: '', imageUrl: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount);
    if (!user) return;

    if (isNaN(amount) || amount <= 0) {
      showToast('Masukkan jumlah valid', 'error');
      return;
    }
    if (amount > user.balance) {
        showToast('Saldo tidak mencukupi', 'error');
        return;
    }

    setWithdrawLoading(true);
    setTimeout(() => {
        // 1. Update Balance
        const newBalance = user.balance - amount;
        updateUser({ balance: newBalance });
        
        // 2. Save transaction to localStorage (for Profile history)
        const historyItem = {
            id: `TRX-${Math.random().toString(36).substr(2, 6)}`.toUpperCase(),
            action: 'Penarikan Dana',
            detail: `Ke Rekening Utama`,
            amount: -amount,
            date: new Date().toLocaleDateString('id-ID'),
            status: 'Berhasil'
        };
        
        const storedHistory = localStorage.getItem('campuswork_history');
        const history = storedHistory ? JSON.parse(storedHistory) : [];
        history.unshift(historyItem);
        localStorage.setItem('campuswork_history', JSON.stringify(history));

        // 3. Add Notification
        addNotification({
            title: 'Penarikan Berhasil',
            message: `Dana sebesar Rp ${amount.toLocaleString()} telah berhasil ditarik dari saldo Anda.`,
        });

        showToast('Penarikan Dana Berhasil!', 'success');
        setIsWithdrawOpen(false);
        setWithdrawAmount('');
        setWithdrawLoading(false);
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const objectUrl = URL.createObjectURL(file);
          setNewService({ ...newService, imageUrl: objectUrl });
      }
  };

  const handleSaveService = () => {
      if(!newService.title || !newService.price) {
          showToast('Mohon lengkapi data jasa', 'error');
          return;
      }
      
      const serviceObj = {
          id: Math.random().toString(36).substr(2, 9),
          freelancerId: user?.id || '',
          freelancerName: user?.name || '',
          rating: 0,
          reviewCount: 0,
          ...newService,
          price: parseInt(newService.price),
          imageUrl: newService.imageUrl || 'https://picsum.photos/400/300?random=99' // Fallback if no image
      };

      setMyServices([...myServices, serviceObj]);
      showToast('Jasa berhasil ditambahkan!', 'success');
      setIsAddServiceOpen(false);
      setNewService({ title: '', category: 'Academic', price: '', description: '', imageUrl: '' });
  };

  const handleUpdateService = () => {
      if (!editServiceData) return;
      setMyServices(prev => prev.map(s => s.id === editServiceData.id ? editServiceData : s));
      showToast('Jasa berhasil diperbarui!', 'success');
      setEditServiceData(null);
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-lg mr-4 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Freelancer</h1>
            <p className="text-gray-500">Selamat datang kembali, {user?.name}!</p>
        </div>
        <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsWithdrawOpen(true)}>
                <DollarSign className="w-4 h-4 mr-2" /> Tarik Dana
            </Button>
            <Button onClick={() => setIsAddServiceOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Tambah Jasa
            </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Saldo Tersedia" 
          value={`Rp ${user?.balance.toLocaleString()}`} 
          icon={DollarSign} 
          color="bg-green-600 shadow-green-200 shadow-lg" 
        />
        <StatCard 
          title="Rating Rata-rata" 
          value="5.0 / 5.0" 
          icon={Star} 
          color="bg-secondary shadow-yellow-200 shadow-lg" 
        />
        <StatCard 
          title="Proyek Selesai" 
          value="0" 
          icon={Briefcase} 
          color="bg-primary shadow-red-200 shadow-lg" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Pendapatan Mingguan
            </h3>
            <div className="h-72 w-full flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                 <p className="text-gray-400 text-sm">Belum ada data pendapatan minggu ini</p>
            </div>
        </div>

        {/* My Services Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Jasa Saya</h3>
            <div className="space-y-4">
                {myServices.map(service => (
                    <div key={service.id} className="p-3 border border-gray-100 rounded-lg hover:border-primary/30 transition-colors">
                        <div className="flex gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                <img src={service.imageUrl} className="w-full h-full object-cover" alt="Service" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 text-sm truncate">{service.title}</h4>
                                <p className="text-primary font-bold text-xs mt-1">Rp {service.price.toLocaleString()}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <button onClick={() => setEditServiceData(service)} className="text-xs flex items-center text-gray-500 hover:text-primary">
                                        <Edit3 className="w-3 h-3 mr-1" /> Edit
                                    </button>
                                    <button className="text-xs flex items-center text-red-500 hover:text-red-700">
                                        <Trash2 className="w-3 h-3 mr-1" /> Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <Button variant="ghost" fullWidth onClick={() => setIsAddServiceOpen(true)}>+ Tambah Jasa Lain</Button>
            </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      <Modal 
        isOpen={isWithdrawOpen} 
        onClose={() => setIsWithdrawOpen(false)} 
        title="Tarik Dana"
        footer={
            <div className="w-full flex gap-3">
                <Button variant="outline" onClick={() => setIsWithdrawOpen(false)} fullWidth>Batal</Button>
                <Button onClick={handleWithdraw} isLoading={withdrawLoading} fullWidth>Konfirmasi Penarikan</Button>
            </div>
        }
      >
        <div className="space-y-6">
            <div className="bg-red-50 p-5 rounded-xl border border-red-100 text-center">
                <p className="text-sm text-red-600 font-medium mb-1">Saldo Tersedia</p>
                <p className="text-3xl font-bold text-primary">Rp {user?.balance.toLocaleString()}</p>
            </div>
            
            <div className="space-y-4">
                <Input 
                    label="Jumlah Penarikan" 
                    type="number" 
                    placeholder="Contoh: 100000"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rekening Tujuan</label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                        <option>BCA - 1234****89</option>
                        <option>Mandiri - 4321****90</option>
                        <option>GoPay - 0812****</option>
                    </select>
                </div>
            </div>

            <div className="flex items-start p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
                Dana akan diproses dan dikirim ke rekening tujuan dalam waktu maksimal 1x24 jam kerja.
            </div>
        </div>
      </Modal>

       {/* Add Service Modal */}
       <Modal 
        isOpen={isAddServiceOpen} 
        onClose={() => setIsAddServiceOpen(false)} 
        title="Tambah Jasa Baru"
        maxWidth="lg"
        footer={
            <div className="flex justify-end gap-3 w-full">
                <Button variant="ghost" onClick={() => setIsAddServiceOpen(false)}>Batal</Button>
                <Button onClick={handleSaveService}><Check className="w-4 h-4 mr-2" /> Simpan Jasa</Button>
            </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <Input 
                    label="Nama Jasa" 
                    placeholder="Contoh: Les Privat Kalkulus, Desain Logo..." 
                    value={newService.title}
                    onChange={(e) => setNewService({...newService, title: e.target.value})}
                />
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
                    <select 
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                        value={newService.category}
                        onChange={(e) => setNewService({...newService, category: e.target.value})}
                    >
                        <option>Academic</option>
                        <option>Creative</option>
                        <option>Technical</option>
                        <option>Other</option>
                    </select>
                </div>
                <Input 
                    label="Harga Mulai (Rp)" 
                    type="number" 
                    placeholder="50000" 
                    value={newService.price}
                    onChange={(e) => setNewService({...newService, price: e.target.value})}
                />
            </div>
            
            <div className="space-y-4">
                <Input 
                    as="textarea" 
                    label="Deskripsi Lengkap" 
                    placeholder="Jelaskan detail jasa yang kamu tawarkan..." 
                    className="h-32"
                    value={newService.description}
                    onChange={(e) => setNewService({...newService, description: e.target.value})}
                />
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Foto / Portofolio</label>
                    
                    {!newService.imageUrl ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer h-32 flex flex-col items-center justify-center"
                        >
                            <div className="w-10 h-10 bg-red-50 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                                <Upload className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">Klik untuk upload gambar</p>
                            <p className="text-xs text-gray-500">PNG, JPG</p>
                        </div>
                    ) : (
                        <div className="relative h-32 rounded-xl overflow-hidden border border-gray-200 group">
                            <img src={newService.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                                onClick={() => setNewService({...newService, imageUrl: ''})}
                                className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                    />
                </div>
            </div>
        </div>
      </Modal>

      {/* Edit Service Modal */}
      {editServiceData && (
        <Modal
            isOpen={!!editServiceData}
            onClose={() => setEditServiceData(null)}
            title="Edit Jasa"
            footer={
                <div className="flex justify-end gap-3 w-full">
                    <Button variant="ghost" onClick={() => setEditServiceData(null)}>Batal</Button>
                    <Button onClick={handleUpdateService}>Simpan Perubahan</Button>
                </div>
            }
        >
            <div className="space-y-4">
                 <Input 
                    label="Nama Jasa" 
                    value={editServiceData.title}
                    onChange={(e) => setEditServiceData({...editServiceData, title: e.target.value})}
                />
                <Input 
                    label="Harga" 
                    type="number"
                    value={editServiceData.price}
                    onChange={(e) => setEditServiceData({...editServiceData, price: parseInt(e.target.value)})}
                />
            </div>
        </Modal>
      )}
    </div>
  );
};

export default FreelancerDashboard;