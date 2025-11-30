import { motion } from 'framer-motion';
import { memo } from 'react';
import { Developer } from '../types';
import { getSpecializationName } from '../utils/team';

interface DeveloperCardProps {
  developer: Developer;
  onHire: () => void;
  canAfford: boolean;
}

function DeveloperCard({ developer, onHire, canAfford }: DeveloperCardProps) {
  const getSkillColor = (skill: number) => {
    if (skill >= 80) return '#10b981';
    if (skill >= 60) return '#4a9eff';
    return '#f59e0b';
  };

  return (
    <motion.div
      className={`developer-card-preview ${!canAfford ? 'disabled' : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: canAfford ? 1.05 : 1 }}
    >
      <div className="developer-preview-header">
        <div className="developer-preview-name">{developer.name}</div>
        <div className="developer-preview-spec">{getSpecializationName(developer.specialization)}</div>
      </div>

      <div className="developer-preview-stats">
        <div className="stat-row">
          <span>Навык:</span>
          <div className="skill-bar-container">
            <div
              className="skill-bar-fill"
              style={{
                width: `${developer.skill}%`,
                background: getSkillColor(developer.skill),
              }}
            />
            <span className="skill-value">{developer.skill}</span>
          </div>
        </div>
        <div className="stat-row">
          <span>Опыт:</span>
          <span className="stat-value">{developer.experience} лет</span>
        </div>
        <div className="stat-row">
          <span>Зарплата:</span>
          <span className="stat-value salary">${(developer.salary / 1000).toFixed(0)}k/мес</span>
        </div>
      </div>

      <button
        className={`hire-preview-btn ${!canAfford ? 'disabled' : ''}`}
        onClick={onHire}
        disabled={!canAfford}
      >
        {canAfford ? 'Нанять' : 'Недостаточно средств'}
      </button>
    </motion.div>
  );
}

export default memo(DeveloperCard);

