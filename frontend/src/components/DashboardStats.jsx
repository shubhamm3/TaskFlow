import React from 'react';
import { Layers, Clock, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

const DashboardStats = ({ stats, activeFilter, onFilterChange }) => {
  const {
    total = 0,
    pending = 0,
    completed = 0,
    highPriority = 0,
    completionRate = 0
  } = stats || {};

  const cards = [
    {
      id: 'all',
      title: 'Total Tasks',
      value: total,
      label: 'All created tasks',
      icon: Layers,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
      activeBorder: 'ring-2 ring-indigo-500 border-indigo-500'
    },
    {
      id: 'Pending',
      title: 'Pending Tasks',
      value: pending,
      label: 'Needs attention',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      activeBorder: 'ring-2 ring-amber-500 border-amber-500'
    },
    {
      id: 'Completed',
      title: 'Completed Tasks',
      value: completed,
      label: 'Successfully done',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      activeBorder: 'ring-2 ring-emerald-500 border-emerald-500'
    },
    {
      id: 'high-priority',
      title: 'High Priority',
      value: highPriority,
      label: 'Urgent priority',
      icon: AlertTriangle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100',
      activeBorder: 'ring-2 ring-rose-500 border-rose-500'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const isActive =
            (card.id === 'all' && activeFilter.status === 'all' && activeFilter.priority === 'all') ||
            (card.id === 'Pending' && activeFilter.status === 'Pending') ||
            (card.id === 'Completed' && activeFilter.status === 'Completed') ||
            (card.id === 'high-priority' && activeFilter.priority === 'High');

          return (
            <button
              key={card.id}
              onClick={() => {
                if (card.id === 'all') {
                  onFilterChange({ status: 'all', priority: 'all' });
                } else if (card.id === 'high-priority') {
                  onFilterChange({ priority: 'High' });
                } else {
                  onFilterChange({ status: card.id });
                }
              }}
              className={`text-left p-5 rounded-2xl bg-white border ${card.borderColor} shadow-sm hover:shadow-md transition-all duration-200 ${
                isActive ? card.activeBorder : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {card.title}
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
                    {card.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 font-medium">
                    {card.label}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.bgColor} ${card.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Completion Rate Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Overall Completion Rate</h4>
            <p className="text-xs text-slate-300">
              {completed} of {total} tasks completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-1 md:max-w-md">
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 to-indigo-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className="text-sm font-bold min-w-[45px] text-right text-emerald-300">
            {completionRate}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;

