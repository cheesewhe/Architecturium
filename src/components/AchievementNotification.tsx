import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '../types';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="achievement-notification"
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="achievement-notification-content">
          <div className="achievement-notification-icon">{achievement.icon}</div>
          <div className="achievement-notification-text">
            <div className="achievement-notification-title">Достижение разблокировано!</div>
            <div className="achievement-notification-name">{achievement.name}</div>
            <div className="achievement-notification-description">{achievement.description}</div>
          </div>
          <button className="achievement-notification-close" onClick={onClose}>×</button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AchievementNotification;

