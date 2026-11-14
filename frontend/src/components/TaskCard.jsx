import React from 'react';
import {
  Calendar,
  Check,
  Edit2,
  Trash2,
  AlertCircle,
  Clock
} from 'lucide-react';

const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
  const isCompleted = task.status === 'Completed';

  // Format Due Date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Check if overdue
  const isOverdue =
    task.dueDate &&
    !isCompleted &&
    new Date(task.dueDate).setHours(23, 59, 59, 999) < new Date().getTime();

  // Priority Styles
  const priorityConfig = {
    High: {
      label: 'High Priority',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      dotClass: 'bg-rose-500'
    },
    Medium: {
      label: 'Medium Priority',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      dotClass: 'bg-amber-500'
    },
    Low: {
      label: 'Low Priority',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotClass: 'bg-emerald-500'
    }
  };

  const currentPriority = priorityConfig[task.priority] || priorityConfig.Medium;

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 p-5 shadow-sm hover:shadow-md flex flex-col justify-between ${
        isCompleted
          ? 'border-slate-200 bg-slate-50/50'
          : isOverdue
          ? 'border-rose-200 hover:border-rose-300'
          : 'border-slate-200 hover:border-indigo-200'
      }`}
    >
      <div>
        {/* Top Header: Completion checkbox, Priority Badge & Actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            {/* Toggle Status Checkbox */}
            <button
              onClick={() => onToggle(task._id)}
              title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
              className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                isCompleted
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-200'
                  : 'border-slate-300 hover:border-indigo-500 bg-white'
              }`}
            >
              {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
            </button>

            {/* Priority Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${currentPriority.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${currentPriority.dotClass}`} />
              {currentPriority.label}
            </span>
          </div>

          {/* Action buttons (Edit, Delete) */}
          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              title="Edit Task"
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              title="Delete Task"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task Title */}
        <h3
          className={`text-base font-bold transition-all line-clamp-2 ${
            isCompleted
              ? 'line-through text-slate-400'
              : 'text-slate-800 group-hover:text-indigo-900'
          }`}
        >
          {task.title}
        </h3>

        {/* Task Description */}
        {task.description && (
          <p
            className={`mt-2 text-xs sm:text-sm line-clamp-3 leading-relaxed ${
              isCompleted ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {task.description}
          </p>
        )}
      </div>

      {/* Footer metadata: Due Date & Status indicator */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {/* Due Date */}
        {task.dueDate ? (
          <div
            className={`inline-flex items-center gap-1.5 font-medium ${
              isOverdue
                ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100'
                : isCompleted
                ? 'text-slate-400'
                : 'text-slate-500'
            }`}
          >
            {isOverdue ? (
              <AlertCircle className="w-3.5 h-3.5" />
            ) : (
              <Calendar className="w-3.5 h-3.5" />
            )}
            <span>
              {isOverdue ? 'Overdue: ' : 'Due: '}
              {formatDate(task.dueDate)}
            </span>
          </div>
        ) : (
          <span className="text-slate-400 italic">No due date</span>
        )}

        {/* Status indicator */}
        <span
          className={`inline-flex items-center gap-1 font-semibold ${
            isCompleted ? 'text-emerald-600' : 'text-amber-600'
          }`}
        >
          {isCompleted ? (
            'Completed'
          ) : (
            <>
              <Clock className="w-3 h-3" />
              Pending
            </>
          )}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;

