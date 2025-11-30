import { useState, useCallback, lazy, Suspense } from 'react';
import * as React from 'react';
import { motion } from 'framer-motion';
import { AppSchema, AppMetrics, Technology, Budget, ProjectTimeline, Team } from './types';
import FrontendView from './components/FrontendView';
import BackendView from './components/BackendView';
import MetricsPanel from './components/MetricsPanel';
import BudgetPanel from './components/BudgetPanel';
import TimelinePanel from './components/TimelinePanel';
import TeamPanel from './components/TeamPanel';
import HireDeveloperModal from './components/HireDeveloperModal';
import EventModal from './components/EventModal';
import EventNotification from './components/EventNotification';
import ChallengePanel from './components/ChallengePanel';
import CampaignSelector from './components/CampaignSelector';
import ChallengeCompletionModal from './components/ChallengeCompletionModal';
import AppTypeSelector from './components/AppTypeSelector';
import SecurityPanel from './components/SecurityPanel';
import LoadTestPanel from './components/LoadTestPanel';
import AchievementsPanel from './components/AchievementsPanel';
import AchievementNotification from './components/AchievementNotification';
import TutorialOverlay from './components/TutorialOverlay';
import TipsPanel from './components/TipsPanel';
import ParticleEffect from './components/ParticleEffect';
const TechnologyPicker = lazy(() => import('./components/TechnologyPicker'));
import { calculateAdvancedMetrics } from './utils/advanced-metrics';
import { calculateAutoPosition } from './utils/auto-layout';
import { createBudget, calculateTotalCost, updateBudget, canAffordTech } from './utils/budget';
import { checkAchievements } from './utils/achievements';
import { getNextStep } from './utils/tutorial';
import { createTimeline, updateTimeline } from './utils/timeline';
import { createTeam, addDeveloper, removeDeveloper, calculateTeamSpeedMultiplier } from './utils/team';
import { generateRandomEvent, applyEventEffects } from './utils/events';
import { updateChallengeObjectives, isChallengeComplete, checkChallengeConstraints } from './utils/challenges';
import { analyzeSecurity } from './utils/security';
import { checkAppTypeRequirements } from './utils/app-type-metrics';
import { Achievement, TutorialStep, GameEvent, Challenge, AppType } from './types';
import './App.css';
import './components/styles.css';
import './components/picker-detail-styles.css';

function App() {
  const [appSchema, setAppSchema] = useState<AppSchema>({
    frontend: [],
    backend: [],
  });
  const [activeView, setActiveView] = useState<'frontend' | 'backend'>('frontend');
  const [, setIsTransitioning] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ x: 0, y: 0, clickX: 0, clickY: 0 });
  
  // Undo/Redo system
  const [history, setHistory] = useState<AppSchema[]>([{ frontend: [], backend: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Budget system
  const [budget, setBudget] = useState<Budget>(() => createBudget());

  // Timeline system
  const [timeline, setTimeline] = useState<ProjectTimeline>(() => {
    const saved = localStorage.getItem('timeline');
    return saved ? JSON.parse(saved) : createTimeline();
  });
  const [isTimelineRunning, setIsTimelineRunning] = useState(false);
  
  // Save timeline to localStorage
  React.useEffect(() => {
    localStorage.setItem('timeline', JSON.stringify(timeline));
  }, [timeline]);

  // Team system
  const [team, setTeam] = useState<Team>(() => {
    const saved = localStorage.getItem('team');
    return saved ? JSON.parse(saved) : createTeam();
  });
  const [showHireModal, setShowHireModal] = useState(false);
  
  // Save team to localStorage
  React.useEffect(() => {
    localStorage.setItem('team', JSON.stringify(team));
  }, [team]);

  // Events system
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [eventNotification, setEventNotification] = useState<GameEvent | null>(null);

  // Challenges system
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(() => {
    const saved = localStorage.getItem('activeChallenge');
    return saved ? JSON.parse(saved) : null;
  });
  const [showCampaignSelector, setShowCampaignSelector] = useState(false);
  const [completedChallenge, setCompletedChallenge] = useState<Challenge | null>(null);

  // App Type system
  const [selectedAppType, setSelectedAppType] = useState<AppType | null>(() => {
    const saved = localStorage.getItem('selectedAppType');
    return saved ? JSON.parse(saved) : null;
  });
  const [showAppTypeSelector, setShowAppTypeSelector] = useState(false);

  // Security system
  const security = React.useMemo(() => analyzeSecurity(appSchema), [appSchema]);
  
  // Save active challenge to localStorage
  React.useEffect(() => {
    if (activeChallenge) {
      localStorage.setItem('activeChallenge', JSON.stringify(activeChallenge));
    } else {
      localStorage.removeItem('activeChallenge');
    }
  }, [activeChallenge]);

  // Save selected app type to localStorage
  React.useEffect(() => {
    if (selectedAppType) {
      localStorage.setItem('selectedAppType', JSON.stringify(selectedAppType));
    } else {
      localStorage.removeItem('selectedAppType');
    }
  }, [selectedAppType]);

  // Calculate metrics
  const baseMetrics = React.useMemo(() => calculateAdvancedMetrics(appSchema), [appSchema]);
  const [metrics, setMetrics] = React.useState<AppMetrics>(baseMetrics);
  
  // Update metrics when schema changes
  React.useEffect(() => {
    setMetrics(baseMetrics);
  }, [baseMetrics, setMetrics]);

  // Check app type requirements
  React.useEffect(() => {
    if (selectedAppType) {
      const requirements = checkAppTypeRequirements(metrics, selectedAppType);
      if (!requirements.met && requirements.issues.length > 0) {
        // Можно показать предупреждение
      }
    }
  }, [selectedAppType, metrics]);

  // Achievements system
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => {
    const saved = localStorage.getItem('unlockedAchievements');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAchievements, setShowAchievements] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // Tutorial system
  const [tutorialStep, setTutorialStep] = useState<TutorialStep | null>(() => {
    const completed = localStorage.getItem('tutorialCompleted');
    if (completed === 'true') return null;
    const saved = localStorage.getItem('tutorialStep');
    return saved ? JSON.parse(saved) : getNextStep(null);
  });
  const [showTutorial, setShowTutorial] = useState(() => {
    const completed = localStorage.getItem('tutorialCompleted');
    return completed !== 'true';
  });
  const [particleEffect, setParticleEffect] = useState<{ x: number; y: number } | null>(null);

  // Calculate current cost
  const currentCost = React.useMemo(() => {
    const allPanels = [...appSchema.frontend, ...appSchema.backend];
    const technologies = allPanels.map(p => p.technology);
    return calculateTotalCost(technologies);
  }, [appSchema]);

  // Update budget when cost changes
  React.useEffect(() => {
    setBudget(prev => ({
      ...prev,
      spent: currentCost,
      remaining: prev.total - currentCost,
    }));
  }, [currentCost]);

  // Check achievements when schema or metrics change
  React.useEffect(() => {
    const newlyUnlocked = checkAchievements(appSchema, metrics, budget, unlockedAchievements);
    
    if (newlyUnlocked.length > 0) {
      const newIds = newlyUnlocked.map(a => a.id);
      setUnlockedAchievements(prev => {
        const updated = [...prev, ...newIds];
        localStorage.setItem('unlockedAchievements', JSON.stringify(updated));
        return updated;
      });
      
      // Show notification for first achievement
      setNewAchievement(newlyUnlocked[0]);
      setTimeout(() => setNewAchievement(null), 5000);
    }
  }, [appSchema, metrics, budget, unlockedAchievements]);

  // Update challenge objectives
  React.useEffect(() => {
    if (activeChallenge) {
      const updated = updateChallengeObjectives(activeChallenge, appSchema, metrics, budget, timeline);
      setActiveChallenge(updated);

      // Check constraints
      const constraints = checkChallengeConstraints(updated, appSchema, budget, timeline);
      if (constraints.violated && constraints.message) {
        // Можно показать предупреждение
      }

      // Check if completed
      if (isChallengeComplete(updated) && !updated.objectives.every((obj, idx) => 
        activeChallenge?.objectives[idx]?.completed === obj.completed
      )) {
        setCompletedChallenge(updated);
      }
    }
  }, [appSchema, metrics, budget, timeline, activeChallenge]);

  // Update timeline when metrics change
  React.useEffect(() => {
    if (isTimelineRunning) {
      const speedMultiplier = calculateTeamSpeedMultiplier(team, appSchema);
      const interval = setInterval(() => {
        setTimeline(prev => {
          const updated = updateTimeline(prev, metrics, 0.1 * speedMultiplier);
          
          // Генерируем случайные события
          if (Math.random() < 0.02) { // 2% вероятность каждую секунду
            const event = generateRandomEvent(updated.daysElapsed);
            if (event) {
              setEventNotification(event);
              setTimeout(() => {
                setEventNotification(null);
                setCurrentEvent(event);
              }, 2000);
            }
          }
          
          return updated;
        });
      }, 1000); // Обновляем каждую секунду

      return () => clearInterval(interval);
    }
  }, [isTimelineRunning, metrics, team, appSchema]);

  // Update budget with team salary
  React.useEffect(() => {
    setBudget(prev => ({
      ...prev,
      spent: currentCost + team.totalSalary,
      remaining: prev.total - currentCost - team.totalSalary,
    }));
  }, [team.totalSalary, currentCost]);

  // Tutorial navigation
  const handleTutorialNext = useCallback(() => {
    if (!tutorialStep) return;
    const next = getNextStep(tutorialStep.id);
    setTutorialStep(next);
    if (next) {
      localStorage.setItem('tutorialStep', JSON.stringify(next));
    }
  }, [tutorialStep]);

  const handleTutorialPrevious = useCallback(() => {
    if (!tutorialStep) return;
    // Implementation for previous step
  }, [tutorialStep]);

  const handleTutorialSkip = useCallback(() => {
    setShowTutorial(false);
    setTutorialStep(null);
    localStorage.setItem('tutorialCompleted', 'true');
  }, []);

  const handleTutorialComplete = useCallback(() => {
    setShowTutorial(false);
    setTutorialStep(null);
    localStorage.setItem('tutorialCompleted', 'true');
  }, []);

  // Save to history when schema changes
  const saveToHistory = useCallback((newSchema: AppSchema) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newSchema);
      // Limit history to 50 states
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevSchema = history[historyIndex - 1];
      setAppSchema(prevSchema);
      setHistoryIndex(prev => prev - 1);
    }
  }, [historyIndex, history]);

  // Redo function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextSchema = history[historyIndex + 1];
      setAppSchema(nextSchema);
      setHistoryIndex(prev => prev + 1);
    }
  }, [historyIndex, history]);

  // Export schema to JSON
  const exportSchema = () => {
    const dataStr = JSON.stringify(appSchema, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `architecturium-schema-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import schema from JSON
  const importSchema = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string);
            if (imported.frontend && imported.backend) {
              setAppSchema(imported);
              saveToHistory(imported);
              alert('Схема успешно импортирована!');
            } else {
              alert('Неверный формат файла');
            }
          } catch (err) {
            alert('Ошибка при чтении файла');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleAddPanel = useCallback((tech: Technology, _x: number, _y: number) => {
    // Проверяем бюджет
    if (!canAffordTech(budget, tech)) {
      const cost = calculateTotalCost([tech]);
      alert(`Недостаточно средств! Стоимость ${tech.name}: $${cost.toLocaleString()}. Осталось: $${budget.remaining.toLocaleString()}`);
      setShowPicker(false);
      return;
    }

    // Проверяем, есть ли уже технология этой категории (кроме сервисов - их можно несколько)
    if (tech.category !== 'service') {
      const existingTechOfCategory = appSchema[activeView].find(
        p => p.technology.category === tech.category
      );

      if (existingTechOfCategory) {
        const categoryNames: Record<string, string> = {
          language: 'язык',
          framework: 'фреймворк',
          pattern: 'паттерн',
          library: 'библиотеку',
          database: 'базу данных',
        };
        const categoryName = categoryNames[tech.category] || tech.category;
        alert(`Можно добавить только один ${categoryName}. Сначала удалите "${existingTechOfCategory.technology.name}".`);
        setShowPicker(false);
        return;
      }
    }

    // АВТОПОЗИЦИОНИРОВАНИЕ: игнорируем x, y от клика, используем автоматическое размещение
    const autoPosition = calculateAutoPosition(appSchema[activeView], activeView);

    // Находим последнюю добавленную технологию для связи
    const lastPanel = appSchema[activeView][appSchema[activeView].length - 1];
    
    const newPanel = {
      id: `${Date.now()}-${Math.random()}`,
      technology: tech,
      x: autoPosition.x,
      y: autoPosition.y,
      connections: lastPanel ? [lastPanel.id] : [], // Связываем с предыдущей
    };

    const newSchema = {
      ...appSchema,
      [activeView]: [...appSchema[activeView], newPanel],
    };
    setAppSchema(newSchema);
    saveToHistory(newSchema);
    
    // Update budget
    const techCost = calculateTotalCost([tech]);
    const updatedBudget = updateBudget(budget, techCost);
    if (updatedBudget) {
      setBudget(updatedBudget);
    }
    
    // Particle effect
    setParticleEffect({ x: autoPosition.x + 150, y: autoPosition.y + 60 });
    setTimeout(() => setParticleEffect(null), 1000);
    
    setShowPicker(false);
  }, [appSchema, activeView, saveToHistory, budget]);

  const handleRemovePanel = useCallback((panelId: string) => {
    const updated = {
      ...appSchema,
      [activeView]: appSchema[activeView].filter(p => p.id !== panelId),
    };
    setAppSchema(updated);
    saveToHistory(updated);
  }, [appSchema, activeView, saveToHistory]);

  const handleUpdatePanelPosition = useCallback((panelId: string, x: number, y: number) => {
    const updated = {
      ...appSchema,
      [activeView]: appSchema[activeView].map(p => 
        p.id === panelId ? { ...p, x, y } : p
      ),
    };
    setAppSchema(updated);
    // Don't save position changes to history to avoid clutter
  }, [appSchema, activeView]);

  const handleClearAll = useCallback(() => {
    if (window.confirm(`Удалить все панели на экране ${activeView === 'frontend' ? 'Frontend' : 'Backend'}?`)) {
      const updated = {
        ...appSchema,
        [activeView]: [],
      };
      setAppSchema(updated);
      saveToHistory(updated);
    }
  }, [appSchema, activeView, saveToHistory]);

  const openPicker = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Получаем координаты клика относительно view-wrapper
    const viewWrapper = (e.currentTarget as HTMLElement).closest('.view-wrapper');
    if (!viewWrapper) return;
    
    const rect = viewWrapper.getBoundingClientRect();
    // ИСПРАВЛЕНО: учитываем прокрутку контейнера
    const scrollLeft = viewWrapper.scrollLeft || 0;
    const scrollTop = viewWrapper.scrollTop || 0;
    
    const clickX = e.clientX - rect.left + scrollLeft;
    const clickY = e.clientY - rect.top + scrollTop;
    
    setPickerPosition({ 
      x: window.innerWidth / 2, // Центр экрана для picker'а
      y: window.innerHeight / 2,
      clickX, // Реальные координаты клика для размещения панели (с учетом прокрутки)
      clickY,
    });
    setShowPicker(true);
  }, []);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape - close picker
      if (e.key === 'Escape' && showPicker) {
        setShowPicker(false);
        return;
      }
      
      // Ctrl+Z or Cmd+Z - undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      
      // Ctrl+Shift+Z or Cmd+Shift+Z - redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && e.shiftKey) {
        e.preventDefault();
        redo();
        return;
      }
      
      // Delete - remove selected panel (if implemented)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Could be extended to remove focused panel
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPicker, undo, redo]);

  // Сохранение в localStorage
  React.useEffect(() => {
    localStorage.setItem('appSchema', JSON.stringify(appSchema));
  }, [appSchema]);

  // Загрузка из localStorage при старте
  React.useEffect(() => {
    const saved = localStorage.getItem('appSchema');
    if (saved) {
      try {
        const loaded = JSON.parse(saved);
        setAppSchema(loaded);
        setHistory([loaded]);
        setHistoryIndex(0);
      } catch (e) {
        console.error('Failed to load saved schema:', e);
      }
    }
  }, []);

  return (
    <div className="app">

      <div className="app-content">
        {/* Кнопки переключения и очистки теперь в левом верхнем углу */}
        <div className="view-switcher">
          <motion.div 
            className="active-indicator"
            animate={{
              x: activeView === 'frontend' ? 0 : '100%',
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          />
          <button
            className={`switch-btn ${activeView === 'frontend' ? 'active' : ''}`}
            onClick={() => {
              if (activeView !== 'frontend') {
                setIsTransitioning(true);
                setTimeout(() => {
                  setActiveView('frontend');
                  setIsTransitioning(false);
                }, 150);
              }
            }}
          >
            <span className="switch-btn-title">Frontend</span>
            <span className="switch-btn-subtitle">Интерфейс</span>
          </button>
          <button
            className={`switch-btn ${activeView === 'backend' ? 'active' : ''}`}
            onClick={() => {
              if (activeView !== 'backend') {
                setIsTransitioning(true);
                setTimeout(() => {
                  setActiveView('backend');
                  setIsTransitioning(false);
                }, 150);
              }
            }}
          >
            <span className="switch-btn-title">Backend</span>
            <span className="switch-btn-subtitle">Серверная часть</span>
          </button>
        </div>

        {/* Toolbar buttons */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 10,
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          <button 
            className="toolbar-btn" 
            onClick={undo} 
            disabled={historyIndex === 0}
            title="Отменить (Ctrl+Z)"
          >
            ↶ Отменить
          </button>
          <button 
            className="toolbar-btn" 
            onClick={redo} 
            disabled={historyIndex >= history.length - 1}
            title="Повторить (Ctrl+Shift+Z)"
          >
            ↷ Повторить
          </button>
          <button 
            className="toolbar-btn" 
            onClick={exportSchema}
            title="Экспорт схемы в JSON"
          >
            📥 Экспорт
          </button>
          <button 
            className="toolbar-btn" 
            onClick={importSchema}
            title="Импорт схемы из JSON"
          >
            📤 Импорт
          </button>
          <button 
            className="toolbar-btn" 
            onClick={() => setShowAchievements(true)}
            title="Достижения"
          >
            🏆 Достижения ({unlockedAchievements.length})
          </button>
          <button 
            className={`toolbar-btn ${isTimelineRunning ? 'active' : ''}`}
            onClick={() => setIsTimelineRunning(!isTimelineRunning)}
            title={isTimelineRunning ? 'Остановить прогресс' : 'Запустить прогресс'}
          >
            {isTimelineRunning ? '⏸️ Пауза' : '▶️ Запуск'}
          </button>
          <button 
            className="toolbar-btn"
            onClick={() => setShowCampaignSelector(true)}
            title="Режим кампании"
          >
            🎯 Кампания
          </button>
          <button 
            className="toolbar-btn"
            onClick={() => setShowAppTypeSelector(true)}
            title="Тип приложения"
          >
            {selectedAppType ? selectedAppType.icon : '📱'} {selectedAppType ? selectedAppType.name : 'Тип приложения'}
          </button>
          {appSchema[activeView].length > 0 && (
            <button 
              className="toolbar-btn clear-btn" 
              onClick={handleClearAll} 
              title="Очистить схему"
            >
              🗑️ Очистить
            </button>
          )}
        </div>

        <div className="view-container">
          {activeView === 'frontend' ? (
            <FrontendView
              panels={appSchema.frontend}
              onAddPanel={handleAddPanel}
              onAddClick={openPicker}
              onRemovePanel={handleRemovePanel}
              onUpdatePosition={handleUpdatePanelPosition}
            />
          ) : (
            <BackendView
              panels={appSchema.backend}
              onAddPanel={handleAddPanel}
              onAddClick={openPicker}
              onRemovePanel={handleRemovePanel}
              onUpdatePosition={handleUpdatePanelPosition}
            />
          )}
        </div>

        <BudgetPanel budget={budget} />
        <TimelinePanel timeline={timeline} />
        <TeamPanel
          team={team}
          onHire={() => setShowHireModal(true)}
          onFire={(id) => {
            setTeam(prev => removeDeveloper(prev, id));
          }}
        />
        {activeChallenge && (
          <ChallengePanel challenge={activeChallenge} />
        )}
        {selectedAppType && (
          <div className="app-type-badge">
            <span className="badge-icon">{selectedAppType.icon}</span>
            <span className="badge-text">{selectedAppType.name}</span>
          </div>
        )}
        <SecurityPanel security={security} />
        <LoadTestPanel schema={appSchema} metrics={metrics} />
        <MetricsPanel metrics={metrics} />

        {showPicker && (
          <Suspense fallback={<div>Загрузка...</div>}>
            <TechnologyPicker
              position={pickerPosition}
              onSelect={tech => {
                // АВТОПОЗИЦИОНИРОВАНИЕ: координаты клика игнорируются, панель автоматически разместится
                handleAddPanel(tech, 0, 0);
              }}
              onClose={() => setShowPicker(false)}
              appSchema={appSchema}
            />
          </Suspense>
        )}

        {showAchievements && (
          <div className="modal-overlay" onClick={() => setShowAchievements(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <AchievementsPanel
                unlockedIds={unlockedAchievements}
                onClose={() => setShowAchievements(false)}
              />
            </div>
          </div>
        )}

        {newAchievement && (
          <AchievementNotification
            achievement={newAchievement}
            onClose={() => setNewAchievement(null)}
          />
        )}

        {showTutorial && tutorialStep && (
          <TutorialOverlay
            step={tutorialStep}
            onNext={handleTutorialNext}
            onPrevious={handleTutorialPrevious}
            onSkip={handleTutorialSkip}
            onComplete={handleTutorialComplete}
          />
        )}

        <TipsPanel />

        {particleEffect && (
          <ParticleEffect x={particleEffect.x} y={particleEffect.y} />
        )}

        {showHireModal && (
          <HireDeveloperModal
            budget={budget}
            currentTeam={team.developers}
            onHire={(dev) => {
              setTeam(prev => addDeveloper(prev, dev));
            }}
            onClose={() => setShowHireModal(false)}
          />
        )}

        {eventNotification && (
          <EventNotification
            event={eventNotification}
            onShow={() => {
              setEventNotification(null);
              setCurrentEvent(eventNotification);
            }}
          />
        )}

        {currentEvent && (
          <EventModal
            event={currentEvent}
            onChoice={(choice) => {
              const result = applyEventEffects(metrics, budget, timeline, choice.effects);
              setMetrics(result.metrics);
              setBudget(result.budget);
              setTimeline(result.timeline);
              setCurrentEvent(null);
            }}
            onClose={() => {
              if (!currentEvent.choices) {
                const result = applyEventEffects(metrics, budget, timeline, currentEvent.effects);
                setMetrics(result.metrics);
                setBudget(result.budget);
                setTimeline(result.timeline);
              }
              setCurrentEvent(null);
            }}
          />
        )}

        {showCampaignSelector && (
          <CampaignSelector
            selectedChallenge={activeChallenge}
            onSelect={(challenge) => {
              setActiveChallenge(challenge);
              setShowCampaignSelector(false);
            }}
            onClose={() => setShowCampaignSelector(false)}
          />
        )}

        {completedChallenge && (
          <ChallengeCompletionModal
            challenge={completedChallenge}
            onClose={() => setCompletedChallenge(null)}
          />
        )}

        {showAppTypeSelector && (
          <AppTypeSelector
            selectedType={selectedAppType}
            onSelect={(appType) => {
              setSelectedAppType(appType);
              setShowAppTypeSelector(false);
            }}
            onClose={() => setShowAppTypeSelector(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;

