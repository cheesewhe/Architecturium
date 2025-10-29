import { motion } from 'framer-motion';
import { Panel, Technology } from '../types';
import TechnologyPanel from './TechnologyPanel';
import ConnectionsRenderer from './ConnectionsRenderer';

interface FrontendViewProps {
  panels: Panel[];
  onAddPanel: (tech: Technology, x: number, y: number) => void;
  onAddClick: (e: React.MouseEvent) => void;
  onRemovePanel: (panelId: string) => void;
  onUpdatePosition: (panelId: string, x: number, y: number) => void;
}

export default function FrontendView({ panels, onAddClick, onRemovePanel, onUpdatePosition }: FrontendViewProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Проверяем, что клик не был на панели технологии
    if ((e.target as HTMLElement).closest('.tech-panel')) {
      return;
    }
    onAddClick(e);
  };

  return (
    <div className="view-wrapper" onClick={handleClick}>
      <motion.div
        className="grid-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 0.5 }}
      />
      <div className="view-header">
        <h2>Frontend</h2>
        <p className="view-subtitle">Интерфейс и взаимодействие с пользователем</p>
      </div>

      {/* Визуальные линии связи между технологиями */}
      <ConnectionsRenderer panels={panels} />

      {panels.map(panel => (
        <TechnologyPanel
          key={panel.id}
          panel={panel}
          position={{ x: panel.x, y: panel.y }}
          onRemove={onRemovePanel}
          onUpdatePosition={onUpdatePosition}
        />
      ))}

      <motion.div
        className="add-hint"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>Кликните в любом месте, чтобы добавить технологию</p>
        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
          Панели автоматически выстраиваются в список
        </p>
      </motion.div>
    </div>
  );
}

