import { motion, AnimatePresence } from 'framer-motion';
import { memo, useState } from 'react';
import { AppType } from '../types';
import { appTypes } from '../data/app-types';

interface AppTypeSelectorProps {
  selectedType: AppType | null;
  onSelect: (appType: AppType | null) => void;
  onClose: () => void;
}

function AppTypeSelector({ selectedType, onSelect, onClose }: AppTypeSelectorProps) {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [previewType, setPreviewType] = useState<AppType | null>(null);

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          className="modal-content app-type-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="modal-header">
            <h2>Выберите тип приложения</h2>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>

          {view === 'list' ? (
            <div className="app-types-grid">
              <div
                className="app-type-option"
                onClick={() => {
                  onSelect(null);
                  onClose();
                }}
              >
                <div className="option-icon">🎮</div>
                <div className="option-content">
                  <div className="option-title">Свободная игра</div>
                  <div className="option-description">Без ограничений по типу</div>
                </div>
              </div>

              {appTypes.map(appType => (
                <motion.div
                  key={appType.id}
                  className={`app-type-option ${selectedType?.id === appType.id ? 'selected' : ''}`}
                  onClick={() => {
                    setPreviewType(appType);
                    setView('detail');
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="option-icon">{appType.icon}</div>
                  <div className="option-content">
                    <div className="option-title">{appType.name}</div>
                    <div className="option-description">{appType.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : previewType ? (
            <div className="app-type-detail">
              <button className="back-btn" onClick={() => setView('list')}>
                ← Назад
              </button>

              <div className="type-header">
                <div className="type-icon">{previewType.icon}</div>
                <div>
                  <h3>{previewType.name}</h3>
                  <p>{previewType.description}</p>
                </div>
              </div>

              <div className="type-requirements">
                <h4>Требования:</h4>
                <div className="requirements-grid">
                  <div className="requirement-item">
                    <span>Производительность:</span>
                    <span className="req-value">{previewType.requirements.performance}</span>
                  </div>
                  <div className="requirement-item">
                    <span>Стабильность:</span>
                    <span className="req-value">{previewType.requirements.stability}</span>
                  </div>
                  <div className="requirement-item">
                    <span>Удобство:</span>
                    <span className="req-value">{previewType.requirements.userFriendliness}</span>
                  </div>
                  <div className="requirement-item">
                    <span>Скорость разработки:</span>
                    <span className="req-value">{previewType.requirements.developmentSpeed}</span>
                  </div>
                  <div className="requirement-item">
                    <span>Поддерживаемость:</span>
                    <span className="req-value">{previewType.requirements.maintainability}</span>
                  </div>
                  <div className="requirement-item">
                    <span>Макс. сложность:</span>
                    <span className="req-value">{previewType.requirements.maxComplexity}</span>
                  </div>
                  <div className="requirement-item">
                    <span>Макс. бюджет:</span>
                    <span className="req-value">${previewType.requirements.maxCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="type-recommended">
                <h4>Рекомендуемые технологии:</h4>
                <div className="recommended-tags">
                  {previewType.recommendedTechnologies.map(tech => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>

              <div className="type-challenges">
                <h4>Вызовы:</h4>
                <ul>
                  {previewType.challenges.map((challenge, idx) => (
                    <li key={idx}>{challenge}</li>
                  ))}
                </ul>
              </div>

              <button
                className="select-type-btn"
                onClick={() => {
                  onSelect(previewType);
                  onClose();
                }}
              >
                Выбрать этот тип
              </button>
            </div>
          ) : null}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default memo(AppTypeSelector);

