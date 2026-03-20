import { motion } from 'motion/react';

export default function AdminDashboard() {
  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex">
      {/* Sidebar */}
      <aside className="h-screen w-64 fixed left-0 top-0 z-40 bg-surface border-r border-surface-container-high flex flex-col py-8">
        <div className="px-6 mb-12">
          <h1 className="font-headline text-lg text-primary">Butterfly Admin</h1>
          <p className="font-body text-xs tracking-wide uppercase text-outline mt-1">Sponsor Portal</p>
        </div>
        <nav className="flex-1 space-y-1">
          <a
            className="flex items-center space-x-3 bg-surface-container-high text-primary font-bold rounded-r-full pl-6 py-3 transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-body text-sm tracking-wide uppercase">Overview</span>
          </a>
          {['Analytics', 'Vendors', 'Support'].map((item) => (
            <a
              key={item}
              className="flex items-center space-x-3 text-on-surface-variant pl-6 py-3 hover:bg-surface-container-low hover:translate-x-1 transition-all duration-300"
              href="#"
            >
              <span className="material-symbols-outlined">
                {item === 'Analytics' ? 'analytics' : item === 'Vendors' ? 'verified_user' : 'contact_support'}
              </span>
              <span className="font-body text-sm tracking-wide uppercase">{item}</span>
            </a>
          ))}
        </nav>
        <div className="px-6 mt-auto space-y-4">
          <button className="w-full py-3 px-4 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-body text-xs font-bold uppercase tracking-wider shadow-sm hover:scale-[0.98] transition-transform">
            Approve New Vendors
          </button>
          <div className="pt-6 border-t border-surface-container-high">
            <a className="flex items-center space-x-3 text-on-surface-variant py-2 hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-body text-sm uppercase tracking-wide">Settings</span>
            </a>
            <a className="flex items-center space-x-3 text-on-surface-variant py-2 hover:text-error transition-colors" href="#">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-body text-sm uppercase tracking-wide">Logout</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 flex flex-col">
        <header className="glass sticky top-0 z-50 flex justify-between items-center w-full px-12 py-4">
          <div className="flex items-center space-x-8">
            <h2 className="text-2xl font-semibold text-primary font-headline italic tracking-tight">
              Kamikaze Butterfly
            </h2>
            <nav className="hidden md:flex space-x-6 items-center">
              <a className="text-primary border-b-2 border-primary pb-1 font-body text-sm tracking-wide" href="#">
                Dashboard
              </a>
              {['Vendors', 'Revenue', 'Settings'].map((item) => (
                <a key={item} className="text-on-surface-variant font-body text-sm hover:text-primary transition-colors" href="#">
                  {item}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer p-2 rounded-lg hover:bg-surface-container-low transition-all">
                notifications
              </span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer p-2 rounded-lg hover:bg-surface-container-low transition-all">
              help_outline
            </span>
            <div className="flex items-center space-x-3 pl-4 border-l border-surface-container-high">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvsqWh_zZY3Ql4Kb1nLhlM1QaWLqjMpgP5MsjeT7TO1aq4Ra-TnylDuGFKl1HLiqFMFCMbYsDew_11Fdhhhxl_IsbI0IsUaHPKikrIuOoEzJ24UOU8wYDLUDmxxtcNzjpVfwYgemGbgouLoPztKzu8jpjatNzqTW04Dyfb_kgPtEoQylwJWPpuBTRK4pvm3OT8-j9_0s1-nBRwATdzqXvmy_aODBrhtSu4UmaFeK2WtwrlL2hkeQoYy242BfccfyifxR_SeM659yw"
                referrerPolicy="no-referrer"
              />
              <div className="hidden lg:block">
                <p className="text-xs font-bold text-on-surface">Alex Mercer</p>
                <p className="text-[10px] text-outline uppercase tracking-tighter">Chief Sponsor Admin</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-12 space-y-12 max-w-[1600px]">
          <section className="flex flex-col lg:flex-row justify-between items-end gap-8">
            <div>
              <h3 className="font-headline text-4xl text-on-surface mb-2">Command Overview</h3>
              <p className="text-on-surface-variant font-body max-w-md">
                Orchestrating the finest matrimonial logistics for the quarter.
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 px-6 py-3 bg-surface-container-high text-on-surface-variant rounded-full hover:bg-surface-container-highest transition-colors font-body text-sm font-semibold">
                <span className="material-symbols-outlined text-lg">description</span>
                <span>Generate Monthly Report</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-3 bg-secondary-container text-on-secondary-container rounded-full hover:bg-secondary-container/80 transition-colors font-body text-sm font-semibold">
                <span className="material-symbols-outlined text-lg">forum</span>
                <span>Message Support</span>
              </button>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Active Wedding Plans', value: '142', icon: 'celebration', color: 'primary', trend: '+12%' },
              { label: 'Completed This Month', value: '28', icon: 'task_alt', color: 'secondary', trend: '34 Fixed' },
              { label: 'Total Revenue', value: '$842.5k', icon: 'payments', color: 'primary', dark: true },
              { label: 'New Vendor Requests', value: '19', icon: 'storefront', color: 'tertiary' },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className={`p-8 rounded-4xl flex flex-col justify-between transition-colors duration-500 ${
                  kpi.dark
                    ? 'bg-primary text-on-primary shadow-xl shadow-primary/10'
                    : 'bg-surface-container-lowest hover:bg-surface-container-low'
                }`}
              >
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-3 rounded-2xl ${kpi.dark ? 'bg-white/10' : `bg-${kpi.color}-container/30 text-${kpi.color}`}`}>
                    <span className="material-symbols-outlined">{kpi.icon}</span>
                  </div>
                  {kpi.trend && (
                    <span className={`text-xs font-bold bg-${kpi.color}-container px-2 py-1 rounded-full text-${kpi.color}`}>
                      {kpi.trend}
                    </span>
                  )}
                </div>
                <div>
                  <p className={`text-3xl font-headline mb-1 ${kpi.dark ? 'text-on-primary' : 'text-on-surface'}`}>
                    {kpi.value}
                  </p>
                  <p className={`text-xs uppercase tracking-widest font-body font-semibold ${kpi.dark ? 'text-on-primary/60' : 'text-outline'}`}>
                    {kpi.label}
                  </p>
                </div>
              </div>
            ))}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="font-headline text-2xl">Revenue Analytics</h4>
                <div className="flex bg-surface-container rounded-full p-1">
                  <button className="px-4 py-1.5 bg-white rounded-full text-xs font-bold shadow-sm">Monthly</button>
                  <button className="px-4 py-1.5 text-xs text-outline font-bold">Quarterly</button>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-8 rounded-5xl h-[400px] flex flex-col">
                <div className="flex-1 flex items-end justify-between px-4 pb-4 gap-4">
                  {[45, 65, 85, 55, 75, 95, 80].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className={`w-full rounded-t-xl transition-colors relative group ${
                        i === 2 ? 'bg-primary-container/60 hover:bg-primary' : 'bg-secondary-container/40 hover:bg-secondary-container'
                      }`}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between px-4 pt-6 border-t border-surface-container text-[10px] font-bold text-outline uppercase tracking-tighter">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="font-headline text-2xl">Active Plans</h4>
                <button className="text-primary text-xs font-bold uppercase underline-offset-4 hover:underline">View All</button>
              </div>
              <div className="space-y-4 overflow-y-auto no-scrollbar max-h-[400px]">
                {[
                  { name: 'Sofia & Julian', date: 'Aug 24, 2024 • Tuscany', budget: '$45,000', spent: '72%', status: 'On Track', color: 'secondary' },
                  { name: 'Marcus & Elena', date: 'Sep 12, 2024 • Lake Como', budget: '$120,000', spent: '15%', status: 'Planning', color: 'primary' },
                  { name: 'Leo & Sarah', date: 'Dec 05, 2024 • Amalfi', budget: '$68,000', spent: '48%', status: 'Needs Review', color: 'error' },
                ].map((plan) => (
                  <div key={plan.name} className="bg-surface-container-lowest p-6 rounded-3xl hover:translate-x-1 transition-transform duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-headline text-lg">{plan.name}</p>
                        <p className="text-[10px] text-outline uppercase tracking-widest font-bold">{plan.date}</p>
                      </div>
                      <span className={`bg-${plan.color}-container text-on-${plan.color}-container text-[10px] px-3 py-1 rounded-full font-bold`}>
                        {plan.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-outline">BUDGET {plan.budget}</span>
                        <span>{plan.spent} SPENT</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div className={`h-full bg-${plan.color === 'error' ? 'error' : 'primary'} w-[${plan.spent}]`} style={{ width: plan.spent }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-headline text-2xl">Recent Transactions</h4>
              <div className="flex items-center space-x-2 text-outline text-sm">
                <span className="material-symbols-outlined text-lg">filter_list</span>
                <span className="font-body">Filters</span>
              </div>
            </div>
            <div className="overflow-x-auto bg-surface-container-lowest rounded-4xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-container text-[10px] text-outline font-bold uppercase tracking-widest">
                    <th className="p-6">Transaction ID</th>
                    <th className="p-6">Couple Name</th>
                    <th className="p-6">Date</th>
                    <th className="p-6">Amount</th>
                    <th className="p-6">Vendor Share</th>
                    <th className="p-6">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-body">
                  {[
                    { id: 'TX-98231', couple: 'Sofia & Julian', date: 'June 14, 2024', amount: '$12,400.00', share: '$1,860.00', status: 'Verified' },
                    { id: 'TX-98244', couple: 'Marcus & Elena', date: 'June 13, 2024', amount: '$8,250.00', share: '$1,237.50', status: 'Verified' },
                    { id: 'TX-98259', couple: 'Leo & Sarah', date: 'June 12, 2024', amount: '$15,000.00', share: '$2,250.00', status: 'Processing' },
                  ].map((tx) => (
                    <tr key={tx.id} className="hover:bg-surface-container-low transition-colors group border-b border-surface-container/50 last:border-0">
                      <td className="p-6 font-mono text-xs">{tx.id}</td>
                      <td className="p-6 font-semibold">{tx.couple}</td>
                      <td className="p-6 text-on-surface-variant">{tx.date}</td>
                      <td className="p-6 font-bold">{tx.amount}</td>
                      <td className="p-6 text-secondary font-semibold">{tx.share}</td>
                      <td className="p-6">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${tx.status === 'Verified' ? 'bg-secondary' : 'bg-outline-variant'}`}></span>
                          <span className={`text-xs font-bold ${tx.status === 'Verified' ? 'text-secondary' : 'text-outline'}`}>{tx.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <footer className="w-full py-12 px-12 mt-auto bg-surface border-t border-surface-container-high flex justify-between items-center">
          <p className="font-body text-xs text-outline">© 2024 Kamikaze Butterfly Weddings. Editorial Sponsor Excellence.</p>
          <div className="flex space-x-8">
            {['Privacy Policy', 'Terms of Service', 'Vendor Guidelines'].map((link) => (
              <a key={link} className="font-body text-xs text-outline hover:text-on-surface transition-opacity" href="#">
                {link}
              </a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}
