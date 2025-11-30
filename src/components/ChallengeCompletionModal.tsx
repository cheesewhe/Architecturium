import { motion, AnimatePresence } from 'framer-motion';
import { memo } from 'react';
import { Challenge } from '../types';

interface ChallengeCompletionModalProps {
  challenge: Challenge;
  onClose: () => void;
}

function ChallengeCompletionModal({ challenge, onClose }: ChallengeCompletionModalProps) {
  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          className="modal-content challenge-completion-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
        >
          <div className="completion-header">
            <div className="completion-icon">🎉</div>
            <h2>Челлендж завершён!</h2>
          </div>

          <div className="completion-content">
            <h3>{challenge.name}</h3>
            <p>Поздравляем! Вы успешно выполнили все цели челленджа.</p>

            {challenge.reward && (
              <div className="completion-reward">
                <div className="reward-label">Ваша награда:</div>
                <div className="reward-value">{challenge.reward}</div>
              </div>
            )}

            <div className="completion-objectives">
              <h4>Выполненные цели:</h4>
              {challenge.objectives.map(obj => (
                <div key={obj.id} className="completed-objective">
                  <span className="check-icon">✓</span>
                  <span>{obj.description}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="completion-close-btn" onClick={onClose}>
            Отлично!
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default memo(ChallengeCompletionModal);

