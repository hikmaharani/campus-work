import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Role, User, Notification } from './types';
import { ToastContainer, ToastMessage } from './components/UI';
import { Layout } from './components/Layout';
import { MOCK_NOTIFICATIONS } from './constants';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import RoleSelection from './pages/RoleSelection';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import ServiceDetail from './pages/ServiceDetail';
import Bookings from './pages/Bookings';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import HowItWorks from './pages/HowItWorks';

// --- Context ---
interface AppContextType {
  user: User | null;
  activeRole: Role; // The role currently being viewed (for BOTH users)
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  switchRole: () => void; // Function to toggle role
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id' | 'date' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<Role>(Role.NONE);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  // Check localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('campusgig_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Set initial active role based on user role
      if (parsedUser.role === Role.BOTH) {
          setActiveRole(Role.CLIENT); // Default to Client view
      } else {
          setActiveRole(parsedUser.role);
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    // Set active role immediately upon login
    if (userData.role === Role.BOTH) {
        setActiveRole(Role.CLIENT);
    } else {
        setActiveRole(userData.role);
    }
    localStorage.setItem('campusgig_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setActiveRole(Role.NONE);
    localStorage.removeItem('campusgig_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    
    // If role changed to BOTH, set active to Client if it was NONE
    if (updates.role && updates.role === Role.BOTH) {
        setActiveRole(Role.CLIENT);
    } else if (updates.role) {
        setActiveRole(updates.role);
    }

    localStorage.setItem('campusgig_user', JSON.stringify(updated));
  };

  const switchRole = () => {
      if (user?.role !== Role.BOTH) return;
      setActiveRole(prev => prev === Role.CLIENT ? Role.FREELANCER : Role.CLIENT);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addNotification = (n: Omit<Notification, 'id' | 'date' | 'isRead'>) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substring(7),
      date: 'Baru saja',
      isRead: false,
      ...n
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <AppContext.Provider value={{ user, activeRole, login, logout, updateUser, switchRole, showToast, notifications, addNotification, markAsRead, markAllAsRead }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </AppContext.Provider>
  );
};

// --- Route Guards ---
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === Role.NONE) return <Navigate to="/role-select" replace />;
  return <Layout>{children}</Layout>;
};

const PublicOrPrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <Layout>{children}</Layout>;
};

const RoleSelectGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== Role.NONE) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  if (user && user.role !== Role.NONE) return <Navigate to="/dashboard" replace />;
  if (user && user.role === Role.NONE) return <Navigate to="/role-select" replace />;
  return <>{children}</>;
};

// --- Main App ---
const AppContent = () => {
  const { user, activeRole } = useApp();

  return (
    <Routes>
      <Route path="/login" element={<AuthGuard><Login /></AuthGuard>} />
      <Route path="/register" element={<AuthGuard><Register /></AuthGuard>} />
      <Route path="/role-select" element={<RoleSelectGuard><RoleSelection /></RoleSelectGuard>} />
      
      {/* Publicly Accessible Routes (Wrapped in Layout) */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={
        <PublicOrPrivateRoute>
            {/* Render based on Active Role, not just static User Role */}
            {activeRole === Role.FREELANCER ? <FreelancerDashboard /> : <ClientDashboard />}
        </PublicOrPrivateRoute>
      } />
      <Route path="/service/:id" element={<PublicOrPrivateRoute><ServiceDetail /></PublicOrPrivateRoute>} />
      <Route path="/how-it-works" element={<PublicOrPrivateRoute><HowItWorks /></PublicOrPrivateRoute>} />
      
      {/* Strictly Private Routes */}
      <Route path="/bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
      <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;