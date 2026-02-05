'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Plus, MessageCircle, Clock, CheckCircle, AlertCircle, ChevronRight, Send, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface SupportTicket {
  id: number;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  last_reply: string;
}

// Demo tickets
const demoTickets: SupportTicket[] = [
  {
    id: 1,
    subject: 'Order #123 - Views not delivered',
    status: 'open',
    priority: 'high',
    created_at: '2024-01-15',
    last_reply: '2024-01-15',
  },
  {
    id: 2,
    subject: 'Request for refund',
    status: 'pending',
    priority: 'medium',
    created_at: '2024-01-10',
    last_reply: '2024-01-12',
  },
  {
    id: 3,
    subject: 'How to track my order?',
    status: 'resolved',
    priority: 'low',
    created_at: '2024-01-05',
    last_reply: '2024-01-06',
  },
];

export default function TicketsPage() {
  const router = useRouter();
  const [tickets] = useState<SupportTicket[]>(demoTickets);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    api.setToken(token);
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'resolved':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'closed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Implement actual ticket creation
    alert('Ticket submitted! (Demo mode - not actually saved)');
    
    setNewSubject('');
    setNewMessage('');
    setShowNewTicket(false);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Support Tickets
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get help from our support team
          </p>
        </div>
        <motion.button
          onClick={() => setShowNewTicket(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple text-white font-medium shadow-glow-sm flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          New Ticket
        </motion.button>
      </div>

      {/* New Ticket Form */}
      <AnimatePresence>
        {showNewTicket && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-neon-pink" />
                Create New Ticket
              </h2>
              
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Brief description of your issue"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-neon-pink/50 focus:ring-2 focus:ring-neon-pink/10 transition-all"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Priority
                  </label>
                  <div className="flex gap-3">
                    {(['low', 'medium', 'high'] as const).map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => setNewPriority(priority)}
                        className={`px-4 py-2 rounded-xl border capitalize transition-colors ${
                          newPriority === priority
                            ? 'border-neon-pink bg-neon-pink/10 text-neon-pink'
                            : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20'
                        }`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Message
                  </label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Describe your issue in detail..."
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-neon-pink/50 focus:ring-2 focus:ring-neon-pink/10 transition-all resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-sm flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    Submit Ticket
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => setShowNewTicket(false)}
                    className="px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tickets List */}
      {tickets.length > 0 ? (
        <div className="space-y-3">
          {tickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <Ticket className={`w-5 h-5 ${getPriorityColor(ticket.priority)}`} />
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {ticket.subject}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {ticket.created_at}
                    </span>
                    <span>Last reply: {ticket.last_reply}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium capitalize ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-neon-pink group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
          <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            No support tickets
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Need help? Create a new support ticket.
          </p>
          <motion.button
            onClick={() => setShowNewTicket(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple text-white font-medium shadow-glow-sm"
          >
            Create Ticket
          </motion.button>
        </div>
      )}
    </div>
  );
}
