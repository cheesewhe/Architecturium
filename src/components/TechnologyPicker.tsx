import { motion, AnimatePresence } from 'framer-motion';
import { Technology, AppSchema } from '../types';
import { technologies } from '../data/technologies';
import { useState, useEffect, useMemo } from 'react';
import { sortTechnologies, getRecommendationLabel } from '../utils/tech-sorting';
import { getModifiersForTech, groupModifiers } from '../utils/modifier-display';

interface TechnologyPickerProps {
  position: { x: number; y: number };
  onSelect: (tech: Technology) => void;
  onClose: () => void;
  appSchema: AppSchema;
}

export default function TechnologyPicker({ position, onSelect, onClose, appSchema }: TechnologyPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = Array.from(new Set(technologies.map(t => t.category)));

  // ДИНАМИЧЕСКАЯ СОРТИРОВКА на основе выбранных технологий
  const dynamicallySorted = useMemo(() => {
    return sortTechnologies(technologies, appSchema);
  }, [appSchema]);

  // Для вкладки "Все" - сортируем по категориям, затем внутри категории
  const filteredTechs = useMemo(() => {
    if (selectedCategory) {
      // Конкретная категория - просто фильтруем
      return dynamicallySorted.filter(t => t.category === selectedCategory);
    } else {
      // Вкладка "Все" - группируем по категориям, сохраняя порядок внутри
      const categoryOrder = ['language', 'framework', 'pattern', 'library', 'database', 'service'];
      
      return [...dynamicallySorted].sort((a, b) => {
        const catIndexA = categoryOrder.indexOf(a.category);
        const catIndexB = categoryOrder.indexOf(b.category);
        
        // Сначала сортируем по категории
        if (catIndexA !== catIndexB) {
          return catIndexA - catIndexB;
        }
        
        // Внутри категории порядок уже правильный из dynamicallySorted
        const indexA = dynamicallySorted.indexOf(a);
        const indexB = dynamicallySorted.indexOf(b);
        return indexA - indexB;
      });
    }
  }, [dynamicallySorted, selectedCategory]);

  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);
  
  // Получаем список уже выбранных технологий для отображения рекомендаций
  const selectedTechnologies = useMemo(() => {
    return [
      ...appSchema.frontend.map(p => p.technology),
      ...appSchema.backend.map(p => p.technology)
    ];
  }, [appSchema]);

  return (
    <AnimatePresence>
      <div className="picker-overlay" onClick={onClose}>
        <motion.div
          className="picker-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="picker-left">
            <div className="picker-header">
              <h3>Выберите технологию</h3>
            </div>

            <div className="picker-categories">
              <button
                className={`category-btn ${!selectedCategory ? 'active' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                Все
              </button>
              {categories.map(cat => {
                const categoryNames: Record<string, string> = {
                  language: 'Язык',
                  framework: 'Фреймворк',
                  pattern: 'Паттерн',
                  library: 'Библиотека',
                  database: 'БД',
                  service: 'Сервис',
                };
                return (
                  <button
                    key={cat}
                    className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {categoryNames[cat] || cat}
                  </button>
                );
              })}
            </div>

            <div className="picker-grid">
              {filteredTechs.map(tech => {
                const categoryNames: Record<string, string> = {
                  language: 'Язык',
                  framework: 'Фреймворк',
                  pattern: 'Паттерн',
                  library: 'Библиотека',
                  database: 'БД',
                  service: 'Сервис',
                };
                const getCategoryColor = (category: string) => {
                  const colors: Record<string, string> = {
                    language: '#4a9eff',
                    framework: '#7c3aed',
                    pattern: '#ec4899',
                    library: '#10b981',
                    database: '#f59e0b',
                    service: '#ef4444',
                  };
                  return colors[category] || '#6b7280';
                };
                return (
                  <motion.div
                    key={tech.id}
                    className={`tech-card ${selectedTech?.id === tech.id ? 'selected' : ''}`}
                    onClick={() => setSelectedTech(tech)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div 
                      className="tech-card-corner" 
                      style={{ background: getCategoryColor(tech.category) }}
                    />
                    <div className="tech-card-name">{tech.name}</div>
                    <div className="tech-card-category">{categoryNames[tech.category] || tech.category}</div>
                    {getRecommendationLabel(tech, selectedTechnologies) && (
                      <div className="tech-card-recommendation">
                        {getRecommendationLabel(tech, selectedTechnologies)}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="picker-right">
            <button className="close-btn-top" onClick={onClose}>×</button>
            
            {selectedTech ? (
              <div className="tech-detail">
                <h2>{selectedTech.name}</h2>
                <span className="tech-detail-category">
                  {(() => {
                    const categoryNames: Record<string, string> = {
                      language: 'Язык',
                      framework: 'Фреймворк',
                      pattern: 'Паттерн',
                      library: 'Библиотека',
                      database: 'БД',
                      service: 'Сервис',
                    };
                    return categoryNames[selectedTech.category] || selectedTech.category;
                  })()}
                </span>

                <div className="tech-detail-desc">
                  {selectedTech.detailedDescription ? (
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: selectedTech.detailedDescription
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br/>')
                      }}
                    />
                  ) : (
                    <p>{selectedTech.description}</p>
                  )}
                </div>

                <div className="tech-detail-section">
                  <h4>✓ Преимущества</h4>
                  <ul>
                    {selectedTech.pros.map((pro, i) => (
                      <li key={i}>{pro}</li>
                    ))}
                  </ul>
                </div>

                <div className="tech-detail-section">
                  <h4>✗ Недостатки</h4>
                  <ul>
                    {selectedTech.cons.map((con, i) => (
                      <li key={i}>{con}</li>
                    ))}
                  </ul>
                </div>

                <div className="tech-detail-metrics">
                  <div className="detail-metric">
                    <span>Производительность</span>
                    <div className="detail-metric-bar">
                      <div 
                        className="detail-metric-fill" 
                        style={{ width: `${selectedTech.performance}%`, background: '#4a9eff' }}
                      />
                    </div>
                    <span className="detail-metric-value">{selectedTech.performance}%</span>
                  </div>
                  <div className="detail-metric">
                    <span>Стабильность</span>
                    <div className="detail-metric-bar">
                      <div 
                        className="detail-metric-fill" 
                        style={{ width: `${selectedTech.stability}%`, background: '#10b981' }}
                      />
                    </div>
                    <span className="detail-metric-value">{selectedTech.stability}%</span>
                  </div>
                  <div className="detail-metric">
                    <span>Удобство</span>
                    <div className="detail-metric-bar">
                      <div 
                        className="detail-metric-fill" 
                        style={{ width: `${selectedTech.usability}%`, background: '#f59e0b' }}
                      />
                    </div>
                    <span className="detail-metric-value">{selectedTech.usability}%</span>
                  </div>
                </div>

                {/* МОДИФИКАТОРЫ - показываем бонусы с уже выбранными технологиями */}
                {(() => {
                  const modifiers = getModifiersForTech(selectedTech, selectedTechnologies);
                  if (modifiers.length > 0) {
                    return (
                      <div className="tech-modifiers">
                        <h4>💎 Синергия с вашими технологиями</h4>
                        {modifiers.map((modInfo) => {
                          const grouped = groupModifiers(modInfo);
                          const hasUX = grouped.ux.length > 0;
                          const hasDev = grouped.dev.length > 0;
                          
                          return (
                            <div key={modInfo.techId} className="modifier-group">
                              <div className="modifier-tech-name">
                                <span className="modifier-icon">🔗</span>
                                <strong>{modInfo.techName}</strong>
                              </div>
                              
                              {hasUX && (
                                <div className="modifier-section">
                                  <span className="modifier-section-label">UX:</span>
                                  <div className="modifier-items">
                                    {grouped.ux.map((mod, idx) => (
                                      <span key={idx} className="modifier-item positive">
                                        {mod}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {hasDev && (
                                <div className="modifier-section">
                                  <span className="modifier-section-label">Dev:</span>
                                  <div className="modifier-items">
                                    {grouped.dev.map((mod, idx) => (
                                      <span key={idx} className={`modifier-item ${mod.includes('-') ? 'negative' : 'positive'}`}>
                                        {mod}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                })()}

                {selectedTech.compatibility && (
                  <div className="tech-compatibility">
                    <h4>Совместимость</h4>
                    
                    {selectedTech.compatibility.preferred.length > 0 && (
                      <div className="compat-group">
                        <span className="compat-label recommended">✓ Рекомендуется</span>
                        <div className="compat-tags">
                          {selectedTech.compatibility.preferred.map(techId => {
                            const tech = technologies.find(t => t.id === techId);
                            return tech ? (
                              <span key={techId} className="compat-tag recommended">
                                {tech.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {selectedTech.compatibility.compatible.length > 0 && (
                      <div className="compat-group">
                        <span className="compat-label compatible">○ Совместимо</span>
                        <div className="compat-tags">
                          {selectedTech.compatibility.compatible.map(techId => {
                            const tech = technologies.find(t => t.id === techId);
                            return tech ? (
                              <span key={techId} className="compat-tag compatible">
                                {tech.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {selectedTech.compatibility.incompatible.length > 0 && (
                      <div className="compat-group">
                        <span className="compat-label incompatible">✗ Несовместимо</span>
                        <div className="compat-tags">
                          {selectedTech.compatibility.incompatible.map(techId => {
                            const tech = technologies.find(t => t.id === techId);
                            return tech ? (
                              <span key={techId} className="compat-tag incompatible">
                                {tech.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button 
                  className="add-tech-btn"
                  onClick={() => {
                    onSelect(selectedTech);
                    setSelectedTech(null);
                  }}
                >
                  Добавить технологию
                </button>
              </div>
            ) : (
              <div className="tech-detail-empty">
                <p>Выберите технологию для просмотра деталей</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

