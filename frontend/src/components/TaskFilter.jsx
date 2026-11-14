import React from 'react';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';

const TaskFilter = ({ filters, onFilterChange, onReset }) => {
  const isFiltered =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.search !== '' ||
    filters.sort !== 'newest';

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Status Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs sm:text-sm font-medium self-start w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'Pending', label: 'Pending' },
            { id: 'Completed', label: 'Completed' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onFilterChange({ status: tab.id })}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg transition-all ${
                filters.status === tab.id
                  ? 'bg-white text-indigo-700 font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search tasks by title or details..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Secondary Controls: Priority & Sort & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Priority filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500 font-medium">Priority:</span>
            <select
              value={filters.priority}
              onChange={(e) => onFilterChange({ priority: e.target.value })}
              className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={filters.sort}
              onChange={(e) => onFilterChange({ sort: e.target.value })}
              className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="dueDateAsc">Due Date (Earliest)</option>
              <option value="dueDateDesc">Due Date (Latest)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
          >
            <X className="w-3.5 h-3.5" />
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilter;

