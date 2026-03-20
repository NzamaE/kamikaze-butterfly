import * as React from "react";
import { motion } from "motion/react";
import { Card, GlassPanel } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Search, Filter, Star, MapPin, Heart, ChevronRight, Sparkles, SlidersHorizontal } from "lucide-react";
import { MOCK_VENDORS } from "../constants";

export function CuratedVendorsScreen({ onVendorClick }: { onVendorClick: (id: string) => void }) {
  const categories = ['All', 'Florists', 'Catering', 'Photography', 'Venues', 'Attire'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 py-12 space-y-12"
    >
      <header className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-widest text-xs">
              <Sparkles size={14} />
              <span>Recommended for you</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight">Curated <span className="italic font-normal text-primary">Vendors</span></h1>
          </div>
          <div className="flex gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or style..." 
                className="pl-12 pr-4 py-4 bg-surface-container-low border border-transparent rounded-2xl focus:bg-surface-container focus:border-primary/20 outline-none transition-all w-80"
              />
            </div>
            <Button variant="outline" className="gap-2 rounded-2xl py-4">
              <SlidersHorizontal size={18} />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 scale-105' 
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_VENDORS.map((vendor) => (
          <Card 
            key={vendor.id} 
            variant="surface" 
            className="p-0 border border-surface-container-high overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2"
            onClick={() => onVendorClick(vendor.id)}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img 
                src={vendor.image} 
                alt={vendor.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-4 right-4">
                <Button variant="outline" size="icon" className="rounded-full bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/40">
                  <Heart size={18} />
                </Button>
              </div>
              <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <Button className="w-full gap-2">
                  View Profile
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <Badge variant="tonal">{vendor.category}</Badge>
                  <h3 className="text-xl font-bold">{vendor.name}</h3>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-primary">
                  <Star size={14} className="fill-primary" />
                  <span>{vendor.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary" />
                  <span>{vendor.location}</span>
                </div>
                <span className="text-primary">{vendor.investment}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
