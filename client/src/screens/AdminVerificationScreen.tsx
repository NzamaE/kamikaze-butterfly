import * as React from "react";
import { motion } from "motion/react";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { CheckCircle2, XCircle, Search, ShieldCheck, ChevronRight, Users, Star, MapPin } from "lucide-react";
import { adminAPI } from "../api/index";

export function AdminVerificationScreen() {
  const [allVendors, setAllVendors] = React.useState<any[]>([]);
  const [pendingVendors, setPendingVendors] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [all, pending] = await Promise.all([
        adminAPI.getAllVendors(),
        adminAPI.getPendingVendors(),
      ]);
      setAllVendors(all);
      setPendingVendors(pending);
    } catch (err: any) {
      console.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (id: string) => {
    setActionLoading(id);
    try {
      await adminAPI.verifyVendor(id);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to verify vendor');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemove = async (id: string) => {
    setActionLoading(id);
    try {
      await adminAPI.removeVendor(id);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to remove vendor');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredVendors = allVendors.filter(v =>
    v.vendor_name?.toLowerCase().includes(search.toLowerCase()) ||
    v.service_type?.toLowerCase().includes(search.toLowerCase()) ||
    v.location?.toLowerCase().includes(search.toLowerCase())
  );

  const verifiedVendors = filteredVendors.filter(v => v.is_verified);

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
          <p className="text-on-surface-variant font-medium">
            Verify and manage the curated network of wedding professionals.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
            <input
              type="text"
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 py-3 bg-surface-container-low border border-transparent rounded-xl focus:bg-surface-container focus:border-primary/20 outline-none transition-all w-64"
            />
          </div>
          <Button variant="outline" className="gap-2" onClick={fetchData}>
            Refresh
          </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_350px] gap-12">
        {/* Active directory table */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">
            Active Directory
            <span className="ml-3 text-sm font-normal text-on-surface-variant">
              {verifiedVendors.length} verified vendors
            </span>
          </h2>
          <Card variant="surface" className="p-0 border border-surface-container-high overflow-hidden">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-14 rounded-2xl bg-surface-container-low animate-pulse" />
                ))}
              </div>
            ) : verifiedVendors.length === 0 ? (
              <div className="p-12 text-center text-on-surface-variant">
                <p className="text-sm font-medium">No verified vendors yet</p>
              </div>
            ) : (
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
                  {verifiedVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {vendor.vendor_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{vendor.vendor_name}</p>
                            <p className="text-xs text-on-surface-variant">
                              {vendor.total_requests} requests
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="tonal" className="capitalize">{vendor.service_type}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          {vendor.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-green-100 text-green-700">Verified</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:bg-red-50 text-xs"
                          onClick={() => handleRemove(vendor.id)}
                          disabled={actionLoading === vendor.id}
                        >
                          {actionLoading === vendor.id ? 'Removing...' : 'Remove'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>

        {/* Pending approvals */}
        <aside className="space-y-8">
          <h2 className="text-2xl font-bold">
            Pending Approvals
            {pendingVendors.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary text-on-primary text-xs font-bold rounded-full">
                {pendingVendors.length}
              </span>
            )}
          </h2>
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-32 rounded-3xl bg-surface-container-low animate-pulse" />
                ))}
              </div>
            ) : pendingVendors.length === 0 ? (
              <Card variant="tonal" className="text-center py-8 space-y-2">
                <p className="text-2xl">✅</p>
                <p className="font-bold text-sm">All caught up!</p>
                <p className="text-xs text-on-surface-variant">No pending vendor approvals</p>
              </Card>
            ) : (
              pendingVendors.map((vendor) => (
                <Card key={vendor.id} variant="tonal" className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary font-bold">
                        {vendor.vendor_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{vendor.vendor_name}</p>
                        <p className="text-xs text-on-surface-variant capitalize">
                          {vendor.service_type} • {vendor.location}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">New</Badge>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {vendor.description || 'No description provided.'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-on-surface-variant mb-2">
                    <span>Base price: <span className="font-bold text-primary">R{Number(vendor.base_price).toLocaleString()}</span></span>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      {vendor.location}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() => handleVerify(vendor.id)}
                      disabled={actionLoading === vendor.id}
                    >
                      <CheckCircle2 size={14} />
                      {actionLoading === vendor.id ? 'Processing...' : 'Approve'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5 text-red-500 hover:bg-red-50"
                      onClick={() => handleRemove(vendor.id)}
                      disabled={actionLoading === vendor.id}
                    >
                      <XCircle size={14} />
                      Reject
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Ecosystem health */}
          <Card variant="surface" className="border border-surface-container-high space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Users size={24} />
              <h3 className="text-lg font-bold">Ecosystem Health</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Total Vendors</span>
                <span className="font-bold">{allVendors.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Verified</span>
                <span className="font-bold text-green-600">{verifiedVendors.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Pending Review</span>
                <span className="font-bold text-primary">{pendingVendors.length}</span>
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