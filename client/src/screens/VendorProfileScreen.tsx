import * as React from "react";
import { motion } from "motion/react";
import { Button } from "../components/Button";
import { Card, GlassPanel } from "../components/Card";
import { Badge } from "../components/Badge";
import { Star, MapPin, Calendar, Heart, Share2, ChevronLeft, CheckCircle2 } from "lucide-react";
import { vendorsAPI } from "../api/index";

export function VendorProfileScreen({ onBack, onBook, vendorId }: { onBack: () => void; onBook: () => void; vendorId?: string }) {
  const [vendor, setVendor] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchVendor = async () => {
      if (!vendorId) return;
      setLoading(true);
      setError('');
      try {
        const data = await vendorsAPI.getById(vendorId);
        setVendor(data);
      } catch (err: any) {
        setError('Failed to load vendor profile');
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [vendorId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        <div className="h-10 w-48 rounded-2xl bg-surface-container-low animate-pulse" />
        <div className="aspect-[16/9] rounded-3xl bg-surface-container-low animate-pulse" />
        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
          <div className="space-y-4">
            <div className="h-6 w-64 rounded-xl bg-surface-container-low animate-pulse" />
            <div className="h-32 rounded-xl bg-surface-container-low animate-pulse" />
          </div>
          <div className="h-96 rounded-3xl bg-surface-container-low animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center space-y-4">
        <p className="text-red-500 font-medium">{error || 'Vendor not found'}</p>
        <Button onClick={onBack}>Go back</Button>
      </div>
    );
  }

  // Build availability set from vendor.availability
  const availableDates = new Set(
    (vendor.availability || [])
      .filter((a: any) => !a.is_booked)
      .map((a: any) => new Date(a.date).getDate())
  );

  const bookedDates = new Set(
    (vendor.availability || [])
      .filter((a: any) => a.is_booked)
      .map((a: any) => new Date(a.date).getDate())
  );

  const features = vendor.description
    ? ['Professional Service', 'Verified Vendor', `Based in ${vendor.location}`, `From R${Number(vendor.base_price).toLocaleString()}`]
    : ['Professional Service', 'Verified Vendor', 'Fully Insured', 'Custom Packages'];

  const portfolio = Array.from({ length: 4 }, (_, i) =>
    `https://picsum.photos/seed/${vendorId}-${i}/400/400`
  );

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
          {/* Hero image */}
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden group">
            <img
              src={`https://picsum.photos/seed/${vendorId}/1200/800`}
              alt={vendor.vendor_name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <GlassPanel className="absolute bottom-6 left-6 right-6 p-8 flex items-end justify-between">
              <div className="space-y-2">
                <Badge variant="primary" className="capitalize">{vendor.service_type}</Badge>
                <h1 className="text-4xl font-bold text-on-surface">{vendor.vendor_name}</h1>
                <div className="flex items-center gap-4 text-sm text-on-surface-variant font-medium">
                  <div className="flex items-center gap-1.5">
                    <Star size={16} className="text-primary fill-primary" />
                    <span>{vendor.total_clients > 0 ? '5.0' : 'New'} ({vendor.total_clients} clients)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-primary" />
                    <span>{vendor.location}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Investment</p>
                <p className="text-2xl font-bold text-primary">From R{Number(vendor.base_price).toLocaleString()}</p>
              </div>
            </GlassPanel>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* About */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">About the Artist</h2>
              <p className="text-on-surface-variant leading-relaxed text-lg">
                {vendor.description || `${vendor.vendor_name} is a verified wedding professional offering premium ${vendor.service_type} services. Based in ${vendor.location}, they bring exceptional quality and attention to detail to every event.`}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                    <CheckCircle2 size={16} className="text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Recent Portfolio</h2>
              <div className="grid grid-cols-2 gap-4">
                {(vendor.gallery?.length > 0
                  ? vendor.gallery.map((g: any) => g.image_url)
                  : portfolio
                ).slice(0, 4).map((img: string, i: number) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden group">
                    <img
                      src={img}
                      alt={`Portfolio ${i + 1}`}
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

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Availability calendar */}
          <Card variant="tonal" className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              Availability
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const isAvailable = availableDates.has(day);
                const isBooked = bookedDates.has(day);
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      isAvailable
                        ? 'bg-primary text-on-primary scale-110 shadow-sm cursor-pointer hover:opacity-90'
                        : isBooked
                        ? 'bg-surface-container-high text-outline-variant line-through'
                        : 'bg-surface-container-low text-outline-variant'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed italic">
              * Dates in <span className="text-primary font-bold">Primary</span> are available for booking.
              Contact the artist for specific inquiries.
            </p>
          </Card>

          {/* Book CTA */}
          <Card variant="surface" className="space-y-4 border border-surface-container-high">
            <h3 className="text-lg font-bold">Ready to curate?</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Secure your date with {vendor.vendor_name} today. Our team will guide you through the next steps.
            </p>
            <Button onClick={onBook} className="w-full">Start Booking Process</Button>
          </Card>
        </aside>
      </div>
    </motion.div>
  );
}