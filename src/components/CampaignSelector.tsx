import { motion, AnimatePresence } from 'framer-motion';
import { memo, useState } from 'react';
import { Challenge } from '../types';
import { challenges } from '../data/challenges';
import ChallengePanel from './ChallengePanel';

interface CampaignSelectorProps {
  selectedChallenge: Challenge | null;
  onSelect: (challenge: Challenge | null) => void;
  onClose: () => void;
}

function CampaignSelector({ selectedChallenge, onSelect, onClose }: CampaignSelectorProps) {
  const [view, setView] = useState<'list' | 'challenge'>('list');

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          className="modal-content campaign-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="modal-header">
            <h2>Режим кампании</h2>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>

          {view === 'list' ? (
            <div className="challenges-list">
              <div className="challenge-option" onClick={() => onSelect(null)}>
                <div className="option-icon">🎮</div>
                <div className="option-content">
                  <div className="option-title">Свободная игра</div>
                  <div className="option-description">Играйте без ограничений и челленджей</div>
                </div>
              </div>

              {challenges.map(challenge => (
                <motion.div
                  key={challenge.id}
                  className="challenge-option"
                  onClick={() => {
                    onSelect(challenge);
                    setView('challenge');
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="option-icon">🎯</div>
                  <div className="option-content">
                    <div className="option-title">{challenge.name}</div>
                    <div className="option-description">{challenge.description}</div>
                    <div className="option-reward">Награда: {challenge.reward}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : selectedChallenge ? (
            <div className="challenge-detail">
              <button className="back-btn" onClick={() => setView('list')}>
                ← Назад к списку
              </button>
              <ChallengePanel challenge={selectedChallenge} />
              <button
                className="start-challenge-btn"
                onClick={() => {
                  onSelect(selectedChallenge);
                  onClose();
                }}
              >
                Начать челлендж
              </button>
            </div>
          ) : null}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default memo(CampaignSelector);

