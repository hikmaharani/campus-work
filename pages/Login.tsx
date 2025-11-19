import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../App';
import { Button, Input } from '../components/UI';
import { Role } from '../types';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Retrieve return URL if exists
  const from = location.state?.from || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Harap isi semua kolom', 'error');
      return;
    }

    setIsLoading(true);
    
    // Simulate API network request
    setTimeout(() => {
      setIsLoading(false);
      
      // Check "Database" in localStorage
      const existingUsersStr = localStorage.getItem('campuswork_db_users');
      const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];

      // Find user
      const foundUser = existingUsers.find((u: any) => u.email === email && u.password === password);

      if (foundUser) {
          // Success: Log them in with REAL data
          // Remove password from object before storing in session
          const { password, ...safeUser } = foundUser;
          
          // Ensure default props if missing from old data
          if (!safeUser.balance) safeUser.balance = 0;
          if (!safeUser.role) safeUser.role = Role.NONE;

          login(safeUser);
          showToast('Login Berhasil!', 'success');
          navigate(from, { replace: true });
      } else {
          // Fallback for Demo purposes if DB is empty (Optional, removed per request for "don't use dummy data if registered")
          // Strict Mode: Only allow registered users found in DB, OR specific demo accounts if you want to keep them. 
          // Since user asked "Use real name from registration", we prioritize DB.
          
          showToast('Email atau kata sandi salah. Silakan daftar jika belum punya akun.', 'error');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-in fade-in-50 slide-in-from-bottom-4 border border-gray-100 border-t-4 border-primary">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">CampusWork</h1>
          <p className="text-gray-500">Masuk untuk mulai mencari atau menawarkan jasa.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Email Kampus" 
            type="email" 
            placeholder="nama@student.unsri.ac.id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <div className="space-y-1">
            <Input 
                label="Kata Sandi" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
            />
            <div className="flex justify-end">
                <a href="#" className="text-xs text-primary font-medium hover:underline mt-1">Lupa kata sandi?</a>
            </div>
          </div>
          
          <div className="flex items-center text-sm">
            <input id="remember" type="checkbox" className="mr-2 rounded border-gray-300 text-primary focus:ring-primary" />
            <label htmlFor="remember" className="text-gray-600 cursor-pointer select-none">Ingat saya</label>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading} variant="primary" size="lg">
            {isLoading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <button onClick={() => navigate('/register')} className="text-primary font-bold hover:underline">
            Daftar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;