import { useState } from 'react';
import * as React from 'react';
import { motion } from 'framer-motion';
import { AppSchema, AppMetrics, Technology } from './types';
import FrontendView from './components/FrontendView';
import BackendView from './components/BackendView';
import MetricsPanel from './components/MetricsPanel';
import TechnologyPicker from './components/TechnologyPicker';
import { calculateAdvancedMetrics } from './utils/advanced-metrics';
import { calculateAutoPosition } from './utils/auto-layout';
import './App.css';
import './components/styles.css';
import './components/picker-detail-styles.css';

function App() {
  const [appSchema, setAppSchema] = useState<AppSchema>({
    frontend: [],
    backend: [],
  });
  const [activeView, setActiveView] = useState<'frontend' | 'backend'>('frontend');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ x: 0, y: 0, clickX: 0, clickY: 0 });

  const metrics = calculateAdvancedMetrics(appSchema);

  const handleAddPanel = (tech: Technology, x: number, y: number) => {
    // Проверяем, есть ли уже технология этой категории
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
        service: 'сервис',
      };
      const categoryName = categoryNames[tech.category] || tech.category;
      alert(`Можно добавить только один ${categoryName}. Сначала удалите "${existingTechOfCategory.technology.name}".`);
      setShowPicker(false);
      return;
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

    setAppSchema(prev => ({
      ...prev,
      [activeView]: [...prev[activeView], newPanel],
    }));
    
    setShowPicker(false);
  };

  const handleRemovePanel = (panelId: string) => {
    setAppSchema(prev => {
      const updated = {
        ...prev,
        [activeView]: prev[activeView].filter(p => p.id !== panelId),
      };
      // Автоматическая реорганизация после удаления (опционально - можно убрать если мешает)
      // const reorganized = reorganizePanels(updated[activeView]);
      // return { ...updated, [activeView]: reorganized };
      return updated;
    });
  };

  const handleUpdatePanelPosition = (panelId: string, x: number, y: number) => {
    setAppSchema(prev => ({
      ...prev,
      [activeView]: prev[activeView].map(p => 
        p.id === panelId ? { ...p, x, y } : p
      ),
    }));
  };

  const handleClearAll = () => {
    if (window.confirm(`Удалить все панели на экране ${activeView === 'frontend' ? 'Frontend' : 'Backend'}?`)) {
      setAppSchema(prev => ({
        ...prev,
        [activeView]: [],
      }));
    }
  };

  const openPicker = (e: React.MouseEvent) => {
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
  };

  // Закрытие picker по Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showPicker) {
        setShowPicker(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPicker]);

  // Сохранение в localStorage
  React.useEffect(() => {
    localStorage.setItem('appSchema', JSON.stringify(appSchema));
  }, [appSchema]);

  // Загрузка из localStorage при старте
  React.useEffect(() => {
    const saved = localStorage.getItem('appSchema');
    if (saved) {
      try {
        setAppSchema(JSON.parse(saved));
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

        {appSchema[activeView].length > 0 && (
          <button className="clear-btn" onClick={handleClearAll} title="Очистить схему" style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 10
          }}>
            🗑️ Очистить
          </button>
        )}

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

        <MetricsPanel metrics={metrics} />

        {showPicker && (
          <TechnologyPicker
            position={pickerPosition}
            onSelect={tech => {
              // АВТОПОЗИЦИОНИРОВАНИЕ: координаты клика игнорируются, панель автоматически разместится
              handleAddPanel(tech, 0, 0);
            }}
            onClose={() => setShowPicker(false)}
            appSchema={appSchema}
          />
        )}
      </div>
    </div>
  );
}

export default App;

