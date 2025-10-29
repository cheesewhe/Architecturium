import { motion } from 'framer-motion';
import { Panel } from '../types';
import { useState } from 'react';

interface TechnologyPanelProps {
  panel: Panel;
  position: { x: number; y: number };
  onRemove: (panelId: string) => void;
  onUpdatePosition: (panelId: string, x: number, y: number) => void;
}

export default function TechnologyPanel({ panel, position, onRemove, onUpdatePosition }: TechnologyPanelProps) {
  const [isHovered, setIsHovered] = useState(false);

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

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      language: 'Язык',
      framework: 'Фреймворк',
      pattern: 'Паттерн',
      library: 'Библиотека',
      database: 'БД',
      service: 'Сервис',
    };
    return labels[category] || category;
  };

  const GRID_SIZE = 20; // Размер сетки для snap-to-grid (совпадает с CSS grid-bg)

  const snapToGrid = (value: number) => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };
  
  // Получаем реальные размеры панели (должно совпадать с CSS)
  const PANEL_WIDTH = 300; // Исправлено: было 200, должно быть 300 согласно CSS
  const PANEL_HEIGHT = 120;

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: any) => {
    // ИСПРАВЛЕНО: рассчитываем позицию на основе реального положения элемента
    const element = event.target as HTMLElement;
    const viewWrapper = element.closest('.view-wrapper');
    
    if (viewWrapper) {
      const wrapperRect = viewWrapper.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      
      // Получаем позицию элемента относительно view-wrapper с учетом прокрутки
      const scrollLeft = viewWrapper.scrollLeft || 0;
      const scrollTop = viewWrapper.scrollTop || 0;
      
      const newX = snapToGrid(Math.max(0, elementRect.left - wrapperRect.left + scrollLeft));
      const newY = snapToGrid(Math.max(0, elementRect.top - wrapperRect.top + scrollTop));
      
      onUpdatePosition(panel.id, newX, newY);
    } else {
      // Fallback: используем смещение от Framer Motion
      const newX = snapToGrid(Math.max(0, position.x + info.offset.x));
      const newY = snapToGrid(Math.max(0, position.y + info.offset.y));
      onUpdatePosition(panel.id, newX, newY);
    }
  };

  return (
    <motion.div
      className="tech-panel"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        borderLeftColor: getCategoryColor(panel.technology.category),
        zIndex: 5, // Поверх линий связи
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      // Drag & Drop опционально отключен для минималистичности
      // Можно включить обратно, раскомментировав строки ниже
      // drag
      // dragMomentum={false}
      // dragElastic={0}
      // dragConstraints={{ left: 0, top: 0, right: 10000, bottom: 10000 }}
      // onDragEnd={handleDragEnd}
    >
      <button 
        className="remove-panel-btn" 
        onClick={(e) => {
          e.stopPropagation();
          onRemove(panel.id);
        }}
        title="Удалить"
      >
        ×
      </button>
      <div className="tech-header">
        <span className="tech-category">{getCategoryLabel(panel.technology.category)}</span>
        <h3 className="tech-name">{panel.technology.name}</h3>
      </div>

      <p className="tech-description">{panel.technology.description}</p>
    </motion.div>
  );
}

