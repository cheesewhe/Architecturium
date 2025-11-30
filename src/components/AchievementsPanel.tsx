import { motion, AnimatePresence } from 'framer-motion';
import { memo, useState } from 'react';
import { getUnlockedAchievements, getLockedAchievements } from '../utils/achievements';

interface AchievementsPanelProps {
  unlockedIds: string[];
  onClose?: () => void;
}

function AchievementsPanel({ unlockedIds, onClose }: AchievementsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const unlocked = getUnlockedAchievements(unlockedIds);
  const locked = getLockedAchievements(unlockedIds);
  
  const categories = ['general', 'architecture', 'performance', 'budget', 'challenge'];
  const categoryNames: Record<string, string> = {
    general: 'Общие',
    architecture: 'Архитектура',
    performance: 'Производительность',
    budget: 'Бюджет',
    challenge: 'Челленджи',
  };

  const filteredUnlocked = selectedCategory
    ? unlocked.filter(a => a.category === selectedCategory)
    : unlocked;

  const filteredLocked = selectedCategory
    ? locked.filter(a => a.category === selectedCategory)
    : locked;

  return (
    <div className="achievements-panel">
      <div className="achievements-header">
        <h3>Достижения</h3>
        {onClose && (
          <button className="close-btn" onClick={onClose}>×</button>
        )}
      </div>

      <div className="achievements-stats">
        <div className="stat-item">
          <span className="stat-value">{unlocked.length}</span>
          <span className="stat-label">из {unlocked.length + locked.length}</span>
        </div>
        <div className="stat-progress">
          <div 
            className="stat-progress-bar"
            style={{ width: `${(unlocked.length / (unlocked.length + locked.length)) * 100}%` }}
          />
        </div>
      </div>

      <div className="achievements-categories">
        <button
          className={`category-btn ${!selectedCategory ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          Все
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {categoryNames[cat]}
          </button>
        ))}
      </div>

      <div className="achievements-list">
        <AnimatePresence>
          {filteredUnlocked.map(achievement => (
            <motion.div
              key={achievement.id}
              className="achievement-item unlocked"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-info">
                <div className="achievement-name">{achievement.name}</div>
                <div className="achievement-description">{achievement.description}</div>
                {achievement.unlockedAt && (
                  <div className="achievement-date">
                    Разблокировано: {new Date(achievement.unlockedAt).toLocaleDateString('ru-RU')}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {filteredLocked.map(achievement => (
            <motion.div
              key={achievement.id}
              className="achievement-item locked"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="achievement-icon locked">🔒</div>
              <div className="achievement-info">
                <div className="achievement-name">{achievement.name}</div>
                <div className="achievement-description">{achievement.description}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default memo(AchievementsPanel);

