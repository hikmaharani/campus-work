import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, MessageSquare, User, Briefcase, Bell, LogOut, Menu, X } from 'lucide-react';
import { useApp } from '../App';
import { Role } from '../types';
import { Button } from './UI';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, notifications, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // --- GUEST LAYOUT (Top Navbar style like Sribu) ---
  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex flex-col font-sans">
        {/* Navbar */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm/50 backdrop-blur-xl bg-white/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => navigate('/')}>
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-heading font-bold text-2xl shadow-lg shadow-red-100 mr-3 transition-transform group-hover:scale-105">C</div>
                <span className="text-2xl font-heading font-extrabold text-primary tracking-tight">CampusWork</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-primary font-medium transition-colors text-sm font-heading">Cari Jasa</button>
                <button onClick={() => navigate('/how-it-works')} className="text-gray-600 hover:text-primary font-medium transition-colors text-sm font-heading">Cara Kerja</button>
                <div className="h-6 w-px bg-gray-200"></div>
                <button 
                  onClick={() => navigate('/login')} 
                  className="text-gray-900 hover:text-primary font-bold transition-colors text-sm font-heading"
                >
                  Masuk
                </button>
                <Button onClick={() => navigate('/register')} className="px-6 shadow-red-200 shadow-lg hover:shadow-xl transition-all font-heading">
                  Daftar
                </Button>
              </div>

               {/* Mobile Menu Button */}
               <div className="md:hidden flex items-center">
                  <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-500 hover:text-gray-900 p-2">
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
               </div>
            </div>
          </div>
          
          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
             <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-4 animate-in slide-in-from-top-5 shadow-lg">
                <button onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }} className="block w-full text-left text-gray-700 font-medium py-2">Cari Jasa</button>
                <button onClick={() => { navigate('/how-it-works'); setIsMobileMenuOpen(false); }} className="block w-full text-left text-gray-700 font-medium py-2">Cara Kerja</button>
                <div className="border-t border-gray-100 my-2"></div>
                <button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} className="block w-full text-left text-gray-900 font-bold py-2">Masuk</button>
                <Button fullWidth onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}>Daftar Sekarang</Button>
             </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </div>
        </main>

        {/* Footer Simple */}
        <footer className="bg-white border-t border-gray-100 mt-auto py-12">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <div className="flex justify-center items-center gap-8 mb-6 text-sm text-gray-500 font-heading">
                    <button onClick={() => navigate('/how-it-works')} className="hover:text-primary">Tentang Kami</button>
                    <button onClick={() => navigate('/how-it-works')} className="hover:text-primary">Cara Kerja</button>
                    <button className="hover:text-primary">Syarat & Ketentuan</button>
                </div>
                <p className="text-gray-400 text-sm">&copy; 2023 CampusWork. Marketplace Jasa Mahasiswa Terpercaya.</p>
            </div>
        </footer>
      </div>
    );
  }

  // --- AUTHENTICATED LAYOUT (Sidebar style) ---
  const isFreelancer = user.role === Role.FREELANCER || user.role === Role.BOTH;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Calendar, label: 'Bookings', path: '/bookings' },
    ...(isFreelancer ? [{ icon: Briefcase, label: 'Services', path: '/dashboard' }] : []), 
    { icon: MessageSquare, label: 'Inbox', path: '/chat' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-200 h-screen sticky top-0 z-30 shadow-sm">
        <div className="p-6 flex items-center justify-between border-b border-gray-100 h-20">
          <h1 className="text-2xl font-heading font-extrabold text-primary tracking-tight flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">C</div>
            CampusWork
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-red-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                {item.label}
              </button>
            );
          })}
          
          {/* Notification Link in Sidebar */}
           <button
            onClick={() => navigate('/notifications')}
            className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium ${
              location.pathname === '/notifications'
                ? 'bg-primary text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="relative mr-3">
                <Bell className={`w-5 h-5 transition-colors ${location.pathname === '/notifications' ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-secondary rounded-full ring-2 ring-white"></span>
                )}
            </div>
            Notifikasi
          </button>
        </nav>

        <div className="p-4 space-y-2 border-t border-gray-100">
             {user && (
                <div className="flex items-center p-3 rounded-lg bg-gray-50 mb-2 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => navigate('/profile')}>
                    <img src={user.avatarUrl} alt="User" className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate font-heading">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize truncate">{user.role.toLowerCase()}</p>
                    </div>
                </div>
            )}
            <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
                <LogOut className="w-5 h-5 mr-3" />
                Keluar
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-auto pb-20 md:pb-0 bg-surface">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-20 shadow-sm h-16">
            <h1 className="text-xl font-heading font-extrabold flex items-center gap-2 text-primary">
                 <div className="w-8 h-8 bg-primary text-white rounded flex items-center justify-center font-bold text-lg">C</div>
                 CampusWork
            </h1>
            <button onClick={() => navigate('/notifications')} className="relative p-2">
                <Bell className="w-6 h-6 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-secondary rounded-full ring-2 ring-white"></span>
                )}
            </button>
        </div>

        <div className="max-w-6xl mx-auto w-full p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-pb shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center w-full py-3 transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium font-heading">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};