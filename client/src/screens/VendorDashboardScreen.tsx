import * as React from "react";
import { motion } from "motion/react";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { TrendingUp, TrendingDown, Users, DollarSign, Star, Calendar, MessageSquare, ChevronRight, Bell } from "lucide-react";
import { VENDOR_METRICS, MOCK_REQUESTS } from "../constants";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 8000 },
];

export function VendorDashboardScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 py-12 space-y-12"
    >
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold">Welcome back, <span className="italic font-normal text-primary">Julian's Floral Design</span></h1>
          <p className="text-on-surface-variant font-medium">Your wedding season is looking bright. Here's what's happening today.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="icon" className="relative rounded-full">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-3 h-3 bg-primary border-2 border-surface rounded-full" />
          </Button>
          <Button className="gap-2">
            <Calendar size={18} />
            Manage Schedule
          </Button>
        </div>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {VENDOR_METRICS.map((metric, i) => (
          <Card key={i} variant="tonal" className="space-y-4 group hover:scale-105 transition-transform">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-surface-container-low rounded-2xl text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                {i === 0 && <DollarSign size={24} />}
                {i === 1 && <Star size={24} />}
                {i === 2 && <MessageSquare size={24} />}
                {i === 3 && <TrendingUp size={24} />}
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
            <h2 className="text-2xl font-bold">Financial Insights</h2>
            <div className="flex gap-2">
              <Badge variant="tonal">Monthly</Badge>
              <Badge variant="outline">Yearly</Badge>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="value" stroke="#825348" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-8">
          <Card variant="tonal" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Pending Requests</h2>
              <Button variant="ghost" size="sm" className="text-xs uppercase tracking-widest font-bold text-primary">View All</Button>
            </div>
            <div className="space-y-4">
              {MOCK_REQUESTS.map((req) => (
                <div key={req.id} className="p-4 bg-surface-container-low rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-surface-container transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {req.clientId.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{req.serviceName}</p>
                      <p className="text-xs text-on-surface-variant">{req.date} • {req.time}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-outline-variant group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </Card>

          <Card variant="surface" className="border border-surface-container-high space-y-6">
            <h2 className="text-xl font-bold">Upcoming Schedule</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center justify-center w-12 h-14 bg-surface-container-high rounded-xl">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Sep</span>
                    <span className="text-xl font-bold text-primary">{24 + i}</span>
                  </div>
                  <div className="space-y-1 py-1">
                    <p className="font-bold text-sm">The Smith-Jones Wedding</p>
                    <p className="text-xs text-on-surface-variant">Full Floral Installation • 09:00 AM</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
