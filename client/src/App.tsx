import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Heart, 
  Calendar, 
  User, 
  Menu, 
  X, 
  Bell, 
  Home, 
  Briefcase, 
  ShieldCheck, 
  LogOut,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Button } from "./components/Button";
import { Badge } from "./components/Badge";
import { GlassPanel } from "./components/Card";

// Screens
import { LoginScreen } from "./screens/LoginScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { BookingScreen } from "./screens/BookingScreen";
import { VendorProfileScreen } from "./screens/VendorProfileScreen";
import { VendorDashboardScreen } from "./screens/VendorDashboardScreen";
import { AdminVerificationScreen } from "./screens/AdminVerificationScreen";
import { AdminDashboardScreen } from "./screens/AdminDashboardScreen";
import { CuratedVendorsScreen } from "./screens/CuratedVendorsScreen";
import { ChecklistScreen } from "./screens/ChecklistScreen";
import { InvoiceScreen } from "./screens/InvoiceScreen";

type Screen = 
  | 'login' 
  | 'onboarding' 
  | 'booking' 
  | 'vendorProfile' 
  | 'vendorDashboard' 
  | 'adminVerification' 
  | 'adminDashboard' 
  | 'curatedVendors' 
  | 'checklist' 
  | 'invoice';

export default function App() {
  const [currentScreen, setCurrentScreen] = React.useState<Screen>('login');
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogin = (role: string) => {
    setUserRole(role);
    if (role === 'client') setCurrentScreen('onboarding');
    else if (role === 'vendor') setCurrentScreen('vendorDashboard');
    else setCurrentScreen('adminDashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentScreen('login');
    setIsMenuOpen(false);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login': return <LoginScreen onLogin={handleLogin} />;
      case 'onboarding': return <OnboardingScreen onNext={() => setCurrentScreen('curatedVendors')} />;
      case 'booking': return <BookingScreen onBack={() => setCurrentScreen('vendorProfile')} onNext={() => setCurrentScreen('invoice')} />;
      case 'vendorProfile': return <VendorProfileScreen onBack={() => setCurrentScreen('curatedVendors')} onBook={() => setCurrentScreen('booking')} />;
      case 'vendorDashboard': return <VendorDashboardScreen />;
      case 'adminVerification': return <AdminVerificationScreen />;
      case 'adminDashboard': return <AdminDashboardScreen />;
      case 'curatedVendors': return <CuratedVendorsScreen onVendorClick={() => setCurrentScreen('vendorProfile')} />;
      case 'checklist': return <ChecklistScreen />;
      case 'invoice': return <InvoiceScreen onBack={() => setCurrentScreen('checklist')} />;
      default: return <LoginScreen onLogin={handleLogin} />;
    }
  };

  const showNav = currentScreen !== 'login';

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/20 selection:text-primary">
      {showNav && (
        <header className="sticky top-0 z-50 glass-panel border-b border-surface-container-high px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => {
                if (userRole === 'client') setCurrentScreen('curatedVendors');
                else if (userRole === 'vendor') setCurrentScreen('vendorDashboard');
                else setCurrentScreen('adminDashboard');
              }}
            >
              <div className="w-10 h-10 editorial-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <Sparkles size={20} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold tracking-tight leading-none">Kamikaze</h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary opacity-80">Butterfly</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {userRole === 'client' && (
                <>
                  <button onClick={() => setCurrentScreen('curatedVendors')} className={`text-sm font-bold uppercase tracking-widest transition-colors ${currentScreen === 'curatedVendors' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>Discover</button>
                  <button onClick={() => setCurrentScreen('checklist')} className={`text-sm font-bold uppercase tracking-widest transition-colors ${currentScreen === 'checklist' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>Checklist</button>
                  <button className="text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Inspiration</button>
                </>
              )}
              {userRole === 'vendor' && (
                <>
                  <button onClick={() => setCurrentScreen('vendorDashboard')} className={`text-sm font-bold uppercase tracking-widest transition-colors ${currentScreen === 'vendorDashboard' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>Dashboard</button>
                  <button className="text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Portfolio</button>
                  <button className="text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Settings</button>
                </>
              )}
              {userRole === 'admin' && (
                <>
                  <button onClick={() => setCurrentScreen('adminDashboard')} className={`text-sm font-bold uppercase tracking-widest transition-colors ${currentScreen === 'adminDashboard' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>Overview</button>
                  <button onClick={() => setCurrentScreen('adminVerification')} className={`text-sm font-bold uppercase tracking-widest transition-colors ${currentScreen === 'adminVerification' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>Ecosystem</button>
                  <button className="text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Analytics</button>
                </>
              )}
            </nav>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
              </Button>
              <div className="h-8 w-px bg-surface-container-high hidden sm:block" />
              <div className="flex items-center gap-3 pl-2">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold">{userRole === 'client' ? 'Ernest Nzama' : userRole === 'vendor' ? "Julian's Floral" : 'Admin Portal'}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-80">{userRole}</p>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-10 h-10 rounded-full bg-surface-container-low border border-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
                >
                  {isMenuOpen ? <X size={20} /> : <User size={20} />}
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      <AnimatePresence mode="wait">
        <main key={currentScreen} className="relative">
          {renderScreen()}
        </main>
      </AnimatePresence>

      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-20 right-6 z-[60] w-64 glass-panel border border-surface-container-high shadow-2xl rounded-3xl p-4 space-y-2"
        >
          <div className="p-4 bg-surface-container-low rounded-2xl mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Account</p>
            <p className="font-bold text-sm truncate">ernest.nzama@umuzi.org</p>
          </div>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors text-sm font-medium">
            <User size={18} className="text-primary" />
            Profile Settings
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors text-sm font-medium">
            <ShieldCheck size={18} className="text-primary" />
            Security
          </button>
          <div className="h-px bg-surface-container-high my-2" />
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 transition-colors text-sm font-bold"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </motion.div>
      )}

      {showNav && userRole === 'client' && (
        <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50 glass-panel border border-surface-container-high shadow-2xl rounded-full px-8 py-4 flex items-center justify-between">
          <button onClick={() => setCurrentScreen('curatedVendors')} className={`p-2 rounded-full transition-all ${currentScreen === 'curatedVendors' ? 'bg-primary text-on-primary scale-110 shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:text-primary'}`}>
            <Home size={24} />
          </button>
          <button onClick={() => setCurrentScreen('checklist')} className={`p-2 rounded-full transition-all ${currentScreen === 'checklist' ? 'bg-primary text-on-primary scale-110 shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:text-primary'}`}>
            <Calendar size={24} />
          </button>
          <button className="p-2 rounded-full text-on-surface-variant hover:text-primary transition-all">
            <Heart size={24} />
          </button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full text-on-surface-variant hover:text-primary transition-all">
            <User size={24} />
          </button>
        </nav>
      )}

      {/* Demo Switcher for testing all screens easily */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        <div className="group relative">
          <Button size="icon" variant="tonal" className="rounded-full shadow-lg">
            <Menu size={20} />
          </Button>
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:flex flex-col gap-1 bg-surface-container-high p-2 rounded-2xl shadow-2xl min-w-[180px]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant p-2">Demo Screens</p>
            {(['onboarding', 'curatedVendors', 'vendorProfile', 'booking', 'checklist', 'invoice', 'vendorDashboard', 'adminVerification', 'adminDashboard'] as Screen[]).map(s => (
              <button 
                key={s} 
                onClick={() => setCurrentScreen(s)}
                className="text-left px-3 py-2 rounded-lg hover:bg-surface-container text-xs font-bold capitalize transition-colors"
              >
                {s.replace(/([A-Z])/g, ' $1')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
