import { motion, AnimatePresence } from 'framer-motion';
import { GameEvent } from '../types';
import { getEventIcon, getEventColor } from '../utils/events';

interface EventNotificationProps {
  event: GameEvent;
  onShow: () => void;
}

function EventNotification({ event, onShow }: EventNotificationProps) {
  const icon = getEventIcon(event.type);
  const color = getEventColor(event.type);

  return (
    <AnimatePresence>
      <motion.div
        className="event-notification"
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        onClick={onShow}
        style={{ borderLeft: `4px solid ${color}` }}
      >
        <div className="event-notification-icon" style={{ color }}>{icon}</div>
        <div className="event-notification-content">
          <div className="event-notification-title">Новое событие!</div>
          <div className="event-notification-name">{event.title}</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default EventNotification;

