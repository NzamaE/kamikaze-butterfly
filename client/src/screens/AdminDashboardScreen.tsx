import * as React from "react";
import { motion } from "motion/react";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { TrendingUp, TrendingDown, Users, DollarSign, Star, Calendar, MessageSquare, ChevronRight, Bell, ShieldCheck, PieChart, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

const revenueData = [
  { name: 'Jan', value: 45000 },
  { name: 'Feb', value: 52000 },
  { name: 'Mar', value: 48000 },
  { name: 'Apr', value: 61000 },
  { name: 'May', value: 55000 },
  { name: 'Jun', value: 67000 },
  { name: 'Jul', value: 72000 },
];

const categoryData = [
  { name: 'Venues', value: 40 },
  { name: 'Photo', value: 25 },
  { name: 'Floral', value: 20 },
  { name: 'Catering', value: 15 },
];

export function AdminDashboardScreen() {
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
          <p className="text-on-surface-variant font-medium">Platform-wide performance and ecosystem health metrics.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="icon" className="relative rounded-full">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-3 h-3 bg-primary border-2 border-surface rounded-full" />
          </Button>
          <Button className="gap-2">
            <Activity size={18} />
            System Status
          </Button>
        </div>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '$452,450', change: 18, trend: 'up', icon: DollarSign },
          { label: 'Active Users', value: '12,450', change: 12, trend: 'up', icon: Users },
          { label: 'Vendor Growth', value: '24%', change: 5, trend: 'up', icon: TrendingUp },
          { label: 'Avg Rating', value: '4.85', change: 0.1, trend: 'up', icon: Star },
        ].map((metric, i) => (
          <Card key={i} variant="tonal" className="space-y-4 group hover:scale-105 transition-transform">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-surface-container-low rounded-2xl text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <metric.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${metric.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                {metric.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {metric.change}%
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{metric.label}</p>
              <p className="text-3xl font-bold">{metric.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <Card variant="surface" className="border border-surface-container-high space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Revenue Analytics</h2>
            <div className="flex gap-2">
              <Badge variant="tonal">Monthly</Badge>
              <Badge variant="outline">Yearly</Badge>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#825348" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#825348" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e9e4" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5d605c' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5d605c' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#faf9f6', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#825348', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#825348" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-8">
          <Card variant="tonal" className="space-y-6">
            <h2 className="text-xl font-bold">Category Distribution</h2>
            <div className="h-[200px] w-full">
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
            </div>
            <div className="space-y-3">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">{cat.name}</span>
                  <span className="font-bold">{cat.value}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="surface" className="border border-surface-container-high space-y-6">
            <h2 className="text-xl font-bold">Active Plans</h2>
            <div className="space-y-4">
              {[
                { name: 'Elite Curator', count: 450, color: 'bg-primary' },
                { name: 'Professional', count: 1240, color: 'bg-secondary' },
                { name: 'Essential', count: 3500, color: 'bg-surface-container-high' },
              ].map((plan, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    <span>{plan.name}</span>
                    <span>{plan.count}</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                    <div className={`h-full ${plan.color}`} style={{ width: `${(plan.count / 5190) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full gap-2 group">
              Manage Subscriptions
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
