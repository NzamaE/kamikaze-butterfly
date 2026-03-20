import * as React from "react";
import { motion } from "motion/react";
import { Button } from "../components/Button";
import { Input, Textarea } from "../components/Input";
import { Card } from "../components/Card";
import { ChevronLeft, ChevronRight, Calendar, Clock, CreditCard, Sparkles } from "lucide-react";

export function BookingScreen({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [date, setDate] = React.useState('2026-09-24');
  const [time, setTime] = React.useState('14:00');

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
            <span>Step 2 of 4</span>
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
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-surface-container-low border border-transparent rounded-xl pl-12 pr-4 py-3 text-on-surface transition-all focus:bg-surface-container focus:border-primary/20 focus:ring-2 focus:ring-primary/5 outline-none"
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">
                Select Time
              </label>
              <div className="relative group">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-surface-container-low border border-transparent rounded-xl pl-12 pr-4 py-3 text-on-surface transition-all focus:bg-surface-container focus:border-primary/20 focus:ring-2 focus:ring-primary/5 outline-none"
                />
              </div>
            </div>
          </div>

          <Textarea 
            label="Specific Requests" 
            placeholder="Tell the artist about your vision, color palettes, or any special requirements..." 
          />
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
          <Button onClick={onNext} className="gap-2 group">
            Continue
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      <aside className="space-y-6">
        <Card variant="tonal" className="sticky top-12 space-y-6">
          <div className="aspect-video rounded-2xl overflow-hidden">
            <img 
              src="https://picsum.photos/seed/flowers/400/300" 
              alt="Service" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Ethereal Blooms Florist</h3>
            <p className="text-sm text-on-surface-variant">Full Wedding Floral Design</p>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-surface-container-highest">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Base Investment</span>
              <span className="font-bold">$2,500</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Service Fee (10%)</span>
              <span className="font-bold">$250</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-4 border-t border-surface-container-highest">
              <span>Total</span>
              <span className="text-primary">$2,750</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl text-xs text-on-surface-variant leading-relaxed">
            <CreditCard size={20} className="text-primary shrink-0" />
            <span>Secure your date with a 20% non-refundable deposit.</span>
          </div>
        </Card>
      </aside>
    </motion.div>
  );
}
