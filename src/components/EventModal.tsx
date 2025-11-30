import { motion, AnimatePresence } from 'framer-motion';
import { memo } from 'react';
import { GameEvent, EventChoice } from '../types';
import { getEventIcon, getEventColor } from '../utils/events';

interface EventModalProps {
  event: GameEvent;
  onChoice?: (choice: EventChoice) => void;
  onClose: () => void;
}

function EventModal({ event, onChoice, onClose }: EventModalProps) {
  const icon = getEventIcon(event.type);
  const color = getEventColor(event.type);

  return (
    <AnimatePresence>
      <div className="modal-overlay event-overlay" onClick={onClose}>
        <motion.div
          className="modal-content event-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          style={{ borderTop: `4px solid ${color}` }}
        >
          <div className="event-header">
            <div className="event-icon" style={{ color }}>{icon}</div>
            <h2 className="event-title">{event.title}</h2>
          </div>

          <p className="event-description">{event.description}</p>

          {event.choices && event.choices.length > 0 ? (
            <div className="event-choices">
              {event.choices.map(choice => (
                <motion.button
                  key={choice.id}
                  className="event-choice-btn"
                  onClick={() => {
                    if (onChoice) {
                      onChoice(choice);
                    }
                    onClose();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {choice.text}
                </motion.button>
              ))}
            </div>
          ) : (
            <button
              className="event-close-btn"
              onClick={onClose}
              style={{ background: color }}
            >
              Понятно
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default memo(EventModal);

