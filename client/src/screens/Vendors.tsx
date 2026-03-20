import { motion } from 'motion/react';

export default function Vendors() {
  return (
    <div className="bg-background min-h-screen">
      <header className="fixed top-0 w-full z-50 glass">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <button className="text-primary hover:opacity-80 transition-opacity active:scale-95 duration-200">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="font-headline italic text-2xl tracking-tight text-primary">Kamikaze Butterfly</h1>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTuI89dhJwd0W2vItfG-EHB-nyvxyePoFoMYX1fmtvjINsvtAdp80IM3ig9buA9jIEernMmqEVjPvTlJ_fUJxNyrUVtW0pdJ8yLT8LJhqb1P_yO1RgvfsI-6gaCuAN4dnAG1fptgSxYNwr4VJE1QsbYdPoyL4X2IS3M8aWEUkUR9j29Hq5mG-KzKMfzrYZcijSwYR-FT63S9THlIG14M3PNcfAcyL4CErOA6Pq0nyHm1MHy2-3bWElHYmHt_xEK8wpxPHT9fLAUWo"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32">
        {/* Search & Filter */}
        <section className="px-6 mb-10">
          <div className="flex items-center gap-4 bg-surface-container-high rounded-full px-5 py-3 shadow-sm">
            <span className="material-symbols-outlined text-outline">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-on-surface placeholder-outline-variant w-full font-body text-sm"
              placeholder="Search by venue, floral, photo..."
              type="text"
            />
            <button className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-widest border-l border-outline-variant pl-4">
              <span className="material-symbols-outlined text-sm">tune</span>
              Filter
            </button>
          </div>
        </section>

        {/* Top Picks */}
        <section className="mb-14">
          <div className="px-6 flex justify-between items-end mb-6">
            <div>
              <span className="font-label text-xs uppercase tracking-[0.2em] text-outline mb-1 block">
                Curated For You
              </span>
              <h2 className="font-headline text-3xl text-on-surface">Top Picks</h2>
            </div>
            <button className="text-primary font-medium text-sm flex items-center gap-1 hover:opacity-80">
              See All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="flex overflow-x-auto gap-6 px-6 no-scrollbar snap-x">
            {[
              {
                name: 'Ethereal Blooms Florist',
                rating: '4.9',
                reviews: '128',
                price: '$$$',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWmwx_Vi3dKgH_SDizb3Ub2Em6-Y73dDBfP0AamY0paTguoEuKlqG1YhRYTnqKdnBAujIhUIlvNiChOcsvnOpIya-RBcT2-gu5mSLh5eaoeFa5z2-nGO_kT5OabYdRoK_RG-zpXLfBLa5RWr3uVu8gJIisP7Uje-7TaTkPZ85ro-iwJiUBxeAY-XameK8IQtNbGbyCKfHmaeToyfJatMbq6ItYNlC2i5hg238n_9dU9tOI56_BW0ZPIwXY57O8eg3n0NEpED6huK4',
                verified: true,
              },
              {
                name: 'The Manor Estate',
                rating: '5.0',
                reviews: '84',
                price: '$$$$',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBePJ6dY1hPNaJU44mQvlAiUYMvMqPQdaISnYjfZNoNAam7nwnIdk4IUHTcFL7Icaxj5XI1jR_4J23-1N9kmVAQk9qeCdUNCVXPye0N1rn7r3o7GKRrM0z2o2Ut8yl7MVmx0pC6tPh8VNCd3nU1vmM8MHKOSE01NNXe-7TGv4igX0egWaR00FWSaTabKo3Jpo_8VXgBOEjbi7UqqYvFHm6QaxggdKS1vPkHqtMuTYQmbsbjEAKq4hDCqFk403gLYb6_46LmPzELX7I',
              },
              {
                name: 'Midnight Cinema',
                rating: '4.8',
                reviews: '215',
                price: '$$',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbspMSVCNiHZQJAQxqn4fQWyCchHQmFw-K4dFwwhNvtS2jNiYDqwMaLd04KpLAPpPLFayEYeURLhGol3V7zp3BcFJ5-T8joX9xAHi9_CwXp-9WJ6H_0uptdV9ShF_9oQqFWzf0UQfDaQWqApm-rxbtUOq9ydhw6fIaOpumFDYaULAwofi9gJ_PBdESKfVOlagx4EicU_q4BMFQu2lMUPw03-nYHcTwyC0BA_yKXXY8vtottSkN86B6zu_TWFv7Jiq6wsofYw9X_Jo',
              },
            ].map((vendor) => (
              <div key={vendor.name} className="min-w-[280px] snap-start relative group">
                <div className="aspect-[4/5] rounded-4xl overflow-hidden mb-4 relative">
                  <img
                    alt={vendor.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={vendor.img}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  {vendor.verified && (
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-[10px] text-white font-bold uppercase tracking-wider">
                      Verified
                    </div>
                  )}
                </div>
                <h3 className="font-headline text-xl">{vendor.name}</h3>
                <p className="text-outline text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary fill-1">star</span>
                  {vendor.rating} ({vendor.reviews} reviews) • {vendor.price}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Discover More */}
        <section className="px-6">
          <h2 className="font-headline text-2xl mb-8">Discover More</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                name: 'Artisan Table Catering',
                category: 'Catering',
                location: 'London, UK',
                desc: 'Organic, locally-sourced farm-to-table experiences tailored to your seasonal wedding palette.',
                price: '$4,500',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbBW9qIiouqYY1qcvfNOoQV2P9AY9qvyzZ0HEbgug2pUG597chaQKnevxhAMZgyg7FFhlhyoSHHM-6f1owziuNBz3zWTNGuJSo-SWWj3Oy9ADV5qtq-05ig3_M0v-THNtLY_eGek2-lhMpR_th1LdfAEHTUD0uxohGA-6uCV2_hwWQ7909RsJFwng44TvxmYU__gdbfVt6pJlxt8M5AvuEzPKQ_yB0G35anf62BoH-lIvUMmmfvWV0aSeksykgSTcyO3L-GHk7w8o',
              },
              {
                name: 'Ivory & Silk Boutique',
                category: 'Bridal Wear',
                location: 'Paris, FR',
                desc: 'Exclusive atelier featuring hand-stitched lace and bespoke silhouettes for the modern romantic.',
                price: 'FREE',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsCyeh8ul5z3uJFQynombOi4_0TKNjZUXIzHq4BT2yEzS96a8h0_lPbA0N1oCM4AYoOAASlFmeMJ-_RV7I0spj8q8JyPxrGo-4ACEQrHl4vXJFto1vdxQiyDrr1-OXhNBipgHrHfsk1E0qNhpJK1QPjB6Pmbp34TVfLbfcocJZsyR_8XuKD-0C26oFG0sdrMlMlBRN8hp45kM8fW6VHTx5PKe1W08LEwtsFk-SF_qUyyq5lJoWTA7aUiG6IcVGv69HwK_5e50LZLM',
                priceLabel: 'Consultation',
              },
            ].map((vendor) => (
              <div key={vendor.name} className="bg-surface-container-low rounded-5xl p-4 flex flex-col group">
                <div className="w-full aspect-video rounded-4xl overflow-hidden mb-6">
                  <img
                    alt={vendor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={vendor.img}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="px-2">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-headline text-2xl mb-1">{vendor.name}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-bold">
                          {vendor.category}
                        </span>
                        <span className="text-xs text-outline font-medium tracking-widest uppercase">
                          {vendor.location}
                        </span>
                      </div>
                    </div>
                    <button className="bg-surface-container-lowest text-primary p-3 rounded-full shadow-sm hover:scale-110 active:scale-95 transition-transform">
                      <span className="material-symbols-outlined">favorite</span>
                    </button>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-6 leading-relaxed line-clamp-2">{vendor.desc}</p>
                  <div className="flex items-center justify-between border-t border-outline-variant/20 pt-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-outline tracking-wider">
                        {vendor.priceLabel || 'Starts from'}
                      </span>
                      <span className="text-lg font-bold text-on-surface">{vendor.price}</span>
                    </div>
                    <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-label font-bold text-sm tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
                      VIEW PROFILE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Concierge Banner */}
        <section className="mt-20 px-6">
          <div className="bg-tertiary-container rounded-5xl p-10 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-primary/10 rounded-full -translate-x-12 -translate-y-12"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-secondary/5 rounded-full translate-x-12 translate-y-12"></div>
            <span className="font-headline italic text-primary text-xl mb-4">Uniquely Yours</span>
            <h2 className="font-headline text-3xl mb-6 max-w-md">Can't find what you're looking for?</h2>
            <p className="text-on-tertiary-container max-w-lg mb-8 font-body leading-relaxed">
              Our concierges are ready to help you source rare vendors that fit your specific aesthetic and
              requirements.
            </p>
            <button className="bg-on-tertiary-container text-white px-10 py-4 rounded-full font-bold tracking-widest text-sm hover:opacity-90 transition-opacity">
              START A CONCIERGE SEARCH
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
