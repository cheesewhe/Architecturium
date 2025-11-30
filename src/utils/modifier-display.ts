import { Technology, TechnologyModifier } from '../types';

/**
 * СИСТЕМА ОТОБРАЖЕНИЯ МОДИФИКАТОРОВ
 * 
 * Собирает и форматирует информацию о том, как технология
 * взаимодействует с уже выбранными технологиями
 */

export interface ModifierInfo {
  techName: string;
  techId: string;
  modifiers: {
    ux: {
      performance?: number;
      stability?: number;
      userFriendliness?: number;
    };
    dev: {
      developmentSpeed?: number;
      maintainability?: number;
      complexity?: number;
      cost?: number;
    };
  };
}

/**
 * Получает все модификаторы между технологией и уже выбранными
 */
export function getModifiersForTech(
  tech: Technology,
  selectedTechs: Technology[]
): ModifierInfo[] {
  const modifierInfos: ModifierInfo[] = [];

  selectedTechs.forEach((selectedTech) => {
    // Проверяем модификаторы текущей технологии → выбранная
    if (tech.modifiers) {
      const modifier = tech.modifiers.find(m => m.targetTechId === selectedTech.id);
      if (modifier && hasAnyModifier(modifier)) {
        modifierInfos.push({
          techName: selectedTech.name,
          techId: selectedTech.id,
          modifiers: {
            ux: modifier.ux || {},
            dev: modifier.dev || {},
          },
        });
      }
    }

    // Проверяем модификаторы выбранной технологии → текущая
    if (selectedTech.modifiers) {
      const modifier = selectedTech.modifiers.find(m => m.targetTechId === tech.id);
      if (modifier && hasAnyModifier(modifier)) {
        // Проверяем, не добавили ли мы уже эту пару
        const existing = modifierInfos.find(m => m.techId === selectedTech.id);
        if (existing) {
          // Объединяем модификаторы
          mergeModifiers(existing.modifiers, {
            ux: modifier.ux || {},
            dev: modifier.dev || {},
          });
        } else {
          modifierInfos.push({
            techName: selectedTech.name,
            techId: selectedTech.id,
            modifiers: {
              ux: modifier.ux || {},
              dev: modifier.dev || {},
            },
          });
        }
      }
    }
  });

  return modifierInfos;
}

function hasAnyModifier(modifier: TechnologyModifier): boolean {
  return !!(
    modifier.ux?.performance ||
    modifier.ux?.stability ||
    modifier.ux?.userFriendliness ||
    modifier.dev?.developmentSpeed ||
    modifier.dev?.maintainability ||
    modifier.dev?.complexity ||
    modifier.dev?.cost
  );
}

function mergeModifiers(target: { ux: Record<string, number>; dev: Record<string, number> }, source: { ux: Record<string, number>; dev: Record<string, number> }) {
  // UX
  if (source.ux.performance) target.ux.performance = (target.ux.performance || 0) + source.ux.performance;
  if (source.ux.stability) target.ux.stability = (target.ux.stability || 0) + source.ux.stability;
  if (source.ux.userFriendliness) target.ux.userFriendliness = (target.ux.userFriendliness || 0) + source.ux.userFriendliness;

  // Dev
  if (source.dev.developmentSpeed) target.dev.developmentSpeed = (target.dev.developmentSpeed || 0) + source.dev.developmentSpeed;
  if (source.dev.maintainability) target.dev.maintainability = (target.dev.maintainability || 0) + source.dev.maintainability;
  if (source.dev.complexity) target.dev.complexity = (target.dev.complexity || 0) + source.dev.complexity;
  if (source.dev.cost) target.dev.cost = (target.dev.cost || 0) + source.dev.cost;
}

/**
 * Форматирует модификатор в читаемую строку
 */
export function formatModifier(value: number, label: string): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}% ${label}`;
}

/**
 * Получает цвет для модификатора (зелёный для позитивных, красный для негативных)
 */
export function getModifierColor(value: number): string {
  if (value > 0) return '#10b981'; // Зелёный
  if (value < 0) return '#ef4444'; // Красный
  return '#6b7280'; // Серый
}

/**
 * Группирует модификаторы по категориям
 */
export function groupModifiers(modifierInfo: ModifierInfo): {
  ux: string[];
  dev: string[];
} {
  const ux: string[] = [];
  const dev: string[] = [];

  // UX модификаторы
  if (modifierInfo.modifiers.ux.performance) {
    ux.push(formatModifier(modifierInfo.modifiers.ux.performance, 'Производительность'));
  }
  if (modifierInfo.modifiers.ux.stability) {
    ux.push(formatModifier(modifierInfo.modifiers.ux.stability, 'Стабильность'));
  }
  if (modifierInfo.modifiers.ux.userFriendliness) {
    ux.push(formatModifier(modifierInfo.modifiers.ux.userFriendliness, 'Удобство'));
  }

  // Dev модификаторы
  if (modifierInfo.modifiers.dev.developmentSpeed) {
    dev.push(formatModifier(modifierInfo.modifiers.dev.developmentSpeed, 'Скорость разработки'));
  }
  if (modifierInfo.modifiers.dev.maintainability) {
    dev.push(formatModifier(modifierInfo.modifiers.dev.maintainability, 'Поддерживаемость'));
  }
  if (modifierInfo.modifiers.dev.complexity) {
    dev.push(formatModifier(modifierInfo.modifiers.dev.complexity, 'Сложность'));
  }
  if (modifierInfo.modifiers.dev.cost) {
    dev.push(formatModifier(modifierInfo.modifiers.dev.cost, 'Стоимость'));
  }

  return { ux, dev };
}

