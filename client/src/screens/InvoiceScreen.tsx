import * as React from "react";
import { motion } from "motion/react";
import { Card, GlassPanel } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Download, Share2, Printer, CheckCircle2, CreditCard, ChevronLeft, Sparkles, Receipt } from "lucide-react";

export function InvoiceScreen({ onBack }: { onBack: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-4xl mx-auto px-6 py-12 space-y-12"
    >
      <header className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ChevronLeft size={18} />
          Back to Dashboard
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" size="icon" className="rounded-full">
            <Printer size={18} />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Download size={18} />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Share2 size={18} />
          </Button>
        </div>
      </header>

      <Card variant="surface" className="p-0 border border-surface-container-high overflow-hidden shadow-2xl shadow-primary/5">
        <div className="bg-primary p-12 text-on-primary flex justify-between items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-semibold uppercase tracking-widest text-xs opacity-80">
              <Sparkles size={14} />
              <span>Service Invoice</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight">Wildflower <br /> <span className="italic font-normal"> & Vine</span></h1>
          </div>
          <div className="text-right space-y-2">
            <Badge variant="primary" className="bg-white/20 backdrop-blur-md border border-white/30 text-white">Paid</Badge>
            <p className="text-sm opacity-80">Invoice #KB-2026-0042</p>
            <p className="text-sm opacity-80">March 20, 2026</p>
          </div>
        </div>

        <div className="p-12 space-y-12">
          <div className="grid sm:grid-cols-2 gap-12">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Billed To</p>
              <div className="space-y-1">
                <p className="text-xl font-bold">The Smith-Jones Wedding</p>
                <p className="text-on-surface-variant">123 Vineyard Lane</p>
                <p className="text-on-surface-variant">Cape Town, 8001</p>
                <p className="text-on-surface-variant">ernest.nzama@umuzi.org</p>
              </div>
            </div>
            <div className="space-y-4 sm:text-right">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Payment Method</p>
              <div className="flex items-center sm:justify-end gap-3">
                <div className="p-2 bg-surface-container-low rounded-lg">
                  <CreditCard size={20} className="text-primary" />
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-bold">Visa Ending in 4242</p>
                  <p className="text-xs text-on-surface-variant">Exp: 09/28</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Itemized Services</p>
            <div className="divide-y divide-surface-container-high">
              {[
                { desc: 'Artisanal Catering - Full Service', qty: 120, rate: 85, total: 10200 },
                { desc: 'Custom Menu Design & Consultation', qty: 1, rate: 500, total: 500 },
                { desc: 'Professional Staffing (8 hours)', qty: 8, rate: 150, total: 1200 },
                { desc: 'Equipment Rental & Setup', qty: 1, rate: 850, total: 850 },
              ].map((item, i) => (
                <div key={i} className="py-6 flex justify-between items-center group">
                  <div className="space-y-1">
                    <p className="font-bold group-hover:text-primary transition-colors">{item.desc}</p>
                    <p className="text-xs text-on-surface-variant">{item.qty} x ${item.rate.toLocaleString()}</p>
                  </div>
                  <p className="font-bold text-lg">${item.total.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-12">
            <div className="w-full max-w-xs space-y-4">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span>$12,750.00</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Tax (15%)</span>
                <span>$1,912.50</span>
              </div>
              <div className="flex justify-between text-3xl font-bold pt-6 border-t border-surface-container-high">
                <span>Total</span>
                <span className="text-primary">$14,662.50</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low p-12 flex items-center justify-between">
          <div className="flex items-center gap-4 text-green-600">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="font-bold">Payment Confirmed</p>
              <p className="text-xs opacity-80">Transaction ID: TXN-8829-1102</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <Receipt size={18} />
            View Receipt
          </Button>
        </div>
      </Card>

      <footer className="text-center space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Thank you for choosing Kamikaze Butterfly</p>
        <p className="text-xs text-outline-variant max-w-md mx-auto leading-relaxed">
          For any questions regarding this invoice, please contact our support team at support@kamikazebutterfly.com or reach out to the vendor directly.
        </p>
      </footer>
    </motion.div>
  );
}
