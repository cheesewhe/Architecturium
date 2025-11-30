import { motion } from 'framer-motion';
import { memo } from 'react';
import { Challenge } from '../types';
import { getChallengeProgress } from '../utils/challenges';

interface ChallengePanelProps {
  challenge: Challenge;
}

function ChallengePanel({ challenge }: ChallengePanelProps) {
  const progress = getChallengeProgress(challenge);
  const allCompleted = challenge.objectives.every(obj => obj.completed);

  return (
    <div className={`challenge-panel ${allCompleted ? 'completed' : ''}`}>
      <div className="challenge-header">
        <h3>{challenge.name}</h3>
        {allCompleted && <span className="challenge-badge">✓ Завершён</span>}
      </div>

      <p className="challenge-description">{challenge.description}</p>

      <div className="challenge-progress">
        <div className="progress-label">
          <span>Прогресс</span>
          <span className="progress-value">{progress.toFixed(0)}%</span>
        </div>
        <div className="progress-bar-bg">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="challenge-objectives">
        <h4>Цели:</h4>
        {challenge.objectives.map(obj => (
          <div
            key={obj.id}
            className={`objective-item ${obj.completed ? 'completed' : ''}`}
          >
            <div className="objective-checkbox">
              {obj.completed ? '✓' : '○'}
            </div>
            <div className="objective-content">
              <div className="objective-description">{obj.description}</div>
              <div className="objective-progress">
                {typeof obj.current === 'number' && typeof obj.target === 'number' ? (
                  <span>
                    {obj.current.toFixed(1)} / {obj.target}
                  </span>
                ) : (
                  <span>{obj.completed ? 'Выполнено' : 'Не выполнено'}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {allCompleted && challenge.reward && (
        <motion.div
          className="challenge-reward"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="reward-icon">🎉</div>
          <div className="reward-text">Награда: {challenge.reward}</div>
        </motion.div>
      )}
    </div>
  );
}

export default memo(ChallengePanel);

