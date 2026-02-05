'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Users,
  Clock,
  MessageCircle,
  Play,
  CheckCircle2,
  Zap,
  Globe,
} from 'lucide-react';

interface LiveNotificationProps {
  serviceType: string;
  colors: {
    gradient: string;
    glow: string;
    bg: string;
  };
}

interface Notification {
  id: number;
  type: string;
  quantity: number;
  location: string;
  timeAgo: string;
}

const serviceIcons: Record<string, React.ElementType> = {
  views: Eye,
  subscribers: Users,
  watch_time: Clock,
  comments: MessageCircle,
  default: Play,
};

const serviceLabels: Record<string, string> = {
  views: 'views',
  subscribers: 'subscribers',
  watch_time: 'watch hours',
  comments: 'comments',
  default: 'units',
};

const locations = [
  'United States',
  'United Kingdom',
  'Canada',
  'Germany',
  'France',
  'Australia',
  'Netherlands',
  'Spain',
  'Italy',
  'Brazil',
  'Mexico',
  'India',
  'Japan',
  'South Korea',
  'Singapore',
];

const generateNotification = (id: number, serviceType: string): Notification => {
  const quantityRanges: Record<string, [number, number]> = {
    views: [100, 5000],
    subscribers: [50, 500],
    watch_time: [10, 100],
    comments: [5, 50],
    default: [50, 500],
  };

  const [min, max] = quantityRanges[serviceType] || quantityRanges.default;
  const quantity = Math.floor(Math.random() * (max - min) + min);
  const timeAgo = Math.floor(Math.random() * 15) + 1;
  const location = locations[Math.floor(Math.random() * locations.length)];

  return {
    id,
    type: serviceType,
    quantity,
    location,
    timeAgo: timeAgo === 1 ? '1 minute' : `${timeAgo} minutes`,
  };
};

export function LiveNotification({ serviceType, colors }: LiveNotificationProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [counter, setCounter] = useState(100); // Start at 100 to avoid collision with initial IDs

  const Icon = serviceIcons[serviceType] || serviceIcons.default;
  const label = serviceLabels[serviceType] || serviceLabels.default;

  useEffect(() => {
    // Initial notifications with unique IDs starting from 1
    const initial = Array.from({ length: 3 }, (_, i) =>
      generateNotification(i + 1, serviceType)
    );
    setNotifications(initial);

    // Add new notification every 8-15 seconds
    const interval = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, Math.random() * 7000 + 8000);

    return () => clearInterval(interval);
  }, [serviceType]);

  useEffect(() => {
    if (counter > 100) {
      const newNotification = generateNotification(counter, serviceType);
      setNotifications((prev) => [newNotification, ...prev.slice(0, 2)]);
    }
  }, [counter, serviceType]);

  return (
    <div className="fixed bottom-6 left-6 z-50 space-y-3 max-w-xs pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{
              opacity: index === 0 ? 1 : 0.6,
              x: 0,
              scale: index === 0 ? 1 : 0.95,
            }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
            className="pointer-events-auto"
          >
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-white/95 backdrop-blur-lg border border-gray-200 ${
                index === 0 ? 'shadow-card-hover' : 'shadow-card'
              }`}
              style={{
                boxShadow: index === 0 ? `0 4px 20px ${colors.glow}20` : undefined,
              }}
            >
              {/* Icon */}
              <motion.div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center flex-shrink-0 shadow-glow-sm`}
              >
                <Icon className="w-5 h-5 text-white" />
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {notification.quantity.toLocaleString()}
                  </span>
                  <span className="text-gray-600 text-sm">{label} delivered</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Globe className="w-3 h-3" />
                  <span className="truncate">{notification.location}</span>
                  <span>•</span>
                  <span>{notification.timeAgo} ago</span>
                </div>
              </div>

              {/* Status */}
              {index === 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex-shrink-0"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Live counter component for trust bar
interface LiveCounterProps {
  serviceType: string;
  colors: {
    gradient: string;
    glow: string;
    bg: string;
  };
}

export function LiveCounter({ serviceType, colors }: LiveCounterProps) {
  const [count, setCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const label = serviceLabels[serviceType] || serviceLabels.default;

  useEffect(() => {
    // Random starting number
    const startCount = Math.floor(Math.random() * 5000) + 10000;
    setCount(startCount);
    setDisplayCount(startCount);

    // Increment randomly every few seconds
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 500) + 100;
      setCount((prev) => prev + increment);
    }, Math.random() * 3000 + 2000);

    return () => clearInterval(interval);
  }, []);

  // Animate display count
  useEffect(() => {
    const diff = count - displayCount;
    if (diff > 0) {
      const step = Math.ceil(diff / 20);
      const timer = setTimeout(() => {
        setDisplayCount((prev) => Math.min(prev + step, count));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [count, displayCount]);

  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-card"
      whileHover={{ borderColor: 'rgb(209, 213, 219)' }}
    >
      <motion.div
        className="w-3 h-3 rounded-full bg-green-500"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-500" />
        <span className="text-gray-900 font-semibold">{displayCount.toLocaleString()}</span>
        <span className="text-gray-600 text-sm">{label} delivered today</span>
      </div>
    </motion.div>
  );
}

// Mini notification for inline display
interface MiniNotificationProps {
  serviceType: string;
  colors: {
    gradient: string;
    glow: string;
    bg: string;
  };
}

export function MiniNotification({ serviceType, colors }: MiniNotificationProps) {
  const [notification, setNotification] = useState<Notification | null>(null);
  const Icon = serviceIcons[serviceType] || serviceIcons.default;
  const label = serviceLabels[serviceType] || serviceLabels.default;

  useEffect(() => {
    // Generate initial notification
    setNotification(generateNotification(0, serviceType));

    // Update every 10-20 seconds
    const interval = setInterval(() => {
      setNotification(generateNotification(Date.now(), serviceType));
    }, Math.random() * 10000 + 10000);

    return () => clearInterval(interval);
  }, [serviceType]);

  if (!notification) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={notification.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm"
      >
        <motion.div
          className={`w-6 h-6 rounded-md bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}
        >
          <Icon className="w-3 h-3 text-white" />
        </motion.div>
        <span className="text-xs text-gray-700">
          <span className="font-semibold">{notification.quantity.toLocaleString()}</span>
          {' '}{label} • {notification.timeAgo} ago
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
