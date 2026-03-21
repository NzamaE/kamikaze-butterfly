import * as React from "react";
import { motion } from "motion/react";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { TrendingUp, TrendingDown, DollarSign, Star, Calendar, MessageSquare, ChevronRight, Bell, Check, X } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { requestsAPI, authAPI } from "../api/index";

export function VendorDashboardScreen() {
  const [requests, setRequests] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const user = authAPI.getCurrentUser();

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await requestsAPI.getVendorRequests();
      setRequests(data);
    } catch (err: any) {
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id: string) => {
    setActionLoading(id);
    try {
      await requestsAPI.accept(id);
      await fetchRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to accept request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await requestsAPI.reject(id);
      await fetchRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to reject request');
    } finally {
      setActionLoading(null);
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const acceptedRequests = requests.filter(r => r.status === 'accepted');
  const totalEarnings = acceptedRequests.reduce((sum, r) => sum + parseFloat(r.quoted_price || 0), 0);

  const metrics = [
    { label: 'Total Earnings', value: `R${totalEarnings.toLocaleString()}`, change: 12, trend: 'up', icon: DollarSign },
    { label: 'Avg Rating', value: '5.0', change: 0.2, trend: 'up', icon: Star },
    { label: 'Pending Requests', value: pendingRequests.length, change: pendingRequests.length, trend: 'up', icon: MessageSquare },
    { label: 'Completed', value: acceptedRequests.length, change: acceptedRequests.length, trend: 'up', icon: TrendingUp },
  ];

  // Build chart data from accepted requests by month
  const chartData = React.useMemo(() => {
    const months: Record<string, number> = {};
    acceptedRequests.forEach((r) => {
      const month = new Date(r.created_at).toLocaleString('default', { month: 'short' });
      months[month] = (months[month] || 0) + parseFloat(r.quoted_price || 0);
    });
    return Object.entries(months).map(([name, value]) => ({ name, value }));
  }, [acceptedRequests]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 py-12 space-y-12"
    >
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold">
            Welcome back, <span className="italic font-normal text-primary">{user?.name || 'Vendor'}</span>
          </h1>
          <p className="text-on-surface-variant font-medium">
            Your wedding season is looking bright. Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="icon" className="relative rounded-full">
            <Bell size={20} />
            {pendingRequests.length > 0 && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-primary border-2 border-surface rounded-full" />
            )}
          </Button>
          <Button className="gap-2" onClick={fetchRequests}>
            <Calendar size={18} />
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
                {metric.change}
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
        {/* Earnings chart */}
        <Card variant="surface" className="border border-surface-container-high space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Financial Insights</h2>
            <Badge variant="tonal">Live</Badge>
          </div>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
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
                  <Area type="monotone" dataKey="value" stroke="#825348" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-on-surface-variant">
                <p className="text-sm font-medium">No earnings data yet</p>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-8">
          {/* Pending requests */}
          <Card variant="tonal" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Pending Requests</h2>
              <Badge variant="tonal">{pendingRequests.length} new</Badge>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="h-16 rounded-2xl bg-surface-container-low animate-pulse" />
                ))}
              </div>
            ) : pendingRequests.length === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-4">
                No pending requests 🎉
              </p>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="p-4 bg-surface-container-low rounded-2xl space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {req.client_name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{req.client_name}</p>
                        <p className="text-xs text-on-surface-variant">
                          {req.plan_name} • {new Date(req.requested_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        R{Number(req.quoted_price).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 gap-2 py-2 text-xs"
                        onClick={() => handleAccept(req.id)}
                        disabled={actionLoading === req.id}
                      >
                        <Check size={14} />
                        {actionLoading === req.id ? 'Processing...' : 'Accept'}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 gap-2 py-2 text-xs"
                        onClick={() => handleReject(req.id)}
                        disabled={actionLoading === req.id}
                      >
                        <X size={14} />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Upcoming bookings */}
          <Card variant="surface" className="border border-surface-container-high space-y-6">
            <h2 className="text-xl font-bold">Upcoming Bookings</h2>
            {acceptedRequests.length === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-4">
                No upcoming bookings yet
              </p>
            ) : (
              <div className="space-y-4">
                {acceptedRequests.slice(0, 3).map((req) => (
                  <div key={req.id} className="flex gap-4">
                    <div className="flex flex-col items-center justify-center w-12 h-14 bg-surface-container-high rounded-xl">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        {new Date(req.requested_date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {new Date(req.requested_date).getDate()}
                      </span>
                    </div>
                    <div className="space-y-1 py-1">
                      <p className="font-bold text-sm">{req.client_name}</p>
                      <p className="text-xs text-on-surface-variant">
                        {req.plan_name} • R{Number(req.quoted_price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button variant="outline" className="w-full gap-2 group">
              View All Bookings
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}