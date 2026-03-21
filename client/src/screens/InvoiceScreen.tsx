import * as React from "react";
import { motion } from "motion/react";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Download, Share2, Printer, CheckCircle2, CreditCard, ChevronLeft, Sparkles, Receipt, Clock } from "lucide-react";
import { requestsAPI, authAPI } from "../api/index";

export function InvoiceScreen({ onBack }: { onBack: () => void }) {
  const [requests, setRequests] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const user = authAPI.getCurrentUser();

  React.useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await requestsAPI.getClientRequests();
        // Only show requests that have been accepted (have invoices)
        const accepted = data.filter((r: any) => r.status === 'accepted');
        setRequests(accepted);
      } catch (err: any) {
        setError('Failed to load invoices');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        {[1, 2].map(i => (
          <div key={i} className="h-48 rounded-3xl bg-surface-container-low animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center space-y-4">
        <p className="text-red-500 font-medium">{error}</p>
        <Button onClick={onBack}>Go back</Button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto px-6 py-12 space-y-12"
      >
        <header className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ChevronLeft size={18} />
            Back to Dashboard
          </Button>
        </header>
        <div className="text-center py-20 space-y-4">
          <Receipt size={48} className="text-on-surface-variant mx-auto" />
          <h3 className="text-xl font-bold">No invoices yet</h3>
          <p className="text-sm text-on-surface-variant">
            Invoices will appear here once a vendor accepts your service request.
          </p>
          <Button onClick={onBack}>Browse Vendors</Button>
        </div>
      </motion.div>
    );
  }

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

      {/* Render one invoice card per accepted request */}
      {requests.map((request, index) => {
        const serviceFee = Number(request.quoted_price) * 0.1;
        const tax = Number(request.quoted_price) * 0.15;
        const total = Number(request.quoted_price) + serviceFee + tax;

        return (
          <Card
            key={request.id}
            variant="surface"
            className="p-0 border border-surface-container-high overflow-hidden shadow-2xl shadow-primary/5"
          >
            {/* Invoice header */}
            <div className="bg-primary p-12 text-on-primary flex justify-between items-start">
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-semibold uppercase tracking-widest text-xs opacity-80">
                  <Sparkles size={14} />
                  <span>Service Invoice</span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight">
                  {request.vendor_name?.split(' ').slice(0, 2).join(' ')} <br />
                  <span className="italic font-normal">
                    {request.vendor_name?.split(' ').slice(2).join(' ') || 'Services'}
                  </span>
                </h1>
              </div>
              <div className="text-right space-y-2">
                <Badge className={`backdrop-blur-md border border-white/30 text-white ${
                  request.status === 'accepted' ? 'bg-white/20' : 'bg-red-500/40'
                }`}>
                  {request.status === 'accepted' ? 'Confirmed' : request.status}
                </Badge>
                <p className="text-sm opacity-80">
                  Invoice #{`KB-${new Date(request.created_at).getFullYear()}-${String(index + 1).padStart(4, '0')}`}
                </p>
                <p className="text-sm opacity-80">
                  {new Date(request.created_at).toLocaleDateString('en-ZA', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="p-12 space-y-12">
              {/* Billed to / Payment info */}
              <div className="grid sm:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Billed To</p>
                  <div className="space-y-1">
                    <p className="text-xl font-bold">{request.plan_name}</p>
                    <p className="text-on-surface-variant">{user?.name}</p>
                    <p className="text-on-surface-variant">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-4 sm:text-right">
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Service Details</p>
                  <div className="flex items-center sm:justify-end gap-3">
                    <div className="p-2 bg-surface-container-low rounded-lg">
                      <CreditCard size={20} className="text-primary" />
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-bold capitalize">{request.vendor_service}</p>
                      <p className="text-xs text-on-surface-variant">
                        {new Date(request.requested_date).toLocaleDateString('en-ZA', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line items */}
              <div className="space-y-6">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Itemized Services</p>
                <div className="divide-y divide-surface-container-high">
                  <div className="py-6 flex justify-between items-center group">
                    <div className="space-y-1">
                      <p className="font-bold group-hover:text-primary transition-colors capitalize">
                        {request.vendor_service} — Full Service
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {request.vendor_name} • {new Date(request.requested_date).toLocaleDateString('en-ZA')}
                      </p>
                    </div>
                    <p className="font-bold text-lg">R{Number(request.quoted_price).toLocaleString()}</p>
                  </div>
                  <div className="py-6 flex justify-between items-center group">
                    <div className="space-y-1">
                      <p className="font-bold group-hover:text-primary transition-colors">Platform Service Fee</p>
                      <p className="text-xs text-on-surface-variant">10% of base price</p>
                    </div>
                    <p className="font-bold text-lg">R{serviceFee.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end pt-12">
                <div className="w-full max-w-xs space-y-4">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>R{(Number(request.quoted_price) + serviceFee).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>VAT (15%)</span>
                    <span>R{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-3xl font-bold pt-6 border-t border-surface-container-high">
                    <span>Total</span>
                    <span className="text-primary">R{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-surface-container-low p-12 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {request.status === 'accepted' ? (
                  <div className="flex items-center gap-4 text-green-600">
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <p className="font-bold">Booking Confirmed</p>
                      <p className="text-xs opacity-80">
                        Request ID: {request.id.split('-')[0].toUpperCase()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 text-amber-600">
                    <div className="p-3 bg-amber-100 rounded-full">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="font-bold">Awaiting Payment</p>
                      <p className="text-xs opacity-80">Complete payment to confirm booking</p>
                    </div>
                  </div>
                )}
              </div>
              <Button variant="outline" className="gap-2">
                <Receipt size={18} />
                View Receipt
              </Button>
            </div>
          </Card>
        );
      })}

      <footer className="text-center space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          Thank you for choosing Kamikaze Butterfly
        </p>
        <p className="text-xs text-outline-variant max-w-md mx-auto leading-relaxed">
          For any questions regarding this invoice, please contact our support team at support@kamikazebutterfly.com or reach out to the vendor directly.
        </p>
      </footer>
    </motion.div>
  );
}