import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Sparkles, CheckCircle, Shield, Users, Zap } from 'lucide-react';
import { ServiceCard } from '../components/UI';
import { MOCK_SERVICES, CATEGORIES } from '../constants';
import { Service } from '../types';
import { useApp } from '../App';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Simulate data fetching
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setServices(MOCK_SERVICES);
      setIsLoading(false);
    }, 800); 
    return () => clearTimeout(timer);
  }, []);

  // Simulate searching effect
  useEffect(() => {
    if (isSearching) {
        const timer = setTimeout(() => setIsSearching(false), 500);
        return () => clearTimeout(timer);
    }
  }, [isSearching]);

  const handleSearch = () => {
    setIsSearching(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || service.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Conditional Hero Section - Shows differently if logged out (Landing Page Style) */}
      {!user ? (
         <div className="bg-primary -mx-4 md:-mx-8 -mt-8 md:-mt-8 text-white shadow-lg mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary opacity-10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"></div>

            <div className="max-w-5xl mx-auto text-center py-20 md:py-28 px-6 relative z-10">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-50 text-sm font-medium mb-6 backdrop-blur-sm font-heading">
                    <Zap className="w-4 h-4 mr-2 text-secondary" fill="currentColor"/>
                    Platform Freelance Khusus Mahasiswa #1
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight font-heading">
                    Jasa Mahasiswa Berkualitas<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-200">Harga Mahasiswa</span>
                </h1>
                <p className="text-blue-50 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                    Temukan bantuan untuk tugas akademik, desain, teknis, dan kreatif dari ribuan mahasiswa berbakat di kampusmu.
                </p>
                
                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto transform hover:-translate-y-1 transition-transform duration-300">
                    <div className="bg-white rounded-full p-2 flex shadow-2xl ring-4 ring-white/20">
                        <div className="flex-1 relative">
                             <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Cari jasa 'Desain Logo', 'Translate', atau 'Les Privat'..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none text-base md:text-lg bg-transparent"
                            />
                        </div>
                        <button 
                            onClick={handleSearch}
                            className="bg-primary hover:bg-primary-light text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-bold font-heading transition-all shadow-lg hover:shadow-xl active:scale-95"
                        >
                            Cari
                        </button>
                    </div>
                </div>

                {/* Trust Stats */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 border-t border-white/10 pt-8">
                    <div className="text-center">
                        <p className="text-3xl font-bold font-heading text-white">5,000+</p>
                        <p className="text-blue-200 text-sm">Freelancer Aktif</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold font-heading text-white">98%</p>
                        <p className="text-blue-200 text-sm">Tingkat Kepuasan</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold font-heading text-white">24h</p>
                        <p className="text-blue-200 text-sm">Rata-rata Selesai</p>
                    </div>
                </div>
            </div>
         </div>
      ) : (
        // Logged In Hero (Simpler)
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2 font-heading">Hai, {user.name}! 👋</h1>
                <p className="text-gray-500">Apa yang ingin kamu kerjakan hari ini?</p>
            </div>
            <div className="relative w-full md:w-96">
                <input
                    type="text"
                    placeholder="Cari layanan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50 focus:bg-white transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
        </div>
      )}

      <div className={!user ? "max-w-7xl mx-auto" : ""}>
        {/* Feature Section for Guests */}
        {!user && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold font-heading text-gray-900 mb-2">Terverifikasi KTM</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Semua freelancer adalah mahasiswa aktif yang telah diverifikasi identitas kampusnya.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold font-heading text-gray-900 mb-2">Transaksi Aman</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Dana ditahan oleh sistem dan hanya diteruskan ke freelancer setelah pekerjaan selesai.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600 mb-4">
                        <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold font-heading text-gray-900 mb-2">Komunitas Kampus</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Dukung teman sesama mahasiswa dan bangun relasi profesional sejak kuliah.</p>
                </div>
             </div>
        )}

        {/* Categories Filter */}
        <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar px-1 mb-4">
            <div className="flex items-center text-gray-500 font-medium mr-2 shrink-0">
                <Filter className="w-4 h-4 mr-2" /> Filter:
            </div>
            {CATEGORIES.map((cat) => (
            <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                }`}
            >
                {cat}
            </button>
            ))}
        </div>

        {/* Service Listing */}
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-heading text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-secondary fill-current" />
                    {activeCategory === 'All' ? 'Rekomendasi Unggulan' : `Jasa ${activeCategory}`}
                </h2>
            </div>

            {isLoading || isSearching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-xl p-4 h-80 border border-gray-100 shadow-sm animate-pulse flex flex-col">
                    <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 w-1/2 rounded mb-auto"></div>
                </div>
                ))}
            </div>
            ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
                {filteredServices.map((service) => (
                <ServiceCard
                    key={service.id}
                    title={service.title}
                    price={service.price}
                    rating={service.rating}
                    author={service.freelancerName}
                    image={service.imageUrl}
                    category={service.category}
                    onClick={() => navigate(`/service/${service.id}`)}
                />
                ))}
            </div>
            ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada hasil ditemukan</h3>
                <p className="text-gray-500 text-center max-w-md">
                Kami tidak dapat menemukan jasa yang cocok dengan "{searchQuery}".
                </p>
                <button 
                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                    className="mt-6 text-primary font-bold hover:underline"
                >
                    Reset Pencarian
                </button>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;