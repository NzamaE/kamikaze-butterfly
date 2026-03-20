import * as React from "react";
import { motion } from "motion/react";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { CheckCircle2, XCircle, Search, Filter, MoreVertical, ShieldCheck, ChevronRight, Users, Star, MapPin } from "lucide-react";
import { MOCK_VENDORS } from "../constants";

export function AdminVerificationScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="max-w-7xl mx-auto px-6 py-12 space-y-12"
    >
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <ShieldCheck size={32} className="text-primary" />
            Vendor <span className="italic font-normal text-primary">Ecosystem</span>
          </h1>
          <p className="text-on-surface-variant font-medium">Verify and manage the curated network of wedding professionals.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
            <input 
              type="text" 
              placeholder="Search vendors..." 
              className="pl-12 pr-4 py-3 bg-surface-container-low border border-transparent rounded-xl focus:bg-surface-container focus:border-primary/20 outline-none transition-all w-64"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter size={18} />
            Filters
          </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_350px] gap-12">
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Active Directory</h2>
          <Card variant="surface" className="p-0 border border-surface-container-high overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-container-high">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Vendor</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Category</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Location</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {MOCK_VENDORS.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={vendor.image} 
                          alt={vendor.name} 
                          className="w-10 h-10 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-sm">{vendor.name}</p>
                          <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                            <Star size={12} className="text-primary fill-primary" />
                            <span>{vendor.rating}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="tonal">{vendor.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        {vendor.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="primary" className="bg-green-100 text-green-700">Verified</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreVertical size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <aside className="space-y-8">
          <h2 className="text-2xl font-bold">Pending Approvals</h2>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <Card key={i} variant="tonal" className="space-y-4 hover:scale-105 transition-transform cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary font-bold">
                      {i === 1 ? 'JF' : 'WV'}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{i === 1 ? "Julian's Floral" : "Wildflower & Vine"}</p>
                      <p className="text-xs text-on-surface-variant">Applied 2 days ago</p>
                    </div>
                  </div>
                  <Badge variant="outline">New</Badge>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Submitted full portfolio and business verification documents for review.
                </p>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 gap-1.5">
                    <CheckCircle2 size={14} />
                    Approve
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-red-500 hover:bg-red-50">
                    <XCircle size={14} />
                    Reject
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Card variant="surface" className="border border-surface-container-high space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Users size={24} />
              <h3 className="text-lg font-bold">Ecosystem Health</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Total Vendors</span>
                <span className="font-bold">1,240</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Pending Review</span>
                <span className="font-bold text-primary">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Avg Rating</span>
                <span className="font-bold">4.85</span>
              </div>
            </div>
            <Button variant="outline" className="w-full gap-2 group">
              View Analytics
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </aside>
      </div>
    </motion.div>
  );
}
