import { useState } from 'react';
import { motion } from 'motion/react';
import { ChecklistItem } from '../types';

const INITIAL_ITEMS: ChecklistItem[] = [
  {
    id: '1',
    title: 'Reception Venue',
    subtitle: 'The Glass House Estate • Paid $4,500',
    status: 'completed',
    category: 'Venue & Catering',
  },
  {
    id: '2',
    title: 'Main Catering',
    subtitle: 'Awaiting response from Heirloom Kitchen',
    status: 'pending',
    category: 'Venue & Catering',
  },
  {
    id: '3',
    title: 'The Gown',
    subtitle: 'Vera Wang Luxe • Paid $3,200',
    status: 'completed',
    category: 'Wedding Attire',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBT3ytAbd1z6JbhIFS6FBjaoeApx7Mkk_UYdY9VgjKcrlD1LP_y6KyVE7PW2fxKEX2dWSRhz8AwakGJ_Qef3l80c0Z-LycuNAE8IVq41DQ8iVa2p-BhniLxZmqQHvdwT99alGbW-yd3GlRySn77r0gL2WATgrHs-XG9IP-QO33N4aVWq7up5m4ouzlXp09Qi6ZoFZisdkhFoDSIqD3hTgME_v9iL9tvEEPLH_NI--dHCFqpePtC3Bpkq84DjkHGkzzGdXRBA590ZGo',
  },
];

export default function Checklist() {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_ITEMS);

  const toggleStatus = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'completed' ? 'pending' : 'completed';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const completedCount = items.filter(i => i.status === 'completed').length;
  const progress = Math.round((completedCount / (items.length + 4)) * 100); // +4 for other tasks not yet added

  return (
    <div className="bg-surface min-h-screen">
      <header className="fixed top-0 w-full z-50 glass flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary cursor-pointer">menu</span>
        </div>
        <h1 className="font-headline italic text-2xl tracking-tight text-primary font-semibold">Kamikaze Butterfly</h1>
        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary-container/30">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgXJlTUWyEYcS1I4Dz3CNNqzP-QRqExppd-4zSmOIXELlf512il4zu3BFploUd1a3OslL_7nuBzdw8qpKlea1fLopdiBvsl8mcW3vJO-w52-mvWifN4ZfPbTpgsN7t6s_HdIs2x04fWAk_8qKKvXrKKe7mXkVkZmE4MSmDiNSAeQatmnYmpDmaZ8e1mPIPuYY6wdPqddEjNxDpCjtjgWKmyNfeFpfC-oooqyTbua5DuIKfQuI8sZF-IknBBSIZhTwK08KbQDlZNtE"
            referrerPolicy="no-referrer"
          />
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-4xl mx-auto space-y-12">
        {/* Progress Dashboard */}
        <section className="relative overflow-hidden rounded-5xl bg-surface-container-lowest p-8 md:p-12 text-center">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-6">
            <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tight text-on-surface">
              The Grand Countdown
            </h2>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-surface-container-high"
                    cx="50%"
                    cy="50%"
                    fill="transparent"
                    r="45%"
                    stroke="currentColor"
                    strokeWidth="8"
                  ></circle>
                  <motion.circle
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                    cx="50%"
                    cy="50%"
                    fill="transparent"
                    r="45%"
                    stroke="url(#gradient)"
                    strokeDasharray="283"
                    strokeLinecap="round"
                    strokeWidth="12"
                  ></motion.circle>
                  <defs>
                    <linearGradient id="gradient" x1="0%" x2="100%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#825348" />
                      <stop offset="100%" stopColor="#f2b5a7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-headline text-5xl md:text-7xl font-bold italic text-primary">{progress}%</span>
                  <span className="font-label text-xs uppercase tracking-widest text-outline">Planned</span>
                </div>
              </div>
            </div>
            <p className="font-body text-lg text-on-surface-variant max-w-md mx-auto">
              Sarah & James, your vision is coming to life. 142 days to go until the big day.
            </p>
          </div>
        </section>

        {/* Checklist Sections */}
        <div className="space-y-10">
          <section className="space-y-6">
            <div className="flex items-end justify-between px-2">
              <h3 className="font-headline text-2xl italic text-on-surface">Venue & Catering</h3>
              <span className="font-label text-sm text-outline">
                {items.filter(i => i.category === 'Venue & Catering' && i.status === 'completed').length} of {items.filter(i => i.category === 'Venue & Catering').length} Complete
              </span>
            </div>
            <div className="space-y-4">
              {items.filter(i => i.category === 'Venue & Catering').map(item => (
                <motion.div 
                  key={item.id}
                  layout
                  onClick={() => toggleStatus(item.id)}
                  className="group flex items-center justify-between p-6 bg-surface-container-low rounded-4xl hover:bg-surface-container-lowest transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
                      item.status === 'completed' ? 'bg-secondary-container text-secondary' : 'bg-tertiary-container text-tertiary'
                    }`}>
                      <span className={`material-symbols-outlined ${item.status === 'completed' ? 'fill-1' : ''}`}>
                        {item.status === 'completed' ? 'check_circle' : 'hourglass_empty'}
                      </span>
                    </div>
                    <div>
                      <h4 className={`font-body font-bold text-lg text-on-surface ${item.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                        {item.title}
                      </h4>
                      <p className="font-body text-sm text-on-surface-variant">{item.subtitle}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                    {item.status === 'completed' ? 'more_vert' : 'chevron_right'}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-end justify-between px-2">
              <h3 className="font-headline text-2xl italic text-on-surface">Photo & Video</h3>
              <span className="font-label text-sm text-outline">0 of 2 Complete</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative overflow-hidden group p-6 bg-surface-container-high rounded-4xl hover:bg-surface-container-lowest transition-all duration-300">
                <div className="absolute top-0 right-0 p-4">
                  <span className="material-symbols-outlined text-outline-variant">photo_camera</span>
                </div>
                <div className="space-y-4">
                  <h4 className="font-headline text-xl text-on-surface">Lead Photographer</h4>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    Find a professional who matches your "Ethereal Curator" mood board.
                  </p>
                  <button className="w-full py-3 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-label text-xs uppercase tracking-widest font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                    Explore Options
                  </button>
                </div>
              </div>
              <div className="relative overflow-hidden group p-6 bg-surface-container-high rounded-4xl hover:bg-surface-container-lowest transition-all duration-300">
                <div className="absolute top-0 right-0 p-4">
                  <span className="material-symbols-outlined text-outline-variant">videocam</span>
                </div>
                <div className="space-y-4">
                  <h4 className="font-headline text-xl text-on-surface">Cinematography</h4>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    Capture the movement and emotion of your golden hour vows.
                  </p>
                  <button className="w-full py-3 rounded-full bg-surface-container-lowest text-primary border border-primary/10 font-label text-xs uppercase tracking-widest font-bold active:scale-95 transition-transform">
                    View Shortlist
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-end justify-between px-2">
              <h3 className="font-headline text-2xl italic text-on-surface">Wedding Attire</h3>
              <span className="font-label text-sm text-outline">
                {items.filter(i => i.category === 'Wedding Attire' && i.status === 'completed').length} of {items.filter(i => i.category === 'Wedding Attire').length} Complete
              </span>
            </div>
            <div className="space-y-4">
              {items.filter(i => i.category === 'Wedding Attire').map(item => (
                <motion.div 
                  key={item.id}
                  layout
                  onClick={() => toggleStatus(item.id)}
                  className="group flex items-center justify-between p-6 bg-surface-container-low rounded-4xl hover:bg-surface-container-lowest transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
                      item.status === 'completed' ? 'bg-secondary-container text-secondary' : 'bg-tertiary-container text-tertiary'
                    }`}>
                      <span className={`material-symbols-outlined ${item.status === 'completed' ? 'fill-1' : ''}`}>
                        {item.status === 'completed' ? 'check_circle' : 'hourglass_empty'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      {item.imageUrl && (
                        <div className={`w-14 h-14 rounded-xl overflow-hidden transition-all ${item.status === 'completed' ? 'grayscale opacity-50' : ''}`}>
                          <img
                            className="w-full h-full object-cover"
                            src={item.imageUrl}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className={`font-body font-bold text-lg text-on-surface ${item.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                          {item.title}
                        </h4>
                        <p className="font-body text-sm text-on-surface-variant">{item.subtitle}</p>
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline">more_vert</span>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Spend Tracker */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="md:col-span-2 bg-on-surface text-surface p-8 rounded-5xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="font-label text-[10px] uppercase tracking-[0.2em] opacity-60">Investment Summary</span>
              <span className="material-symbols-outlined opacity-40">account_balance_wallet</span>
            </div>
            <div className="mt-8 space-y-2">
              <div className="flex justify-between items-end">
                <h5 className="font-headline text-4xl font-bold tracking-tight">$12,450</h5>
                <span className="font-body text-sm opacity-60">of $35,000 Budget</span>
              </div>
              <div className="h-2 bg-surface/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary-container w-[35%]"></div>
              </div>
            </div>
          </div>
          <div className="bg-primary-container p-8 rounded-5xl flex flex-col items-center justify-center text-on-primary-container text-center space-y-2">
            <span className="material-symbols-outlined text-4xl">savings</span>
            <p className="font-headline text-xl font-bold">$22,550</p>
            <p className="font-label text-[10px] uppercase tracking-wider font-bold opacity-70">Remaining Funds</p>
          </div>
        </section>
      </main>
    </div>
  );
}
