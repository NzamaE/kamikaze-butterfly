import * as React from "react";
import { motion } from "motion/react";
import { Button } from "../components/Button";
import { Card, GlassPanel } from "../components/Card";
import { Badge } from "../components/Badge";
import { Star, MapPin, Calendar, Heart, Share2, ChevronLeft, CheckCircle2 } from "lucide-react";
import { MOCK_VENDORS } from "../constants";

export function VendorProfileScreen({ onBack, onBook, vendorId }: { onBack: () => void; onBook: () => void; vendorId?: string }) {
  const vendor = MOCK_VENDORS[0];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 py-12 space-y-12"
    >
      <header className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ChevronLeft size={18} />
          Back to Curated List
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" size="icon" className="rounded-full">
            <Heart size={18} />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Share2 size={18} />
          </Button>
          <Button onClick={onBook} className="gap-2">
            Book Now
          </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        <div className="space-y-12">
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden group">
            <img 
              src={vendor.image} 
              alt={vendor.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <GlassPanel className="absolute bottom-6 left-6 right-6 p-8 flex items-end justify-between">
              <div className="space-y-2">
                <Badge variant="primary">{vendor.category}</Badge>
                <h1 className="text-4xl font-bold text-on-surface">{vendor.name}</h1>
                <div className="flex items-center gap-4 text-sm text-on-surface-variant font-medium">
                  <div className="flex items-center gap-1.5">
                    <Star size={16} className="text-primary fill-primary" />
                    <span>{vendor.rating} (124 reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-primary" />
                    <span>{vendor.location}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Investment</p>
                <p className="text-2xl font-bold text-primary">{vendor.investment}</p>
              </div>
            </GlassPanel>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">About the Artist</h2>
              <p className="text-on-surface-variant leading-relaxed text-lg">
                {vendor.description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {vendor.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                    <CheckCircle2 size={16} className="text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Recent Portfolio</h2>
              <div className="grid grid-cols-2 gap-4">
                {vendor.portfolio.map((img, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden group">
                    <img 
                      src={img} 
                      alt={`Portfolio ${i}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">View Full Portfolio</Button>
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <Card variant="tonal" className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              Availability
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 31 }).map((_, i) => {
                const isAvailable = [15, 22, 5].includes(i + 1);
                return (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      isAvailable 
                        ? 'bg-primary text-on-primary scale-110 shadow-sm' 
                        : 'bg-surface-container-low text-outline-variant'
                    }`}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed italic">
              * Dates in <span className="text-primary font-bold">Primary</span> are available for booking. 
              Contact the artist for specific inquiries.
            </p>
          </Card>

          <Card variant="surface" className="space-y-4 border border-surface-container-high">
            <h3 className="text-lg font-bold">Ready to curate?</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Secure your date with Ethereal Blooms Florist today. Our team will guide you through the next steps.
            </p>
            <Button onClick={onBook} className="w-full">Start Booking Process</Button>
          </Card>
        </aside>
      </div>
    </motion.div>
  );
}
