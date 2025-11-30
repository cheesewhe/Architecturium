import { motion, AnimatePresence } from 'framer-motion';
import { memo } from 'react';
import { TutorialStep } from '../types';
import { getTutorialProgress } from '../utils/tutorial';

interface TutorialOverlayProps {
  step: TutorialStep | null;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

function TutorialOverlay({ step, onNext, onPrevious, onSkip, onComplete }: TutorialOverlayProps) {
  if (!step) return null;

  const progress = getTutorialProgress(step.id);
  const isLastStep = step.action === 'complete';

  return (
    <AnimatePresence>
      <motion.div
        className="tutorial-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Highlight overlay */}
        {step.target && step.highlight && (
          <div className="tutorial-highlight" />
        )}

        {/* Tutorial card */}
        <motion.div
          className={`tutorial-card tutorial-${step.position}`}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
        >
          <div className="tutorial-header">
            <div className="tutorial-progress">
              <div className="tutorial-progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <button className="tutorial-skip" onClick={onSkip}>
              Пропустить
            </button>
          </div>

          <div className="tutorial-content">
            <h3 className="tutorial-title">{step.title}</h3>
            <p className="tutorial-description">{step.description}</p>
          </div>

          <div className="tutorial-actions">
            {step.action !== 'next' && (
              <button className="tutorial-btn secondary" onClick={onPrevious}>
                Назад
              </button>
            )}
            {isLastStep ? (
              <button className="tutorial-btn primary" onClick={onComplete}>
                Завершить
              </button>
            ) : (
              <button className="tutorial-btn primary" onClick={onNext}>
                Далее
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default memo(TutorialOverlay);

