import { Panel } from '../types';

interface ConnectionsRendererProps {
  panels: Panel[];
}

export default function ConnectionsRenderer({ panels }: ConnectionsRendererProps) {
  if (panels.length < 2) return null;

  // Рисуем линии между последовательно связанными панелями
  const connections: JSX.Element[] = [];

  panels.forEach((panel, index) => {
    // Связываем с предыдущей панелью (последовательная цепочка)
    if (index > 0) {
      const prevPanel = panels[index - 1];
      
      // Получаем размеры панели из CSS (должно совпадать с TechnologyPanel и styles.css)
      const PANEL_WIDTH = 300; // Исправлено: было 200, должно быть 300
      const PANEL_HEIGHT = 120;
      
      // ИСПРАВЛЕНО: находим точки пересечения линий с границами панелей
      // Рассчитываем направление от центра одной панели к центру другой
      const centerFromX = prevPanel.x + PANEL_WIDTH / 2;
      const centerFromY = prevPanel.y + PANEL_HEIGHT / 2;
      const centerToX = panel.x + PANEL_WIDTH / 2;
      const centerToY = panel.y + PANEL_HEIGHT / 2;
      
      const dx = centerToX - centerFromX;
      const dy = centerToY - centerFromY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance === 0) return; // Панели в одной точке
      
      // Нормализуем направление
      const normX = dx / distance;
      const normY = dy / distance;
      
      // Функция для нахождения точки пересечения линии (от центра) с границей прямоугольника
      const getBoundaryPoint = (
        centerX: number,
        centerY: number,
        dirX: number,
        dirY: number,
        x: number,
        y: number,
        width: number,
        height: number
      ): { x: number; y: number } => {
        // Находим расстояние до каждой границы
        const distToLeft = dirX > 0 ? (x - centerX) / dirX : Infinity;
        const distToRight = dirX < 0 ? (x + width - centerX) / dirX : Infinity;
        const distToTop = dirY > 0 ? (y - centerY) / dirY : Infinity;
        const distToBottom = dirY < 0 ? (y + height - centerY) / dirY : Infinity;
        
        // Выбираем ближайшую границу
        const distances = [distToLeft, distToRight, distToTop, distToBottom].filter(d => d > 0 && isFinite(d));
        
        if (distances.length === 0) {
          // Fallback: возвращаем центр (не должно случиться, но на всякий случай)
          return { x: centerX, y: centerY };
        }
        
        const minDist = Math.min(...distances);
        
        // Вычисляем точку пересечения
        return {
          x: centerX + dirX * minDist,
          y: centerY + dirY * minDist
        };
      };
      
      // Получаем точки на границах панелей
      const fromPoint = getBoundaryPoint(
        centerFromX, centerFromY, normX, normY,
        prevPanel.x, prevPanel.y, PANEL_WIDTH, PANEL_HEIGHT
      );
      
      const toPoint = getBoundaryPoint(
        centerToX, centerToY, -normX, -normY,
        panel.x, panel.y, PANEL_WIDTH, PANEL_HEIGHT
      );
      
      const actualFromX = fromPoint.x;
      const actualFromY = fromPoint.y;
      const actualToX = toPoint.x;
      const actualToY = toPoint.y;

      // Кривая Безье для плавной линии
      // Используем расстояние между точками для определения контрольных точек
      const lineLength = Math.sqrt((actualToX - actualFromX) ** 2 + (actualToY - actualFromY) ** 2);
      const controlOffset = Math.min(lineLength * 0.3, 150); // Максимум 150px
      
      // Направление от from к to
      const dirX = actualToX - actualFromX;
      const dirY = actualToY - actualFromY;
      const dirLength = Math.sqrt(dirX ** 2 + dirY ** 2);
      
      if (dirLength > 0) {
        const normalizedX = dirX / dirLength;
        const normalizedY = dirY / dirLength;
        
        const controlX1 = actualFromX + normalizedX * controlOffset;
        const controlY1 = actualFromY + normalizedY * controlOffset;
        const controlX2 = actualToX - normalizedX * controlOffset;
        const controlY2 = actualToY - normalizedY * controlOffset;
        
        connections.push(
          <path
            key={`connection-${prevPanel.id}-${panel.id}`}
            d={`M ${actualFromX} ${actualFromY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${actualToX} ${actualToY}`}
            stroke="#667eea"
            strokeWidth="2"
            fill="none"
            strokeDasharray="6,6"
            opacity="0.6"
            className="connection-line"
          />
        );
      }
    }
  });

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'visible',
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {connections}
    </svg>
  );
}

