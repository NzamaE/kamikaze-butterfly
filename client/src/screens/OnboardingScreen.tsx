import * as React from "react";
import { motion } from "motion/react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Card } from "../components/Card";
import { ChevronRight, Sparkles } from "lucide-react";

export function OnboardingScreen({ onNext }: { onNext: () => void }) {
  const [investment, setInvestment] = React.useState(50000);
  const aesthetics = ['Minimalist', 'Bohemian', 'Classic', 'Avant-Garde', 'Rustic', 'Ethereal'];
  const [selectedAesthetic, setSelectedAesthetic] = React.useState('Ethereal');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-12"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-widest text-xs">
          <Sparkles size={14} />
          <span>Step 1 of 4</span>
        </div>
        <h1 className="text-5xl font-bold leading-tight tracking-tight">
          Start Your <br />
          <span className="italic font-normal text-primary">Journey Together</span>
        </h1>
        <p className="text-on-surface-variant text-lg max-w-md leading-relaxed">
          Tell us about your celebration. We'll curate a selection of vendors that match your unique vision.
        </p>
      </div>

      <div className="grid gap-8">
        <div className="grid sm:grid-cols-2 gap-6">
          <Input label="Celebration Name" placeholder="e.g. The Smith-Jones Wedding" />
          <Input label="Location" placeholder="e.g. Cape Town, SA" />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">
              Investment Range
            </label>
            <span className="text-primary font-bold text-xl">${investment.toLocaleString()}</span>
          </div>
          <input 
            type="range" 
            min="5000" 
            max="200000" 
            step="5000"
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            className="w-full h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] uppercase tracking-tighter text-outline font-bold">
            <span>$5k</span>
            <span>$200k+</span>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">
            Visual Aesthetic
          </label>
          <div className="flex flex-wrap gap-3">
            {aesthetics.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedAesthetic(style)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedAesthetic === style 
                    ? 'bg-primary text-on-primary scale-105 shadow-lg shadow-primary/20' 
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-surface-container-high flex items-center justify-between">
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all ${i === 1 ? 'w-8 bg-primary' : 'w-2 bg-surface-container-high'}`} 
            />
          ))}
        </div>
        <Button onClick={onNext} className="gap-2 group">
          Continue
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}
