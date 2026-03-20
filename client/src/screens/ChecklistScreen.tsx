import * as React from "react";
import { motion } from "motion/react";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { CheckCircle2, Circle, Calendar, DollarSign, Clock, ChevronRight, Sparkles, TrendingUp } from "lucide-react";
import { plansAPI } from "../api/index";

export function ChecklistScreen() {
  const [plan, setPlan] = React.useState<any>(null);
  const [checklist, setChecklist] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const fetchPlan = async () => {
    setLoading(true);
    setError('');
    try {
      // Get all plans then load the first one
      const plans = await plansAPI.getAll();
      if (plans.length === 0) {
        setError('No wedding plan found. Please create one first!');
        return;
      }
      const fullPlan = await plansAPI.getById(plans[0].id);
      setPlan(fullPlan);
      setChecklist(fullPlan.checklist || []);
    } catch (err: any) {
      setError('Failed to load your checklist');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPlan();
  }, []);

  const completedCount = checklist.filter(item => item.status === 'complete').length;
  const progress = checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;
  const totalSpent = plan?.total_spent || 0;
  const budget = plan?.budget || 0;
  const budgetPercent = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 rounded-3xl bg-surface-container-low animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center space-y-4">
        <p className="text-2xl">💍</p>
        <h3 className="text-xl font-bold">{error}</h3>
        <Button onClick={fetchPlan}>Try again</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 py-12 space-y-12"
    >
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-widest text-xs">
            <Sparkles size={14} />
            <span>The Grand Countdown</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            Wedding <span className="italic font-normal text-primary">Checklist</span>
          </h1>
          {plan && (
            <p className="text-on-surface-variant text-sm font-medium">{plan.name}</p>
          )}
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <Calendar size={18} />
            {plan?.wedding_date ? new Date(plan.wedding_date).toLocaleDateString() : 'No date set'}
          </Button>
          <Button className="gap-2">
            <TrendingUp size={18} />
            Budget Tracker
          </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-6">
            <Card variant="tonal" className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Total Tasks</p>
              <p className="text-4xl font-bold text-primary">{checklist.length}</p>
            </Card>
            <Card variant="tonal" className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Completed</p>
              <p className="text-4xl font-bold text-primary">{completedCount}</p>
            </Card>
            <Card variant="tonal" className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Remaining</p>
              <p className="text-4xl font-bold text-primary">{checklist.length - completedCount}</p>
            </Card>
          </div>

          {/* Checklist items */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Planning Tasks</h2>
            <div className="space-y-4">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className={`p-6 rounded-3xl flex items-center justify-between group cursor-pointer transition-all duration-300 ${
                    item.status === 'complete'
                      ? 'bg-surface-container-low opacity-60'
                      : item.status === 'in_progress'
                      ? 'bg-surface border border-primary/30 shadow-lg shadow-primary/5'
                      : 'bg-surface border border-surface-container-high hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`transition-all duration-300 ${
                      item.status === 'complete' ? 'text-primary' :
                      item.status === 'in_progress' ? 'text-amber-500' :
                      'text-outline-variant group-hover:text-primary'
                    }`}>
                      {item.status === 'complete'
                        ? <CheckCircle2 size={28} />
                        : <Circle size={28} />
                      }
                    </div>
                    <div className="space-y-1">
                      <p className={`text-lg font-bold transition-all ${
                        item.status === 'complete' ? 'line-through text-on-surface-variant' : 'text-on-surface'
                      }`}>
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </p>
                      <div className="flex items-center gap-3">
                        <Badge variant="tonal" className={
                          item.status === 'complete' ? 'bg-green-100 text-green-700' :
                          item.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                          ''
                        }>
                          {item.status === 'complete' ? 'Done' :
                           item.status === 'in_progress' ? 'In Progress' :
                           'Pending'}
                        </Badge>
                        {item.vendor_name && (
                          <div className="flex items-center gap-1 text-xs text-on-surface-variant font-medium">
                            <Clock size={14} />
                            <span>{item.vendor_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-outline-variant group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Progress ring */}
          <Card variant="tonal" className="space-y-8 text-center py-12">
            <div className="relative inline-flex">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96" cy="96" r="88"
                  stroke="currentColor" strokeWidth="12"
                  fill="transparent"
                  className="text-surface-container-high"
                />
                <circle
                  cx="96" cy="96" r="88"
                  stroke="currentColor" strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={552.92}
                  strokeDashoffset={552.92 - (552.92 * progress) / 100}
                  className="text-primary transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                <span className="text-4xl font-bold text-primary">{Math.round(progress)}%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Complete</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">
                {progress === 100 ? "You're all set! 🎉" : "You're doing great!"}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {completedCount} of {checklist.length} tasks complete. Keep going!
              </p>
            </div>
            <Button variant="outline" className="w-full">View Detailed Progress</Button>
          </Card>

          {/* Budget overview */}
          <Card variant="surface" className="border border-surface-container-high space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Budget Overview</h3>
              <DollarSign size={20} className="text-primary" />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  <span>Budget</span>
                  <span>R{Number(budget).toLocaleString()}</span>
                </div>
                <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-700"
                    style={{ width: `${budgetPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  <span>Spent</span>
                  <span className="text-primary">R{Number(totalSpent).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <Button className="w-full">Manage Budget</Button>
          </Card>
        </aside>
      </div>
    </motion.div>
  );
}