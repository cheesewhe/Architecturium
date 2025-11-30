import { GameEvent, AppMetrics, Budget, ProjectTimeline } from '../types';
import { gameEvents } from '../data/events';

/**
 * Система случайных событий
 * 
 * Генерирует и обрабатывает случайные события во время разработки
 */

/**
 * Генерирует случайное событие на основе вероятностей
 * 
 * @param daysElapsed - Количество прошедших дней
 * @returns Случайное событие или null
 */
export function generateRandomEvent(daysElapsed: number): GameEvent | null {
  // Вероятность события увеличивается со временем
  const baseProbability = 0.05;
  const timeMultiplier = Math.min(1.0, daysElapsed / 30); // Максимум через 30 дней
  const eventProbability = baseProbability * (1 + timeMultiplier);

  if (Math.random() > eventProbability) {
    return null;
  }

  // Фильтруем события по вероятности
  const availableEvents = gameEvents.filter(e => Math.random() <= e.probability);
  
  if (availableEvents.length === 0) {
    return null;
  }

  // Выбираем случайное событие
  const randomIndex = Math.floor(Math.random() * availableEvents.length);
  return availableEvents[randomIndex];
}

/**
 * Применяет эффекты события к метрикам
 */
export function applyEventEffects(
  metrics: AppMetrics,
  budget: Budget,
  timeline: ProjectTimeline,
  effects: GameEvent['effects']
): { metrics: AppMetrics; budget: Budget; timeline: ProjectTimeline } {
  const newMetrics = { ...metrics };
  let newBudget = { ...budget };
  let newTimeline = { ...timeline };

  if (!effects) {
    return { metrics: newMetrics, budget: newBudget, timeline: newTimeline };
  }

  // Применяем изменения метрик
  if (effects.metrics) {
    if (effects.metrics.ux) {
      newMetrics.ux = {
        performance: Math.max(0, Math.min(100, newMetrics.ux.performance + (effects.metrics.ux.performance || 0))),
        stability: Math.max(0, Math.min(100, newMetrics.ux.stability + (effects.metrics.ux.stability || 0))),
        userFriendliness: Math.max(0, Math.min(100, newMetrics.ux.userFriendliness + (effects.metrics.ux.userFriendliness || 0))),
      };
    }
    if (effects.metrics.dev) {
      newMetrics.dev = {
        developmentSpeed: Math.max(0, Math.min(100, newMetrics.dev.developmentSpeed + (effects.metrics.dev.developmentSpeed || 0))),
        maintainability: Math.max(0, Math.min(100, newMetrics.dev.maintainability + (effects.metrics.dev.maintainability || 0))),
        complexity: Math.max(0, Math.min(100, newMetrics.dev.complexity + (effects.metrics.dev.complexity || 0))),
        cost: Math.max(0, Math.min(100, newMetrics.dev.cost + (effects.metrics.dev.cost || 0))),
      };
    }
  }

  // Применяем изменения бюджета
  if (effects.budget) {
    newBudget = {
      ...newBudget,
      spent: Math.max(0, newBudget.spent + effects.budget),
      remaining: Math.max(0, newBudget.remaining - effects.budget),
    };
  }

  // Применяем изменения таймлайна
  if (effects.timeline) {
    newTimeline = {
      ...newTimeline,
      daysElapsed: newTimeline.daysElapsed + effects.timeline.days,
    };
  }

  return { metrics: newMetrics, budget: newBudget, timeline: newTimeline };
}

/**
 * Получает иконку для типа события
 */
export function getEventIcon(type: GameEvent['type']): string {
  const icons: Record<GameEvent['type'], string> = {
    positive: '✨',
    negative: '⚠️',
    neutral: '💡',
  };
  return icons[type];
}

/**
 * Получает цвет для типа события
 */
export function getEventColor(type: GameEvent['type']): string {
  const colors: Record<GameEvent['type'], string> = {
    positive: '#10b981',
    negative: '#ef4444',
    neutral: '#4a9eff',
  };
  return colors[type];
}

