import * as React from "react";
import { motion } from "motion/react";
import { Card, GlassPanel } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { CheckCircle2, Circle, Calendar, DollarSign, Clock, ChevronRight, Sparkles, PieChart, TrendingUp } from "lucide-react";
import { MOCK_CHECKLIST } from "../constants";

export function ChecklistScreen() {
  const [checklist, setChecklist] = React.useState(MOCK_CHECKLIST);
  const completedCount = checklist.filter(item => item.completed).length;
  const progress = (completedCount / checklist.length) * 100;

  const toggleItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

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
          <h1 className="text-5xl font-bold tracking-tight">Wedding <span className="italic font-normal text-primary">Checklist</span></h1>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <Calendar size={18} />
            Add Event
          </Button>
          <Button className="gap-2">
            <TrendingUp size={18} />
            Budget Tracker
          </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        <div className="space-y-8">
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

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Upcoming Tasks</h2>
            <div className="space-y-4">
              {checklist.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => toggleItem(item.id)}
                  className={`p-6 rounded-3xl flex items-center justify-between group cursor-pointer transition-all duration-300 ${
                    item.completed 
                      ? 'bg-surface-container-low opacity-60' 
                      : 'bg-surface border border-surface-container-high hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`transition-all duration-300 ${item.completed ? 'text-primary' : 'text-outline-variant group-hover:text-primary'}`}>
                      {item.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                    </div>
                    <div className="space-y-1">
                      <p className={`text-lg font-bold transition-all ${item.completed ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                        {item.title}
                      </p>
                      <div className="flex items-center gap-3">
                        <Badge variant="tonal">{item.category}</Badge>
                        {item.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-on-surface-variant font-medium">
                            <Clock size={14} />
                            <span>Due {item.dueDate}</span>
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

        <aside className="space-y-8">
          <Card variant="tonal" className="space-y-8 text-center py-12">
            <div className="relative inline-flex">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-surface-container-high"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
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
              <h3 className="text-xl font-bold">You're doing great!</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                You've completed {completedCount} out of {checklist.length} tasks. Keep up the momentum!
              </p>
            </div>
            <Button variant="outline" className="w-full">View Detailed Progress</Button>
          </Card>

          <Card variant="surface" className="border border-surface-container-high space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Budget Overview</h3>
              <DollarSign size={20} className="text-primary" />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  <span>Planned</span>
                  <span>$50,000</span>
                </div>
                <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[65%]" />
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  <span>Spent</span>
                  <span className="text-primary">$32,500</span>
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
