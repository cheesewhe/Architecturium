import { ProjectTimeline, ProjectPhase, AppMetrics } from '../types';

/**
 * Система временной прогрессии проекта
 * 
 * Управляет фазами разработки: Planning → MVP → Beta → Production → Maintenance
 */

const PHASE_DURATIONS: Record<ProjectPhase, number> = {
  planning: 7,      // 7 дней
  mvp: 30,          // 30 дней
  beta: 60,         // 60 дней
  production: 90,   // 90 дней
  maintenance: Infinity, // Бесконечно
};

/**
 * Рассчитывает скорость разработки на основе метрик
 * 
 * @param metrics - Метрики проекта
 * @returns Множитель скорости (1.0 = нормальная скорость)
 */
function calculateDevelopmentSpeed(metrics: AppMetrics): number {
  // Скорость разработки зависит от:
  // - Development Speed (чем выше, тем быстрее)
  // - Complexity (чем выше, тем медленнее)
  // - Maintainability (чем выше, тем быстрее)
  
  const speedFactor = metrics.dev.developmentSpeed / 100;
  const complexityPenalty = 1 - (metrics.dev.complexity / 200); // Сложность замедляет
  const maintainabilityBonus = metrics.dev.maintainability / 200; // Поддерживаемость ускоряет
  
  return Math.max(0.5, Math.min(2.0, speedFactor * complexityPenalty + maintainabilityBonus));
}

/**
 * Создаёт начальный таймлайн проекта
 * 
 * @returns Начальный таймлайн
 */
export function createTimeline(): ProjectTimeline {
  return {
    currentPhase: 'planning',
    phaseProgress: 0,
    totalProgress: 0,
    daysElapsed: 0,
    estimatedDaysRemaining: PHASE_DURATIONS.planning,
  };
}

/**
 * Обновляет таймлайн проекта
 * 
 * @param timeline - Текущий таймлайн
 * @param metrics - Метрики проекта
 * @param daysPassed - Количество прошедших дней
 * @returns Обновлённый таймлайн
 */
export function updateTimeline(
  timeline: ProjectTimeline,
  metrics: AppMetrics,
  daysPassed: number = 1
): ProjectTimeline {
  const speedMultiplier = calculateDevelopmentSpeed(metrics);
  const effectiveDays = daysPassed * speedMultiplier;
  
  let newTimeline = { ...timeline };
  newTimeline.daysElapsed += effectiveDays;
  
  // Обновляем прогресс текущей фазы
  const phaseDuration = PHASE_DURATIONS[newTimeline.currentPhase];
  newTimeline.phaseProgress += (effectiveDays / phaseDuration) * 100;
  
  // Проверяем, нужно ли перейти к следующей фазе
  if (newTimeline.phaseProgress >= 100 && newTimeline.currentPhase !== 'maintenance') {
    newTimeline = advanceToNextPhase(newTimeline);
  }
  
  // Обновляем общий прогресс
  newTimeline.totalProgress = calculateTotalProgress(newTimeline);
  
  // Обновляем оставшиеся дни
  const remainingInPhase = phaseDuration - (newTimeline.phaseProgress / 100 * phaseDuration);
  newTimeline.estimatedDaysRemaining = remainingInPhase / speedMultiplier;
  
  return newTimeline;
}

/**
 * Переходит к следующей фазе проекта
 */
function advanceToNextPhase(timeline: ProjectTimeline): ProjectTimeline {
  const phaseOrder: ProjectPhase[] = ['planning', 'mvp', 'beta', 'production', 'maintenance'];
  const currentIndex = phaseOrder.indexOf(timeline.currentPhase);
  
  if (currentIndex < phaseOrder.length - 1) {
    const nextPhase = phaseOrder[currentIndex + 1];
    return {
      ...timeline,
      currentPhase: nextPhase,
      phaseProgress: 0,
      estimatedDaysRemaining: PHASE_DURATIONS[nextPhase],
    };
  }
  
  return timeline;
}

/**
 * Рассчитывает общий прогресс проекта
 */
function calculateTotalProgress(timeline: ProjectTimeline): number {
  const phaseOrder: ProjectPhase[] = ['planning', 'mvp', 'beta', 'production', 'maintenance'];
  const currentIndex = phaseOrder.indexOf(timeline.currentPhase);
  
  // Прогресс завершённых фаз
  const completedPhases = currentIndex;
  const totalPhases = phaseOrder.length - 1; // Исключаем maintenance
  
  // Прогресс текущей фазы
  const currentPhaseProgress = timeline.phaseProgress / 100;
  
  return ((completedPhases + currentPhaseProgress) / totalPhases) * 100;
}

/**
 * Получает название фазы на русском
 */
export function getPhaseName(phase: ProjectPhase): string {
  const names: Record<ProjectPhase, string> = {
    planning: 'Планирование',
    mvp: 'MVP',
    beta: 'Бета-версия',
    production: 'Продакшн',
    maintenance: 'Поддержка',
  };
  return names[phase];
}

/**
 * Получает описание фазы
 */
export function getPhaseDescription(phase: ProjectPhase): string {
  const descriptions: Record<ProjectPhase, string> = {
    planning: 'Проектирование архитектуры и выбор технологий',
    mvp: 'Разработка минимально жизнеспособного продукта',
    beta: 'Тестирование и доработка функционала',
    production: 'Запуск в продакшн и масштабирование',
    maintenance: 'Поддержка и развитие продукта',
  };
  return descriptions[phase];
}

