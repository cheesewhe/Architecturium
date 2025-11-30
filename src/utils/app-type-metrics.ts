import { AppType, AppMetrics } from '../types';

/**
 * Система расчёта метрик для разных типов приложений
 * 
 * Адаптирует систему расчёта под специфические требования типа приложения
 */

/**
 * Проверяет соответствие метрик требованиям типа приложения
 */
export function checkAppTypeRequirements(
  metrics: AppMetrics,
  appType: AppType
): { met: boolean; score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 100;

  // Проверка UX метрик
  if (metrics.ux.performance < appType.requirements.performance) {
    issues.push(`Производительность (${metrics.ux.performance.toFixed(1)}) ниже требуемой (${appType.requirements.performance})`);
    score -= 10;
  }

  if (metrics.ux.stability < appType.requirements.stability) {
    issues.push(`Стабильность (${metrics.ux.stability.toFixed(1)}) ниже требуемой (${appType.requirements.stability})`);
    score -= 15;
  }

  if (metrics.ux.userFriendliness < appType.requirements.userFriendliness) {
    issues.push(`Удобство (${metrics.ux.userFriendliness.toFixed(1)}) ниже требуемого (${appType.requirements.userFriendliness})`);
    score -= 5;
  }

  // Проверка Dev метрик
  if (metrics.dev.developmentSpeed < appType.requirements.developmentSpeed) {
    issues.push(`Скорость разработки (${metrics.dev.developmentSpeed.toFixed(1)}) ниже требуемой (${appType.requirements.developmentSpeed})`);
    score -= 5;
  }

  if (metrics.dev.maintainability < appType.requirements.maintainability) {
    issues.push(`Поддерживаемость (${metrics.dev.maintainability.toFixed(1)}) ниже требуемой (${appType.requirements.maintainability})`);
    score -= 10;
  }

  if (metrics.dev.complexity > appType.requirements.maxComplexity) {
    issues.push(`Сложность (${metrics.dev.complexity.toFixed(1)}) превышает допустимую (${appType.requirements.maxComplexity})`);
    score -= 15;
  }

  return {
    met: issues.length === 0,
    score: Math.max(0, score),
    issues,
  };
}

/**
 * Рассчитывает бонусы/штрафы для типа приложения
 */
export function calculateAppTypeModifiers(
  metrics: AppMetrics,
  appType: AppType
): Partial<AppMetrics> {
  const modifiers: Partial<AppMetrics> = {
    // @ts-expect-error - Partial types are intentionally used here, ux and dev are initialized as empty objects
    ux: {} as Partial<AppMetrics['ux']>,
    // @ts-expect-error - Partial types are intentionally used here, ux and dev are initialized as empty objects
    dev: {} as Partial<AppMetrics['dev']>,
  };

  // Бонус за использование рекомендованных технологий (упрощённо)
  // В реальности это должно проверяться по технологиям в схеме
  
  // Штраф за превышение сложности
  if (metrics.dev.complexity > appType.requirements.maxComplexity) {
    modifiers.dev!.complexity = -5; // Дополнительный штраф
  }

  // Бонус за соответствие требованиям
  const requirements = checkAppTypeRequirements(metrics, appType);
  if (requirements.met) {
    modifiers.ux!.performance = 3;
    modifiers.ux!.stability = 3;
    modifiers.dev!.maintainability = 3;
  }

  return modifiers;
}

