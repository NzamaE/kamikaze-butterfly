import * as React from "react";
import { motion } from "motion/react";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { TrendingUp, TrendingDown, Users, DollarSign, Star, ChevronRight, Bell, ShieldCheck, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { adminAPI } from "../api/index";

export function AdminDashboardScreen() {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminAPI.getStats();
      setStats(data);
    } catch (err: any) {
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  // Build category data from revenue_per_vendor
  const categoryData = stats?.revenue_per_vendor?.map((v: any) => ({
    name: v.service_type.charAt(0).toUpperCase() + v.service_type.slice(1),
    value: parseInt(v.total_bookings) || 0,
  })) || [];

  // Build plan status data for chart
  const planStatusData = stats?.plans_by_status?.map((p: any) => ({
    name: p.status.charAt(0).toUpperCase() + p.status.slice(1),
    value: parseInt(p.count),
  })) || [];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 rounded-3xl bg-surface-container-low animate-pulse" />
          ))}
        </div>
        <div className="h-96 rounded-3xl bg-surface-container-low animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center space-y-4">
        <p className="text-red-500 font-medium">{error}</p>
        <Button onClick={fetchStats}>Try again</Button>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Revenue',
      value: `R${Number(stats?.overview?.total_revenue || 0).toLocaleString()}`,
      change: 18,
      trend: 'up',
      icon: DollarSign,
    },
    {
      label: 'Total Clients',
      value: stats?.overview?.total_clients || 0,
      change: 12,
      trend: 'up',
      icon: Users,
    },
    {
      label: 'Total Bookings',
      value: stats?.overview?.total_bookings || 0,
      change: 5,
      trend: 'up',
      icon: TrendingUp,
    },
    {
      label: 'Active Vendors',
      value: stats?.overview?.total_vendors || 0,
      change: 8,
      trend: 'up',
      icon: Star,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 py-12 space-y-12"
    >
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <ShieldCheck size={32} className="text-primary" />
            Command <span className="italic font-normal text-primary">Overview</span>
          </h1>
          <p className="text-on-surface-variant font-medium">
            Platform-wide performance and ecosystem health metrics.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="icon" className="relative rounded-full">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-3 h-3 bg-primary border-2 border-surface rounded-full" />
          </Button>
          <Button className="gap-2" onClick={fetchStats}>
            <Activity size={18} />
            Refresh
          </Button>
        </div>
      </header>

      {/* Metric cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <Card key={i} variant="tonal" className="space-y-4 group hover:scale-105 transition-transform">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-surface-container-low rounded-2xl text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <metric.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-500'
              }`}>
                {metric.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {metric.change}%
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {metric.label}
              </p>
              <p className="text-3xl font-bold">{metric.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        {/* Revenue chart */}
        <Card variant="surface" className="border border-surface-container-high space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Revenue per Vendor</h2>
            <div className="flex gap-2">
              <Badge variant="tonal">Live</Badge>
            </div>
          </div>
          <div className="h-[350px] w-full">
            {stats?.revenue_per_vendor?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.revenue_per_vendor.map((v: any) => ({
                  name: v.vendor_name,
                  value: parseFloat(v.total_revenue) || 0,
                }))}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#825348" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#825348" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e9e4" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5d605c' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5d605c' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#faf9f6', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#825348', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#825348" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-on-surface-variant">
                <p className="text-sm font-medium">No revenue data yet</p>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-8">
          {/* Category bookings */}
          <Card variant="tonal" className="space-y-6">
            <h2 className="text-xl font-bold">Bookings by Service</h2>
            <div className="h-[200px] w-full">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5d605c' }} />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ backgroundColor: '#faf9f6', borderRadius: '12px', border: 'none' }}
                    />
                    <Bar dataKey="value" fill="#825348" radius={[0, 8, 8, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-on-surface-variant">
                  <p className="text-sm font-medium">No bookings yet</p>
                </div>
              )}
            </div>
          </Card>

          {/* Plans by status */}
          <Card variant="surface" className="border border-surface-container-high space-y-6">
            <h2 className="text-xl font-bold">Plans Overview</h2>
            <div className="space-y-4">
              {planStatusData.length > 0 ? planStatusData.map((plan: any, i: number) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    <span>{plan.name}</span>
                    <span>{plan.value}</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(plan.value / (stats?.overview?.total_plans || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              )) : (
                <p className="text-sm text-on-surface-variant text-center py-4">No plans yet</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-4 bg-surface-container-low rounded-2xl">
                <p className="text-2xl font-bold text-primary">{stats?.overview?.total_plans || 0}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-1">Total Plans</p>
              </div>
              <div className="text-center p-4 bg-surface-container-low rounded-2xl">
                <p className="text-2xl font-bold text-primary">{stats?.overview?.total_public_plans || 0}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-1">Public Plans</p>
              </div>
            </div>
            <Button  variant="outline" className="w-full gap-2 group">
              Manage Platform
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}