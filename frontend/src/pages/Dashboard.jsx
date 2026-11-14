import React, { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import DashboardStats from '../components/DashboardStats';
import TaskFilter from '../components/TaskFilter';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { Plus, ListTodo, AlertCircle, Loader2, CheckCircle, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    highPriority: 0,
    completionRate: 0
  });

  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
    sort: 'newest'
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Delete confirmation modal state
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Show auto-dismissing toast notification
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast('');
    }, 3500);
  };

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const { data } = await API.get('/tasks/stats');
      if (data?.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Fetch Tasks with query params
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.priority !== 'all') params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;

      const { data } = await API.get('/tasks', { params });
      if (data?.success) {
        setTasks(data.tasks);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to fetch tasks. Please check server.'
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      search: '',
      sort: 'newest'
    });
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Create or Update Task submit
  const handleModalSubmit = async (taskData) => {
    if (editingTask) {
      const { data } = await API.put(`/tasks/${editingTask._id}`, taskData);
      showToast('Task updated successfully!');
    } else {
      const { data } = await API.post('/tasks', taskData);
      showToast('Task created successfully!');
    }
    fetchTasks();
    fetchStats();
  };

  // Toggle Task Completion (Pending <-> Completed)
  const handleToggleTask = async (taskId) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId
            ? {
                ...t,
                status: t.status === 'Completed' ? 'Pending' : 'Completed'
              }
            : t
        )
      );

      const { data } = await API.patch(`/tasks/${taskId}/toggle`);
      showToast(data.message || 'Status updated');
      fetchStats();
    } catch (err) {
      showToast('Failed to update task status');
      fetchTasks(); // rollback
    }
  };

  // Confirm and Execute Delete Task
  const confirmDeleteTask = async () => {
    if (!deletingTaskId) return;
    try {
      setIsDeleting(true);
      await API.delete(`/tasks/${deletingTaskId}`);
      showToast('Task deleted successfully');
      setDeletingTaskId(null);
      fetchTasks();
      fetchStats();
    } catch (err) {
      showToast('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Task Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your tasks, track progress, and organize priorities
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Task</span>
          </button>
        </div>

        {/* Dashboard Metrics (Total, Pending, Completed, High Priority) */}
        <DashboardStats
          stats={stats}
          activeFilter={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Filters, Search & Sort */}
        <TaskFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">{error}</p>
              <p className="text-xs mt-0.5 text-rose-600">
                Please make sure backend server is running and database is connected.
              </p>
            </div>
            <button
              onClick={fetchTasks}
              className="px-3 py-1 bg-white border border-rose-300 rounded-lg text-xs font-semibold hover:bg-rose-100"
            >
              Retry
            </button>
          </div>
        )}

        {/* Task Grid / List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-sm font-medium text-slate-500">Loading your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-300 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-4">
              <ListTodo className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No tasks found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">
              {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                ? 'Try adjusting your filters or search keywords to find what you are looking for.'
                : 'Get started by creating your very first task to track your progress.'}
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add First Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={handleToggleTask}
                onEdit={handleOpenEditModal}
                onDelete={(id) => setDeletingTaskId(id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Task Modal (Create & Edit) */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialTask={editingTask}
      />

      {/* Delete Confirmation Modal */}
      {deletingTaskId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete Task?</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingTaskId(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTask}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-200 transition-all disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

