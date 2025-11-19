import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { Button, Input } from '../components/UI';
import { Role } from '../types';

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email: string) => {
      // Strict regex for @student.unsri.ac.id
      const regex = /^[a-zA-Z0-9._%+-]+@student\.unsri\.ac\.id$/;
      return regex.test(email);
  };

  const validatePassword = (password: string) => {
      // Minimal 1 special char, 1 uppercase, 1 lowercase
      // (?=.*[a-z]) -> Lowercase
      // (?=.*[A-Z]) -> Uppercase
      // (?=.*[!@#$%^&*]) -> Special character
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/;
      return regex.test(password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password) {
      showToast('Semua kolom wajib diisi', 'error');
      return;
    }

    if (!validateEmail(email)) {
        showToast('Email wajib menggunakan domain @student.unsri.ac.id', 'error');
        return;
    }

    if (!validatePassword(password)) {
        showToast('Kata sandi harus mengandung huruf besar, huruf kecil, dan karakter spesial (!@#$%^&*)', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
      showToast('Kata sandi tidak cocok', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Retrieve existing users or init empty array
      const existingUsersStr = localStorage.getItem('campuswork_db_users');
      const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];

      // Check if email exists
      if (existingUsers.some((u: any) => u.email === email)) {
          setIsLoading(false);
          showToast('Email ini sudah terdaftar.', 'error');
          return;
      }

      // Create new user object
      const newUser = {
          id: Math.random().toString(36).substring(7),
          name: name,
          email: email,
          password: password, // In real app, hash this!
          role: Role.NONE,
          avatarUrl: `https://ui-avatars.com/api/?name=${name}&background=random`,
          balance: 0
      };

      // Save to "Database"
      existingUsers.push(newUser);
      localStorage.setItem('campuswork_db_users', JSON.stringify(existingUsers));
      
      setIsLoading(false);
      showToast('Pendaftaran Berhasil! Silakan Masuk.', 'success');
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-in fade-in-50 slide-in-from-bottom-4 border-t-4 border-primary">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Daftar Akun</h1>
          <p className="text-gray-500">Bergabung dengan marketplace mahasiswa UNSRI.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Nama Lengkap" 
            name="name"
            placeholder="Contoh: Budi Santoso"
            value={formData.name}
            onChange={handleChange}
          />
          <div className="space-y-1">
            <Input 
                label="Email Kampus" 
                type="email" 
                name="email"
                placeholder="nama@student.unsri.ac.id"
                value={formData.email}
                onChange={handleChange}
            />
            <p className="text-xs text-gray-400">Wajib menggunakan domain @student.unsri.ac.id</p>
          </div>
          
          <div className="space-y-1">
            <Input 
                label="Kata Sandi" 
                type="password" 
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
            />
            <p className="text-xs text-gray-400">Min. 1 Uppercase, 1 Lowercase, 1 Simbol</p>
          </div>

          <Input 
            label="Konfirmasi Kata Sandi" 
            type="password" 
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          
          <Button type="submit" fullWidth isLoading={isLoading} className="mt-4">
            Daftar Sekarang
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <button onClick={() => navigate('/login')} className="text-primary font-bold hover:underline">
            Masuk
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;