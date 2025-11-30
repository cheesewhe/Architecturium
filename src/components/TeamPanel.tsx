import { motion, AnimatePresence } from 'framer-motion';
import { memo, useState } from 'react';
import { Team } from '../types';
import { getSpecializationName } from '../utils/team';

interface TeamPanelProps {
  team: Team;
  onHire: () => void;
  onFire: (developerId: string) => void;
}

function TeamPanel({ team, onHire, onFire }: TeamPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="team-panel">
      <div className="team-header" onClick={() => setExpanded(!expanded)}>
        <h3>Команда разработчиков</h3>
        <div className="team-stats">
          <span className="team-count">{team.developers.length} чел.</span>
          <span className="team-skill">Навык: {team.averageSkill.toFixed(0)}</span>
        </div>
        <button className="expand-btn">{expanded ? '▼' : '▶'}</button>
      </div>

      <div className="team-summary">
        <div className="summary-item">
          <span className="summary-label">Зарплаты:</span>
          <span className="summary-value">${(team.totalSalary / 1000).toFixed(0)}k/мес</span>
        </div>
        <button className="hire-btn" onClick={onHire}>
          + Нанять
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="team-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {team.developers.length === 0 ? (
              <div className="empty-team">
                <p>Команда пуста. Нанять разработчиков для ускорения разработки!</p>
              </div>
            ) : (
              team.developers.map(dev => (
                <motion.div
                  key={dev.id}
                  className="developer-card"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="developer-info">
                    <div className="developer-name">{dev.name}</div>
                    <div className="developer-spec">{getSpecializationName(dev.specialization)}</div>
                    <div className="developer-stats">
                      <span>Навык: {dev.skill}</span>
                      <span>Опыт: {dev.experience} лет</span>
                    </div>
                  </div>
                  <div className="developer-salary">
                    ${(dev.salary / 1000).toFixed(0)}k/мес
                  </div>
                  <button
                    className="fire-btn"
                    onClick={() => onFire(dev.id)}
                    title="Уволить"
                  >
                    ×
                  </button>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(TeamPanel);

