import { Challenge, AppSchema, AppMetrics, Budget, ProjectTimeline } from '../types';

/**
 * Система целей и челленджей
 * 
 * Управляет проверкой выполнения целей и челленджей
 */

/**
 * Обновляет прогресс целей челленджа
 */
export function updateChallengeObjectives(
  challenge: Challenge,
  schema: AppSchema,
  metrics: AppMetrics,
  budget: Budget,
  timeline: ProjectTimeline
): Challenge {
  const techIds = [
    ...schema.frontend.map(p => p.technology.id),
    ...schema.backend.map(p => p.technology.id),
  ].join(',');

  const totalScore = (metrics.ux.performance + metrics.ux.stability + metrics.ux.userFriendliness) / 3 +
    (metrics.dev.developmentSpeed + metrics.dev.maintainability + (100 - metrics.dev.complexity) - metrics.dev.cost) / 4;
  const finalScore = totalScore / 2;

  const updatedObjectives = challenge.objectives.map(obj => {
    let current: number | string = obj.current;
    let completed = obj.completed;

    switch (obj.type) {
      case 'metric': {
        if (obj.id === 'performance') current = metrics.ux.performance;
        else if (obj.id === 'stability') current = metrics.ux.stability;
        else if (obj.id === 'maintainability') current = metrics.dev.maintainability;
        else if (obj.id === 'complexity') current = metrics.dev.complexity;
        else if (obj.id === 'score') current = finalScore;
        
        completed = typeof current === 'number' && current >= (obj.target as number);
        break;
      }

      case 'technology': {
        current = techIds;
        const targetTechs = (obj.target as string).split(',');
        completed = targetTechs.some(tech => techIds.includes(tech));
        break;
      }

      case 'budget': {
        current = budget.spent;
        completed = budget.spent <= (obj.target as number);
        break;
      }

      case 'time': {
        current = timeline.daysElapsed;
        completed = timeline.daysElapsed <= (obj.target as number);
        break;
      }
    }

    return {
      ...obj,
      current,
      completed,
    };
  });

  return {
    ...challenge,
    objectives: updatedObjectives,
  };
}

/**
 * Проверяет, выполнен ли челлендж
 */
export function isChallengeComplete(challenge: Challenge): boolean {
  return challenge.objectives.every(obj => obj.completed);
}

/**
 * Проверяет, нарушены ли ограничения челленджа
 */
export function checkChallengeConstraints(
  challenge: Challenge,
  schema: AppSchema,
  budget: Budget,
  timeline: ProjectTimeline
): { violated: boolean; message?: string } {
  const allPanels = [...schema.frontend, ...schema.backend];
  const techIds = allPanels.map(p => p.technology.id);

  if (challenge.constraints) {
    // Проверка максимального количества технологий
    if (challenge.constraints.maxTechnologies && allPanels.length > challenge.constraints.maxTechnologies) {
      return {
        violated: true,
        message: `Превышено максимальное количество технологий: ${challenge.constraints.maxTechnologies}`,
      };
    }

    // Проверка бюджета
    if (challenge.constraints.maxBudget && budget.spent > challenge.constraints.maxBudget) {
      return {
        violated: true,
        message: `Превышен максимальный бюджет: $${challenge.constraints.maxBudget.toLocaleString()}`,
      };
    }

    // Проверка времени
    if (challenge.constraints.maxTime && timeline.daysElapsed > challenge.constraints.maxTime) {
      return {
        violated: true,
        message: `Превышено максимальное время: ${challenge.constraints.maxTime} дней`,
      };
    }

    // Проверка обязательных технологий
    if (challenge.constraints.requiredTechnologies) {
      const missing = challenge.constraints.requiredTechnologies.filter(
        tech => !techIds.includes(tech)
      );
      if (missing.length > 0) {
        return {
          violated: true,
          message: `Отсутствуют обязательные технологии: ${missing.join(', ')}`,
        };
      }
    }

    // Проверка запрещённых технологий
    if (challenge.constraints.forbiddenTechnologies) {
      const used = challenge.constraints.forbiddenTechnologies.filter(
        tech => techIds.includes(tech)
      );
      if (used.length > 0) {
        return {
          violated: true,
          message: `Использованы запрещённые технологии: ${used.join(', ')}`,
        };
      }
    }
  }

  return { violated: false };
}

/**
 * Получает прогресс челленджа в процентах
 */
export function getChallengeProgress(challenge: Challenge): number {
  const completed = challenge.objectives.filter(obj => obj.completed).length;
  return (completed / challenge.objectives.length) * 100;
}

