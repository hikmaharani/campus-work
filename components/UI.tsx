import React from 'react';
import { Loader2, X, CheckCircle, AlertCircle, Star, ChevronRight, Info } from 'lucide-react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', isLoading, fullWidth, className = '', disabled, ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-light focus:ring-primary shadow-sm hover:shadow-md",
    secondary: "bg-secondary text-gray-900 hover:bg-amber-500 focus:ring-amber-400",
    outline: "border-2 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-primary hover:text-primary focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`} 
      disabled={disabled || isLoading} 
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  as?: 'input' | 'textarea';
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', as = 'input', ...props }) => {
  const inputClasses = `w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 bg-white'} ${className}`;
  
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>}
      {as === 'textarea' ? (
        <textarea className={inputClasses} {...(props as any)} />
      ) : (
        <input className={inputClasses} {...(props as any)} />
      )}
      {error && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{error}</p>}
    </div>
  );
};

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, maxWidth = 'md' }) => {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidthClasses[maxWidth]} flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200`}>
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
        {footer && (
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-2xl border-t border-gray-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Toast System ---
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export const ToastContainer: React.FC<{ toasts: ToastMessage[], removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className={`pointer-events-auto flex items-center p-4 rounded-xl shadow-xl text-white min-w-[320px] animate-in slide-in-from-right duration-300 ${
          toast.type === 'success' ? 'bg-green-700' : 
          toast.type === 'error' ? 'bg-red-700' : 'bg-blue-700'
        }`}>
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 mr-3 flex-shrink-0" />}
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className="ml-3 text-white/80 hover:text-white p-1 hover:bg-white/10 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

// --- Service Card ---
interface ServiceCardProps {
  title: string;
  price: number;
  rating: number;
  author: string;
  image: string;
  category?: string;
  onClick: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ title, price, rating, author, image, category, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center text-xs font-bold shadow-sm text-gray-800">
          <Star className="w-3.5 h-3.5 text-yellow-400 mr-1 fill-current" />
          {rating.toFixed(1)}
        </div>
        {category && (
          <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-medium shadow-sm">
            {category}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
           <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden">
              <img src={`https://ui-avatars.com/api/?name=${author}&background=random`} alt={author} />
           </div>
           <div className="text-xs text-gray-500 font-medium truncate">{author}</div>
        </div>
        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 leading-snug h-11 group-hover:text-primary transition-colors">{title}</h3>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Mulai dari</p>
            <p className="text-primary font-bold text-lg">Rp {price.toLocaleString()}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode, color: 'blue' | 'green' | 'yellow' | 'red' | 'gray', size?: 'sm' | 'md' }> = ({ children, color, size = 'md' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-700 border border-blue-200',
    green: 'bg-green-100 text-green-700 border border-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    red: 'bg-red-100 text-red-700 border border-red-200',
    gray: 'bg-gray-100 text-gray-700 border border-gray-200',
  };
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs'
  };
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colors[color]} ${sizes[size]}`}>
      {children}
    </span>
  );
};