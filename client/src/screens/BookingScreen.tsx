import * as React from "react";
import { motion } from "motion/react";
import { Button } from "../components/Button";
import { Textarea } from "../components/Input";
import { Card } from "../components/Card";
import { ChevronLeft, ChevronRight, Calendar, Clock, CreditCard, Sparkles } from "lucide-react";
import { requestsAPI, plansAPI, vendorsAPI } from "../api/index";

interface BookingScreenProps {
  onBack: () => void;
  onNext: () => void;
  vendorId?: string;
}

export function BookingScreen({ onBack, onNext, vendorId }: BookingScreenProps) {
  const [date, setDate] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [vendor, setVendor] = React.useState<any>(null);
  const [plan, setPlan] = React.useState<any>(null);
  const [checklistItem, setChecklistItem] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Get vendor details
        if (vendorId) {
          const vendorData = await vendorsAPI.getById(vendorId);
          setVendor(vendorData);
        }

        // Get client's first plan and matching checklist item
        const plans = await plansAPI.getAll();
        if (plans.length > 0) {
          const fullPlan = await plansAPI.getById(plans[0].id);
          setPlan(fullPlan);

          // Find checklist item matching vendor service type
          if (vendorId) {
            const vendorData = await vendorsAPI.getById(vendorId);
            const matchingItem = fullPlan.checklist?.find(
              (item: any) => item.category === vendorData.service_type && item.status === 'pending'
            );
            setChecklistItem(matchingItem || fullPlan.checklist?.[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load booking data');
      }
    };

    fetchData();
  }, [vendorId]);

  const serviceFee = vendor ? Number(vendor.base_price) * 0.1 : 0;
  const total = vendor ? Number(vendor.base_price) + serviceFee : 0;

  const handleSubmit = async () => {
    if (!date) {
      setError('Please select a date');
      return;
    }
    if (!vendorId || !plan || !checklistItem) {
      setError('Missing booking details. Please go back and try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await requestsAPI.create({
        vendor_id: vendorId,
        plan_id: plan.id,
        checklist_item_id: checklistItem.id,
        requested_date: date,
      });
      onNext();
    } catch (err: any) {
      setError(err.message || 'Failed to create booking request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-5xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_350px] gap-12"
    >
      <div className="space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-widest text-xs">
            <Sparkles size={14} />
            <span>Book a Vendor</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            Crafting Your <br />
            <span className="italic font-normal text-primary">Moments</span>
          </h1>
        </div>

        <div className="space-y-8">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">
                Select Date
              </label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => { setDate(e.target.value); setError(''); }}
                  className="w-full bg-surface-container-low border border-transparent rounded-xl pl-12 pr-4 py-3 text-on-surface transition-all focus:bg-surface-container focus:border-primary/20 focus:ring-2 focus:ring-primary/5 outline-none"
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">
                Vendor Service
              </label>
              <div className="w-full bg-surface-container-low border border-transparent rounded-xl px-4 py-3 text-on-surface capitalize">
                {vendor?.service_type || 'Loading...'}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">
              Special Requests
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tell the vendor about your vision, color palettes, or any special requirements..."
              rows={4}
              className="w-full bg-surface-container-low border border-transparent rounded-xl px-4 py-3 text-on-surface transition-all focus:bg-surface-container focus:border-primary/20 focus:ring-2 focus:ring-primary/5 outline-none resize-none"
            />
          </div>

          {/* Vendor availability notice */}
          {vendor?.availability?.length > 0 && (
            <div className="p-4 bg-surface-container-low rounded-2xl space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Available Dates
              </p>
              <div className="flex flex-wrap gap-2">
                {vendor.availability
                  .filter((a: any) => !a.is_booked)
                  .slice(0, 6)
                  .map((a: any) => (
                    <button
                      key={a.id}
                      onClick={() => setDate(a.date.split('T')[0])}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        date === a.date.split('T')[0]
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container text-on-surface-variant hover:bg-primary/10'
                      }`}
                    >
                      {new Date(a.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 font-medium bg-red-50 py-3 px-4 rounded-xl text-center">
              {error}
            </p>
          )}
        </div>

        <div className="pt-8 border-t border-surface-container-high flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ChevronLeft size={18} />
            Back
          </Button>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${i === 2 ? 'w-8 bg-primary' : 'w-2 bg-surface-container-high'}`}
              />
            ))}
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="gap-2 group">
            {loading ? 'Submitting...' : 'Confirm Booking'}
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Sidebar summary */}
      <aside className="space-y-6">
        <Card variant="tonal" className="sticky top-12 space-y-6">
          <div className="aspect-video rounded-2xl overflow-hidden">
            <img
              src={`https://picsum.photos/seed/${vendorId || 'vendor'}/400/300`}
              alt="Vendor"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">{vendor?.vendor_name || 'Loading...'}</h3>
            <p className="text-sm text-on-surface-variant capitalize">
              {vendor?.service_type || ''} services
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-surface-container-highest">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Base Price</span>
              <span className="font-bold">R{Number(vendor?.base_price || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Service Fee (10%)</span>
              <span className="font-bold">R{serviceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-4 border-t border-surface-container-highest">
              <span>Total</span>
              <span className="text-primary">R{total.toLocaleString()}</span>
            </div>
          </div>

          {date && (
            <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl text-xs text-on-surface-variant">
              <Clock size={20} className="text-primary shrink-0" />
              <span>
                Requested for {new Date(date).toLocaleDateString('en-ZA', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl text-xs text-on-surface-variant leading-relaxed">
            <CreditCard size={20} className="text-primary shrink-0" />
            <span>Secure your date with a 20% non-refundable deposit.</span>
          </div>
        </Card>
      </aside>
    </motion.div>
  );
}