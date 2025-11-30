import { AppSchema, AppMetrics, Technology } from '../types';

/**
 * СИСТЕМА РАСЧЁТА ПАРАМЕТРОВ ПРОЕКТА
 * 
 * Эта система учитывает:
 * 1. Базовые параметры технологий
 * 2. Совместимость между технологиями
 * 3. Специфические правила для комбинаций
 * 4. Реалистичное влияние на разработку
 */

/**
 * Рассчитывает метрики проекта на основе выбранных технологий
 * 
 * Использует многоуровневую систему расчёта:
 * - Базовые параметры (средние значения)
 * - Скрытые модификаторы (200+ взаимодействий)
 * - Совместимость (preferred/compatible/incompatible)
 * - Специфические правила (17 правил)
 * - Штрафы за проблемы
 * 
 * @param schema - Схема приложения с выбранными технологиями
 * @returns Метрики проекта (UX и Dev параметры)
 * 
 * @example
 * ```typescript
 * const schema = {
 *   frontend: [{ id: '1', technology: reactTech, x: 0, y: 0, connections: [] }],
 *   backend: [{ id: '2', technology: nodeTech, x: 0, y: 0, connections: [] }]
 * };
 * const metrics = calculateAdvancedMetrics(schema);
 * console.log(metrics.ux.performance); // 75.5
 * ```
 */
export function calculateAdvancedMetrics(schema: AppSchema): AppMetrics {
  const allPanels = [...schema.frontend, ...schema.backend];
  
  if (allPanels.length === 0) {
    return getEmptyMetrics();
  }

  const technologies = allPanels.map(p => p.technology);
  const techIds = technologies.map(t => t.id);

  // Базовые метрики из технологий
  const baseMetrics = calculateBaseMetrics(technologies);

  // Влияние совместимости
  const compatibilityImpact = calculateCompatibilityImpact(technologies);

  // СКРЫТЫЕ модификаторы - детальное влияние технологий друг на друга
  const hiddenModifiers = applyHiddenModifiers(technologies);

  // Специфические правила
  const specificRules = applySpecificRules(techIds);

  // Штрафы за несовместимости
  const penalties = calculatePenalties(technologies);

  // Объединяем все влияния
  return combineMetrics(baseMetrics, compatibilityImpact, hiddenModifiers, specificRules, penalties);
}

function getEmptyMetrics(): AppMetrics {
  return {
    ux: {
      performance: 0,
      stability: 0,
      userFriendliness: 0,
    },
    dev: {
      developmentSpeed: 0,
      maintainability: 0,
      complexity: 0,
      cost: 0,
    },
  };
}

function calculateBaseMetrics(technologies: Technology[]): AppMetrics {
  const count = technologies.length;
  
  // Средние значения базовых параметров
  const avgPerformance = technologies.reduce((sum, t) => sum + t.performance, 0) / count;
  const avgStability = technologies.reduce((sum, t) => sum + t.stability, 0) / count;
  const avgUsability = technologies.reduce((sum, t) => sum + t.userFriendliness, 0) / count;
  const avgCost = technologies.reduce((sum, t) => sum + t.cost, 0) / count;

  // Сложность растёт с количеством технологий
  const complexityFromCount = Math.min(100, 30 + (count * 8));

  return {
    ux: {
      performance: avgPerformance,
      stability: avgStability,
      userFriendliness: avgUsability,
    },
    dev: {
      developmentSpeed: avgUsability, // Удобные технологии = быстрая разработка
      maintainability: avgStability,  // Стабильные технологии = легко поддерживать
      complexity: complexityFromCount,
      cost: avgCost,
    },
  };
}

// Применяем СКРЫТЫЕ модификаторы - детальное влияние технологий
function applyHiddenModifiers(technologies: Technology[]): Partial<AppMetrics> {
  const impact: Partial<AppMetrics> = {
    // @ts-expect-error - Partial types are intentionally used here, ux and dev are initialized as empty objects
    ux: {} as Partial<AppMetrics['ux']>,
    // @ts-expect-error - Partial types are intentionally used here, ux and dev are initialized as empty objects
    dev: {} as Partial<AppMetrics['dev']>,
  };
  
  technologies.forEach((tech) => {
    if (!tech.modifiers) return;

    // Для каждого модификатора этой технологии
    tech.modifiers.forEach((modifier) => {
      // Проверяем, есть ли целевая технология в проекте
      const hasTargetTech = technologies.some(t => t.id === modifier.targetTechId);
      
      if (hasTargetTech) {
        // Применяем UX модификаторы
        if (modifier.ux && impact.ux) {
          if (modifier.ux.performance !== undefined) {
            impact.ux!.performance = (impact.ux!.performance || 0) + modifier.ux.performance;
          }
          if (modifier.ux.stability !== undefined) {
            impact.ux!.stability = (impact.ux!.stability || 0) + modifier.ux.stability;
          }
          if (modifier.ux.userFriendliness !== undefined) {
            impact.ux!.userFriendliness = (impact.ux!.userFriendliness || 0) + modifier.ux.userFriendliness;
          }
        }

        // Применяем Dev модификаторы
        if (modifier.dev && impact.dev) {
          if (modifier.dev.developmentSpeed !== undefined) {
            impact.dev!.developmentSpeed = (impact.dev!.developmentSpeed || 0) + modifier.dev.developmentSpeed;
          }
          if (modifier.dev.maintainability !== undefined) {
            impact.dev!.maintainability = (impact.dev!.maintainability || 0) + modifier.dev.maintainability;
          }
          if (modifier.dev.complexity !== undefined) {
            impact.dev!.complexity = (impact.dev!.complexity || 0) + modifier.dev.complexity;
          }
          if (modifier.dev.cost !== undefined) {
            impact.dev!.cost = (impact.dev!.cost || 0) + modifier.dev.cost;
          }
        }
      }
    });
  });

  return impact;
}

function calculateCompatibilityImpact(technologies: Technology[]): Partial<AppMetrics> {
  const impact: Partial<AppMetrics> = {
    // @ts-expect-error - Partial types are intentionally used here, ux and dev are initialized as empty objects
    ux: {} as Partial<AppMetrics['ux']>,
    // @ts-expect-error - Partial types are intentionally used here, ux and dev are initialized as empty objects
    dev: {} as Partial<AppMetrics['dev']>,
  };
  
  technologies.forEach((tech) => {
    if (!tech.compatibility) return;

    technologies.forEach((otherTech) => {
      if (tech.id === otherTech.id) return;

      // PREFERRED - идеальные комбинации
      if (tech.compatibility && tech.compatibility.preferred.includes(otherTech.id)) {
        // Бонусы для рекомендованных технологий
        impact.ux!.performance = (impact.ux!.performance || 0) + 3;
        impact.ux!.stability = (impact.ux!.stability || 0) + 2;
        impact.dev!.developmentSpeed = (impact.dev!.developmentSpeed || 0) + 3;
        impact.dev!.maintainability = (impact.dev!.maintainability || 0) + 3;
        impact.dev!.complexity = (impact.dev!.complexity || 0) - 2; // Меньше сложность
      }

      // COMPATIBLE - работает, но с нюансами
      if (tech.compatibility && tech.compatibility.compatible.includes(otherTech.id)) {
        // Небольшие бонусы
        impact.ux!.performance = (impact.ux!.performance || 0) + 1;
        impact.dev!.developmentSpeed = (impact.dev!.developmentSpeed || 0) + 1;
        // Но чуть больше сложности
        impact.dev!.complexity = (impact.dev!.complexity || 0) + 1;
      }

      // INCOMPATIBLE - не рекомендуется
      if (tech.compatibility && tech.compatibility.incompatible.includes(otherTech.id)) {
        // Серьёзные штрафы
        impact.ux!.performance = (impact.ux!.performance || 0) - 10;
        impact.ux!.stability = (impact.ux!.stability || 0) - 8;
        impact.dev!.developmentSpeed = (impact.dev!.developmentSpeed || 0) - 15;
        impact.dev!.complexity = (impact.dev!.complexity || 0) + 20; // Намного сложнее!
        impact.dev!.cost = (impact.dev!.cost || 0) + 15; // Дороже
      }
    });
  });

  return impact;
}

function applySpecificRules(techIds: string[]): Partial<AppMetrics> {
  const impact: Partial<AppMetrics> = {
    // @ts-expect-error - Partial types are intentionally used here, ux and dev are initialized as empty objects
    ux: {} as Partial<AppMetrics['ux']>,
    // @ts-expect-error - Partial types are intentionally used here, ux and dev are initialized as empty objects
    dev: {} as Partial<AppMetrics['dev']>,
  };

  // ПРАВИЛО 1: Go - меньше библиотек = ниже скорость разработки
  if (techIds.includes('go')) {
    impact.dev!.developmentSpeed = (impact.dev!.developmentSpeed || 0) - 8;
    impact.dev!.complexity = (impact.dev!.complexity || 0) + 5;
    impact.ux!.performance = (impact.ux!.performance || 0) + 10; // Но быстрее!
  }

  // ПРАВИЛО 2: TypeScript - типизация снижает баги, но замедляет разработку
  if (techIds.includes('ts')) {
    impact.ux!.stability = (impact.ux!.stability || 0) + 8;
    impact.dev!.maintainability = (impact.dev!.maintainability || 0) + 10;
    impact.dev!.developmentSpeed = (impact.dev!.developmentSpeed || 0) - 3; // Чуть медленнее
    impact.dev!.complexity = (impact.dev!.complexity || 0) + 5; // Нужно изучить
  }

  // ПРАВИЛО 3: JavaScript - быстро начать, но проблемы с масштабом
  if (techIds.includes('js') && !techIds.includes('ts')) {
    impact.dev!.developmentSpeed = (impact.dev!.developmentSpeed || 0) + 10;
    impact.ux!.stability = (impact.ux!.stability || 0) - 5;
    impact.dev!.maintainability = (impact.dev!.maintainability || 0) - 5;
  }

  // ПРАВИЛО 4: NestJS с TypeScript - идеально
  if (techIds.includes('nestjs') && techIds.includes('ts')) {
    impact.ux!.stability = (impact.ux!.stability || 0) + 10;
    impact.dev!.maintainability = (impact.dev!.maintainability || 0) + 12;
    impact.dev!.complexity = (impact.dev!.complexity || 0) + 8; // Но сложнее для новичков
  }

  // ПРАВИЛО 5: NestJS БЕЗ TypeScript - плохо
  if (techIds.includes('nestjs') && !techIds.includes('ts')) {
    impact.ux!.stability = (impact.ux!.stability || 0) - 15;
    impact.dev!.complexity = (impact.dev!.complexity || 0) + 25; // Очень сложно!
  }

  // ПРАВИЛО 6: Microservices без message broker - проблемы
  if (techIds.includes('microservices') && 
      !techIds.includes('kafka') && !techIds.includes('rabbitmq')) {
    impact.ux!.stability = (impact.ux!.stability || 0) - 12;
    impact.dev!.complexity = (impact.dev!.complexity || 0) + 15;
    impact.dev!.maintainability = (impact.dev!.maintainability || 0) - 10;
  }

  // ПРАВИЛО 7: Microservices С message broker - отлично
  if (techIds.includes('microservices') && 
      (techIds.includes('kafka') || techIds.includes('rabbitmq'))) {
    impact.ux!.performance = (impact.ux!.performance || 0) + 8;
    impact.ux!.stability = (impact.ux!.stability || 0) + 6;
    impact.dev!.complexity = (impact.dev!.complexity || 0) + 10; // Всё равно сложно
  }

  // ПРАВИЛО 8: Redis + основная БД - кеширование даёт бонусы
  if (techIds.includes('redis') && 
      (techIds.includes('postgresql') || techIds.includes('mongodb') || techIds.includes('mysql'))) {
    impact.ux!.performance = (impact.ux!.performance || 0) + 15;
    impact.ux!.userFriendliness = (impact.ux!.userFriendliness || 0) + 5;
    impact.dev!.complexity = (impact.dev!.complexity || 0) + 5; // Чуть сложнее настроить
  }

  // ПРАВИЛО 9: Docker + Kubernetes - полноценная контейнеризация
  if (techIds.includes('docker') && techIds.includes('kubernetes')) {
    impact.ux!.stability = (impact.ux!.stability || 0) + 10;
    impact.dev!.maintainability = (impact.dev!.maintainability || 0) + 8;
    impact.dev!.complexity = (impact.dev!.complexity || 0) + 20; // Очень сложно!
    impact.dev!.cost = (impact.dev!.cost || 0) + 15;
  }

  // ПРАВИЛО 10: Kubernetes БЕЗ Docker - не имеет смысла
  if (techIds.includes('kubernetes') && !techIds.includes('docker')) {
    impact.ux!.stability = (impact.ux!.stability || 0) - 20;
    impact.dev!.complexity = (impact.dev!.complexity || 0) + 30; // Абсурд!
    impact.dev!.developmentSpeed = (impact.dev!.developmentSpeed || 0) - 20;
  }

  // ПРАВИЛО 11: MongoDB + GraphQL - современный стек
  if (techIds.includes('mongodb') && techIds.includes('graphql')) {
    impact.ux!.performance = (impact.ux!.performance || 0) + 7;
    impact.dev!.developmentSpeed = (impact.dev!.developmentSpeed || 0) + 8;
  }

  // ПРАВИЛО 12: PostgreSQL + REST - классика
  if (techIds.includes('postgresql') && techIds.includes('rest')) {
    impact.ux!.stability = (impact.ux!.stability || 0) + 6;
    impact.dev!.maintainability = (impact.dev!.maintainability || 0) + 7;
  }

  // ПРАВИЛО 13: Python - простой код, но медленный
  if (techIds.includes('python')) {
    impact.dev!.developmentSpeed = (impact.dev!.developmentSpeed || 0) + 12;
    impact.dev!.complexity = (impact.dev!.complexity || 0) - 5;
    impact.ux!.performance = (impact.ux!.performance || 0) - 10; // Медленнее
  }

  // ПРАВИЛО 14: Rust - сложный, но быстрый
  if (techIds.includes('rust')) {
    impact.ux!.performance = (impact.ux!.performance || 0) + 15;
    impact.ux!.stability = (impact.ux!.stability || 0) + 12;
    impact.dev!.developmentSpeed = (impact.dev!.developmentSpeed || 0) - 20; // Очень медленная разработка
    impact.dev!.complexity = (impact.dev!.complexity || 0) + 25; // Очень сложно
  }

  // ПРАВИЛО 15: Nginx + backend framework - производительность
  if (techIds.includes('nginx') && 
      (techIds.includes('node') || techIds.includes('nestjs') || 
       techIds.includes('express') || techIds.includes('django') || techIds.includes('fastapi'))) {
    impact.ux!.performance = (impact.ux!.performance || 0) + 8;
    impact.ux!.stability = (impact.ux!.stability || 0) + 5;
  }

  // ПРАВИЛО 16: JWT/OAuth - безопасность
  if (techIds.includes('jwt') || techIds.includes('oauth')) {
    impact.ux!.stability = (impact.ux!.stability || 0) + 5;
    impact.dev!.complexity = (impact.dev!.complexity || 0) + 6;
  }

  // ПРАВИЛО 17: Полный стек на одном языке (JS/TS + Node)
  if ((techIds.includes('js') || techIds.includes('ts')) && techIds.includes('node')) {
    impact.dev!.developmentSpeed = (impact.dev!.developmentSpeed || 0) + 10;
    impact.dev!.maintainability = (impact.dev!.maintainability || 0) + 8;
    impact.dev!.complexity = (impact.dev!.complexity || 0) - 5; // Проще - один язык!
  }

  return impact;
}

function calculatePenalties(technologies: Technology[]): Partial<AppMetrics> {
  const impact: Partial<AppMetrics> = {
    // @ts-expect-error - Partial types are intentionally used here, ux and dev are initialized as empty objects
    ux: {} as Partial<AppMetrics['ux']>,
    // @ts-expect-error - Partial types are intentionally used here, ux and dev are initialized as empty objects
    dev: {} as Partial<AppMetrics['dev']>,
  };
  
  // Штраф за большое количество технологий
  if (technologies.length > 8) {
    const excess = technologies.length - 8;
    impact.dev!.complexity = (impact.dev!.complexity || 0) + (excess * 5);
    impact.dev!.maintainability = (impact.dev!.maintainability || 0) - (excess * 3);
    impact.dev!.cost = (impact.dev!.cost || 0) + (excess * 5);
  }

  // Проверка на отсутствие frontend или backend
  const hasFrontendTech = technologies.some(t => 
    ['react', 'vue', 'angular', 'svelte'].includes(t.id)
  );
  const hasBackendTech = technologies.some(t => 
    ['node', 'nestjs', 'express', 'django', 'fastapi', 'spring'].includes(t.id)
  );

  if (!hasFrontendTech || !hasBackendTech) {
    impact.ux!.userFriendliness = (impact.ux!.userFriendliness || 0) - 20;
    impact.dev!.developmentSpeed = (impact.dev!.developmentSpeed || 0) - 15;
  }

  return impact;
}

function combineMetrics(
  base: AppMetrics,
  compatibility: Partial<AppMetrics>,
  hiddenMods: Partial<AppMetrics>,
  rules: Partial<AppMetrics>,
  penalties: Partial<AppMetrics>
): AppMetrics {
  const combine = (baseVal: number, ...impacts: (number | undefined)[]) => {
    const total = impacts.reduce((sum, val) => (sum || 0) + (val || 0), baseVal);
    return Math.max(0, Math.min(100, total || 0));
  };

  return {
    ux: {
      performance: combine(
        base.ux.performance,
        compatibility.ux?.performance,
        hiddenMods.ux?.performance,
        rules.ux?.performance,
        penalties.ux?.performance
      ),
      stability: combine(
        base.ux.stability,
        compatibility.ux?.stability,
        hiddenMods.ux?.stability,
        rules.ux?.stability,
        penalties.ux?.stability
      ),
      userFriendliness: combine(
        base.ux.userFriendliness,
        compatibility.ux?.userFriendliness,
        hiddenMods.ux?.userFriendliness,
        rules.ux?.userFriendliness,
        penalties.ux?.userFriendliness
      ),
    },
    dev: {
      developmentSpeed: combine(
        base.dev.developmentSpeed,
        compatibility.dev?.developmentSpeed,
        hiddenMods.dev?.developmentSpeed,
        rules.dev?.developmentSpeed,
        penalties.dev?.developmentSpeed
      ),
      maintainability: combine(
        base.dev.maintainability,
        compatibility.dev?.maintainability,
        hiddenMods.dev?.maintainability,
        rules.dev?.maintainability,
        penalties.dev?.maintainability
      ),
      complexity: combine(
        base.dev.complexity,
        compatibility.dev?.complexity,
        hiddenMods.dev?.complexity,
        rules.dev?.complexity,
        penalties.dev?.complexity
      ),
      cost: combine(
        base.dev.cost,
        compatibility.dev?.cost,
        hiddenMods.dev?.cost,
        rules.dev?.cost,
        penalties.dev?.cost
      ),
    },
  };
}

