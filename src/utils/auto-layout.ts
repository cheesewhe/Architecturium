import { Panel, Technology } from '../types';

/**
 * УТИЛИТА ДЛЯ АВТОМАТИЧЕСКОГО ПОЗИЦИОНИРОВАНИЯ ПАНЕЛЕЙ
 * 
 * Система автоматически размещает панели в вертикальный список слева
 * Каждая новая панель добавляется под предыдущую
 */

const PANEL_WIDTH = 300;
const PANEL_HEIGHT = 120;
const PANEL_SPACING = 20; // Отступ между панелями
const LEFT_MARGIN = 40; // Отступ слева
const TOP_MARGIN = 60; // Отступ сверху

/**
 * Рассчитывает позицию для новой панели
 * Панели выстраиваются вертикально, одна под другой
 */
export function calculateAutoPosition(
  existingPanels: Panel[],
  view: 'frontend' | 'backend'
): { x: number; y: number } {
  // Если панелей нет - первая панель в начальной позиции
  if (existingPanels.length === 0) {
    return {
      x: LEFT_MARGIN,
      y: TOP_MARGIN,
    };
  }

  // Находим самую нижнюю панель
  let maxY = 0;
  existingPanels.forEach(panel => {
    const bottom = panel.y + PANEL_HEIGHT;
    if (bottom > maxY) {
      maxY = bottom;
    }
  });

  // Новая панель размещается под самой нижней
  return {
    x: LEFT_MARGIN, // Все панели выравнены по левому краю
    y: maxY + PANEL_SPACING,
  };
}

/**
 * Реорганизует все панели в вертикальный список
 * Полезно после удаления панелей
 */
export function reorganizePanels(panels: Panel[]): Panel[] {
  if (panels.length === 0) return panels;

  // Сортируем панели по текущей позиции Y (сверху вниз)
  const sorted = [...panels].sort((a, b) => a.y - b.y);

  // Пересчитываем позиции для каждой панели
  return sorted.map((panel, index) => {
    if (index === 0) {
      return {
        ...panel,
        x: LEFT_MARGIN,
        y: TOP_MARGIN,
      };
    }

    const prevPanel = sorted[index - 1];
    return {
      ...panel,
      x: LEFT_MARGIN,
      y: prevPanel.y + PANEL_HEIGHT + PANEL_SPACING,
    };
  });
}

