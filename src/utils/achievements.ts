import { Achievement, AppSchema, AppMetrics, Technology, Budget } from '../types';
import { achievements } from '../data/achievements';
import { calculateTotalCost } from './budget';

/**
 * Система достижений
 * 
 * Проверяет условия для разблокировки достижений
 */

/**
 * Проверяет все достижения и возвращает разблокированные
 * 
 * @param schema - Схема приложения
 * @param metrics - Метрики проекта
 * @param budget - Бюджет проекта
 * @param unlockedIds - Массив ID уже разблокированных достижений
 * @returns Массив новых разблокированных достижений
 */
export function checkAchievements(
  schema: AppSchema,
  metrics: AppMetrics,
  budget: Budget,
  unlockedIds: string[] = []
): Achievement[] {
  const allPanels = [...schema.frontend, ...schema.backend];
  const technologies = allPanels.map(p => p.technology);
  const techIds = technologies.map(t => t.id);

  const totalScore = (metrics.ux.performance + metrics.ux.stability + metrics.ux.userFriendliness) / 3 +
    (metrics.dev.developmentSpeed + metrics.dev.maintainability + (100 - metrics.dev.complexity) - metrics.dev.cost) / 4;
  const finalScore = totalScore / 2;

  const newlyUnlocked: Achievement[] = [];

  achievements.forEach(achievement => {
    // Пропускаем уже разблокированные
    if (unlockedIds.includes(achievement.id)) {
      return;
    }

    let shouldUnlock = false;

    switch (achievement.id) {
      case 'first-launch':
        shouldUnlock = allPanels.length > 0;
        break;

      case 'full-stack':
        shouldUnlock = schema.frontend.length > 0 && schema.backend.length > 0;
        break;

      case 'perfect-score':
        shouldUnlock = finalScore > 90;
        break;

      case 'modern-stack':
        shouldUnlock = techIds.includes('ts') && techIds.includes('react') && techIds.includes('node');
        break;

      case 'enterprise':
        shouldUnlock = techIds.includes('java') && techIds.includes('spring') && techIds.includes('postgresql');
        break;

      case 'python-stack':
        shouldUnlock = techIds.includes('python') && techIds.includes('django') && techIds.includes('postgresql');
        break;

      case 'microservices':
        shouldUnlock = techIds.includes('microservices') && 
          (techIds.includes('kafka') || techIds.includes('rabbitmq'));
        break;

      case 'cloud-native':
        shouldUnlock = techIds.includes('docker') && techIds.includes('kubernetes');
        break;

      case 'high-performance':
        shouldUnlock = metrics.ux.performance > 90;
        break;

      case 'rocket-speed':
        shouldUnlock = metrics.ux.performance >= 100;
        break;

      case 'caching-master':
        shouldUnlock = techIds.includes('redis') && 
          (techIds.includes('postgresql') || techIds.includes('mongodb') || techIds.includes('mysql'));
        break;

      case 'budget-master':
        shouldUnlock = budget.spent < 2000;
        break;

      case 'frugal':
        shouldUnlock = technologies.every(tech => {
          const cost = calculateTotalCost([tech]);
          return cost === 0;
        }) && technologies.length > 0;
        break;

      case 'big-spender':
        shouldUnlock = budget.spent > 8000;
        break;

      case 'minimalist':
        shouldUnlock = allPanels.length === 3 && finalScore > 80;
        break;

      case 'complexity-master':
        shouldUnlock = metrics.dev.complexity < 30;
        break;

      case 'tech-collector':
        shouldUnlock = allPanels.length >= 10;
        break;

      case 'compatibility-king':
        // Проверяем, что все технологии имеют только preferred связи
        shouldUnlock = allPanels.length >= 3 && checkAllPreferred(technologies);
        break;

      case 'rustacean':
        shouldUnlock = techIds.includes('rust');
        break;

      case 'go-gopher':
        shouldUnlock = techIds.includes('go');
        break;
    }

    if (shouldUnlock) {
      newlyUnlocked.push({
        ...achievement,
        unlocked: true,
        unlockedAt: new Date(),
      });
    }
  });

  return newlyUnlocked;
}

/**
 * Проверяет, что все технологии имеют только preferred связи
 */
function checkAllPreferred(technologies: Technology[]): boolean {
  if (technologies.length < 2) return false;

  for (let i = 0; i < technologies.length; i++) {
    for (let j = i + 1; j < technologies.length; j++) {
      const tech1 = technologies[i];
      const tech2 = technologies[j];

      // Проверяем, что они preferred друг для друга
      const isPreferred1 = tech1.compatibility?.preferred.includes(tech2.id) ?? false;
      const isPreferred2 = tech2.compatibility?.preferred.includes(tech1.id) ?? false;

      // Если есть incompatible или только compatible - не подходит
      const isIncompatible1 = tech1.compatibility?.incompatible.includes(tech2.id) ?? false;
      const isIncompatible2 = tech2.compatibility?.incompatible.includes(tech1.id) ?? false;

      if (isIncompatible1 || isIncompatible2) {
        return false;
      }

      // Если нет preferred связи хотя бы в одну сторону - не подходит
      if (!isPreferred1 && !isPreferred2) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Получает все разблокированные достижения
 * 
 * @param unlockedIds - Массив ID разблокированных достижений
 * @returns Массив разблокированных достижений
 */
export function getUnlockedAchievements(unlockedIds: string[]): Achievement[] {
  return achievements
    .filter(a => unlockedIds.includes(a.id))
    .map(a => ({ ...a, unlocked: true }));
}

/**
 * Получает все заблокированные достижения
 * 
 * @param unlockedIds - Массив ID разблокированных достижений
 * @returns Массив заблокированных достижений
 */
export function getLockedAchievements(unlockedIds: string[]): Achievement[] {
  return achievements.filter(a => !unlockedIds.includes(a.id));
}

