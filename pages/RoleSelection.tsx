import React, { useState } from 'react';
import { useApp } from '../App';
import { Role } from '../types';
import { Button } from '../components/UI';
import { Briefcase, Search, Users, CheckCircle2 } from 'lucide-react';

const RoleSelection = () => {
  const { updateUser, showToast } = useApp();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    if (!selectedRole) return;
    setIsLoading(true);
    setTimeout(() => {
      updateUser({ role: selectedRole });
      setIsLoading(false);
      showToast('Peran berhasil ditetapkan! Selamat datang.', 'success');
    }, 1000);
  };

  const RoleCard = ({ role, icon: Icon, title, desc, subtitle }: { role: Role, icon: any, title: string, desc: string, subtitle: string }) => (
    <div 
      onClick={() => setSelectedRole(role)}
      className={`relative cursor-pointer rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 group ${
        selectedRole === role 
            ? 'bg-white border-2 border-primary shadow-xl scale-105 z-10' 
            : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1'
      }`}
    >
      {selectedRole === role && (
          <div className="absolute top-3 right-3 text-primary">
              <CheckCircle2 className="w-6 h-6 fill-blue-50" />
          </div>
      )}
      <div className={`p-4 rounded-full mb-6 transition-colors duration-300 ${selectedRole === role ? 'bg-primary text-white shadow-lg shadow-blue-200' : 'bg-gray-50 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className={`text-xl font-bold mb-1 ${selectedRole === role ? 'text-primary' : 'text-gray-900'}`}>{title}</h3>
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">{subtitle}</p>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-4 md:p-8">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12 space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Pilih Tujuan Anda</h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">Sesuaikan pengalaman CampusGig Anda. Jangan khawatir, Anda bisa mengubahnya nanti.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          <RoleCard 
            role={Role.FREELANCER}
            icon={Briefcase}
            title="Freelancer"
            subtitle="Saya ingin menawarkan jasa"
            desc="Hasilkan uang tambahan dengan menawarkan keahlian Anda kepada teman kampus."
          />
          <RoleCard 
            role={Role.CLIENT}
            icon={Search}
            title="Client"
            subtitle="Saya ingin mencari jasa"
            desc="Temukan bantuan untuk tugas akademik, desain, atau kebutuhan teknis Anda."
          />
          <RoleCard 
            role={Role.BOTH}
            icon={Users}
            title="Keduanya"
            subtitle="Full Experience"
            desc="Fleksibel! Cari bantuan saat butuh, dan tawarkan jasa saat senggang."
          />
        </div>

        <div className="flex flex-col items-center space-y-4">
          <Button 
            onClick={handleContinue} 
            disabled={!selectedRole} 
            isLoading={isLoading}
            size="lg"
            className="w-full md:w-72 h-14 text-lg shadow-xl shadow-blue-100"
          >
            Lanjutkan
          </Button>
          <p className="text-sm text-gray-400">Langkah 2 dari 2</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;