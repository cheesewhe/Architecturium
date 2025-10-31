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
  
  // Undo/Redo system
  const [history, setHistory] = useState<AppSchema[]>([{ frontend: [], backend: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const metrics = React.useMemo(() => calculateAdvancedMetrics(appSchema), [appSchema]);

  // Save to history when schema changes
  const saveToHistory = (newSchema: AppSchema) => {
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
  };

  // Undo function
  const undo = () => {
    if (historyIndex > 0) {
      const prevSchema = history[historyIndex - 1];
      setAppSchema(prevSchema);
      setHistoryIndex(prev => prev - 1);
    }
  };

  // Redo function
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextSchema = history[historyIndex + 1];
      setAppSchema(nextSchema);
      setHistoryIndex(prev => prev + 1);
    }
  };

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

  const handleAddPanel = (tech: Technology, x: number, y: number) => {
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
    
    setShowPicker(false);
  };

  const handleRemovePanel = (panelId: string) => {
    const updated = {
      ...appSchema,
      [activeView]: appSchema[activeView].filter(p => p.id !== panelId),
    };
    setAppSchema(updated);
    saveToHistory(updated);
  };

  const handleUpdatePanelPosition = (panelId: string, x: number, y: number) => {
    const updated = {
      ...appSchema,
      [activeView]: appSchema[activeView].map(p => 
        p.id === panelId ? { ...p, x, y } : p
      ),
    };
    setAppSchema(updated);
    // Don't save position changes to history to avoid clutter
  };

  const handleClearAll = () => {
    if (window.confirm(`Удалить все панели на экране ${activeView === 'frontend' ? 'Frontend' : 'Backend'}?`)) {
      const updated = {
        ...appSchema,
        [activeView]: [],
      };
      setAppSchema(updated);
      saveToHistory(updated);
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
  }, [showPicker, historyIndex, history]);

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

