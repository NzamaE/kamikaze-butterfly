import { motion } from 'motion/react';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  return (
    <div className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="p-2 text-primary hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span className="font-headline italic font-semibold text-2xl tracking-tight text-primary">
            Kamikaze Butterfly
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-primary-container/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary fill-1">favorite</span>
        </div>
      </header>

      {/* Left Column: Visual */}
      <div className="lg:col-span-5 relative order-2 lg:order-1">
        <div className="sticky top-28 space-y-8">
          <div className="relative rounded-5xl overflow-hidden shadow-2xl group">
            <img
              alt="Elegant outdoor wedding setup"
              className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfSjP1zN9V3zU4UIa-6Mo6Bm4_PWEAyGxBGOQnzbRUYVrCViDuS76553-NsBzcMh912afaM4vTUUbuIU1fI53oPte3FPsAZO9kthrw73cYa8jYENTMUR_aTaFru6t3g3PrmCM0qzH5BA7JaxbspisoiwosWv5-HJcKT5hkq8540W4aHmwrUSsWp-589QwMgirKiMPPngFaPY0VfHwk1UuIpOcF-YrqTrhC-Wc5vqp3wDwrLoroRzXxSDUmAKZEAwwAfeFU5Ew9xI8"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <h1 className="font-headline italic text-4xl text-white mb-2 leading-tight">
                Start Your Journey Together
              </h1>
              <p className="text-white/90 font-body text-lg font-light">
                Sarah & James, let's craft a day as unique as your story.
              </p>
            </div>
          </div>
          <div className="bg-surface-container-low p-8 rounded-4xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="uppercase tracking-widest text-[11px] font-bold text-secondary">The Planning Path</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1 h-1 bg-primary rounded-full"></div>
              <div className="flex-1 h-1 bg-outline-variant/30 rounded-full"></div>
              <div className="flex-1 h-1 bg-outline-variant/30 rounded-full"></div>
              <div className="flex-1 h-1 bg-outline-variant/30 rounded-full"></div>
            </div>
            <p className="text-sm text-on-surface-variant italic font-headline">Step 1 of 4: The Foundation</p>
          </div>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="lg:col-span-7 order-1 lg:order-2">
        <div className="bg-surface-container-lowest p-8 md:p-12 rounded-5xl shadow-[0_20px_40px_rgba(48,51,48,0.03)]">
          <form
            className="space-y-10"
            onSubmit={(e) => {
              e.preventDefault();
              onComplete();
            }}
          >
            <div className="space-y-6">
              <label className="block">
                <span className="font-headline text-2xl text-primary block mb-4 italic">
                  What shall we call your celebration?
                </span>
                <input
                  className="w-full bg-surface-container-high border-none rounded-3xl p-5 text-lg font-body focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all placeholder:text-outline-variant/60"
                  placeholder="e.g., Sarah & James' Big Day"
                  type="text"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <span className="font-body text-xs font-bold uppercase tracking-widest text-secondary block">
                  Preferred Location
                </span>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                    location_on
                  </span>
                  <input
                    className="w-full bg-surface-container-high border-none rounded-3xl py-4 pl-12 pr-4 font-body focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    placeholder="City, State"
                    type="text"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <span className="font-body text-xs font-bold uppercase tracking-widest text-secondary block">
                  Guest Count
                </span>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                    groups
                  </span>
                  <input
                    className="w-full bg-surface-container-high border-none rounded-3xl py-4 pl-12 pr-4 font-body focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    placeholder="50 - 500"
                    type="number"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <span className="font-body text-xs font-bold uppercase tracking-widest text-secondary block">
                  Investment Range
                </span>
                <span className="font-headline text-xl text-primary italic">$45,000</span>
              </div>
              <input
                className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                max="150000"
                min="10000"
                step="5000"
                type="range"
              />
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-outline-variant">
                <span>$10,000</span>
                <span>$150,000+</span>
              </div>
            </div>

            <div className="space-y-6">
              <span className="font-body text-xs font-bold uppercase tracking-widest text-secondary block">
                Visual Aesthetic
              </span>
              <div className="flex flex-wrap gap-3">
                {['Romantic', 'Modern Editorial', 'Rustic Charm', 'Coastal Breeze', 'Vintage Luxe'].map((tag) => (
                  <button
                    key={tag}
                    className={`px-6 py-3 rounded-full font-body text-sm font-semibold transition-all active:scale-95 ${
                      tag === 'Romantic'
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                    }`}
                    type="button"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button
                className="w-full group relative overflow-hidden bg-gradient-to-br from-primary to-primary-container text-white rounded-3xl py-5 font-body font-bold text-lg shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-[0.98]"
                type="submit"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Create My Plan
                  <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">
                    auto_awesome
                  </span>
                </span>
              </button>
              <p className="text-center mt-6 text-xs text-outline-variant font-medium uppercase tracking-[0.2em]">
                Crafted with love by Kamikaze Butterfly
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
}
