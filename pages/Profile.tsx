import React, { useState, useRef } from 'react';
import { useApp } from '../App';
import { Button, Input } from '../components/UI';
import { Camera, Mail, User as UserIcon, Shield, Edit2, LogOut, History, CreditCard, ChevronRight } from 'lucide-react';

const Profile = () => {
  const { user, updateUser, showToast, logout } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Feature 19: Mock Activity History
  const activities = [
      { id: 1, action: 'Booking Confirmed', detail: 'Les Privat Kalkulus', date: '2 jam yang lalu' },
      { id: 2, action: 'Withdrawal Requested', detail: 'Rp 150.000 to BCA', date: '1 hari yang lalu' },
      { id: 3, action: 'Profile Updated', detail: 'Changed profile picture', date: '3 hari yang lalu' },
  ];

  // Feature 17: Mock Transactions
  const transactions = [
      { id: 'TRX-001', desc: 'Payment for Design Logo', amount: -50000, date: '25 Oct 2023', status: 'Success' },
      { id: 'TRX-002', desc: 'Withdrawal to BCA', amount: -150000, date: '20 Oct 2023', status: 'Pending' },
      { id: 'TRX-003', desc: 'Payment for Install OS', amount: -75000, date: '15 Oct 2023', status: 'Success' },
  ];

  if (!user) return null;

  const handleSave = () => {
    setIsEditing(false);
    updateUser({ name });
    showToast('Profil berhasil diperbarui!', 'success');
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const objectUrl = URL.createObjectURL(file);
        updateUser({ avatarUrl: objectUrl });
        showToast('Foto profil berhasil diperbarui!', 'success');
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-primary pl-4">Pengaturan Profil</h1>
            <Button variant="outline" className="text-red-600 hover:bg-red-50 border-red-200" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" /> Keluar
            </Button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            {/* Header Background */}
            <div className="h-40 bg-gradient-to-r from-primary to-red-900"></div>
            
            <div className="px-8 pb-8">
                {/* Avatar Section */}
                <div className="flex justify-between items-end -mt-12 mb-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <button 
                            onClick={handlePhotoClick}
                            className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-white backdrop-blur-sm"
                        >
                            <Camera className="w-8 h-8 mb-1" />
                            <span className="text-xs font-medium">Ubah Foto</span>
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>
                    
                    {!isEditing ? (
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                            <Edit2 className="w-4 h-4 mr-2" /> Edit Profil
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="ghost" onClick={() => { setIsEditing(false); setName(user.name); }}>Batal</Button>
                            <Button onClick={handleSave}>Simpan</Button>
                        </div>
                    )}
                </div>

                {/* Form Section */}
                <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                    <UserIcon className="w-5 h-5" />
                                </div>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={!isEditing}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${isEditing ? 'border-primary bg-white ring-4 ring-primary/10' : 'border-gray-200 bg-gray-50 text-gray-600'}`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Kampus</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input 
                                    type="email" 
                                    value={user.email}
                                    disabled
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                     <div className="pt-4 border-t border-gray-100">
                             <label className="block text-sm font-semibold text-gray-700 mb-3">Status Akun</label>
                             <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100 text-primary w-fit">
                                    <Shield className="w-5 h-5" />
                                    <div>
                                        <p className="text-xs uppercase font-bold tracking-wide text-red-900">Role</p>
                                        <p className="font-bold text-sm">{user.role}</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transaction History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-primary" /> Riwayat Transaksi
                </h3>
                <div className="space-y-4">
                    {transactions.map(trx => (
                        <div key={trx.id} className="flex justify-between items-start pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{trx.desc}</p>
                                <p className="text-xs text-gray-500">{trx.date} • {trx.status}</p>
                            </div>
                            <span className={`text-sm font-bold ${trx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {trx.amount < 0 ? '-' : '+'}Rp {Math.abs(trx.amount).toLocaleString()}
                            </span>
                        </div>
                    ))}
                    <button className="w-full text-center text-sm text-primary font-medium hover:underline pt-2">Lihat Semua</button>
                </div>
            </div>

            {/* Activity History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <History className="w-5 h-5 mr-2 text-primary" /> Aktivitas Terbaru
                </h3>
                <div className="space-y-4 relative">
                     {/* Timeline line */}
                     <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                    {activities.map(act => (
                        <div key={act.id} className="flex items-start relative z-10">
                            <div className="w-5 h-5 bg-white border-2 border-gray-200 rounded-full mt-0.5 mr-3 shrink-0"></div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{act.action}</p>
                                <p className="text-xs text-gray-500">{act.detail}</p>
                                <p className="text-[10px] text-gray-400 mt-1">{act.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Profile;