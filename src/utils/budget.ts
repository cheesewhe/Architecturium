import { Technology, Budget } from '../types';

/**
 * Система бюджета проекта
 * 
 * Управляет бюджетом проекта и стоимостью технологий
 */

const DEFAULT_BUDGET = 10000; // $10,000 начальный бюджет

/**
 * Рассчитывает стоимость технологии
 * 
 * Некоторые технологии бесплатные (open source),
 * некоторые платные (commercial, cloud services)
 * 
 * @param tech - Технология для расчёта стоимости
 * @returns Стоимость в долларах
 */
export function calculateTechCost(tech: Technology): number {
  // Базовая стоимость из параметра cost (0-100)
  // Преобразуем в реальные доллары: cost * 100
  const baseCost = tech.cost * 100;

  // Языки программирования обычно бесплатные
  if (tech.category === 'language') {
    return 0;
  }

  // Open source фреймворки бесплатные
  if (tech.category === 'framework' && tech.cost < 30) {
    return 0;
  }

  // Коммерческие БД и сервисы стоят дороже
  if (tech.category === 'database' && tech.cost > 40) {
    return baseCost * 2; // Дорогие БД стоят в 2 раза больше
  }

  // Cloud сервисы имеют месячную подписку
  if (tech.category === 'service' && ['kubernetes', 'kafka', 'elasticsearch-service'].includes(tech.id)) {
    return baseCost * 1.5; // Cloud сервисы дороже
  }

  return baseCost;
}

/**
 * Рассчитывает общую стоимость всех технологий в проекте
 * 
 * @param technologies - Массив выбранных технологий
 * @returns Общая стоимость в долларах
 */
export function calculateTotalCost(technologies: Technology[]): number {
  return technologies.reduce((total, tech) => {
    return total + calculateTechCost(tech);
  }, 0);
}

/**
 * Создаёт начальный бюджет проекта
 * 
 * @param initialAmount - Начальная сумма бюджета (по умолчанию $10,000)
 * @returns Объект бюджета
 */
export function createBudget(initialAmount: number = DEFAULT_BUDGET): Budget {
  return {
    total: initialAmount,
    spent: 0,
    remaining: initialAmount,
  };
}

/**
 * Обновляет бюджет после добавления технологии
 * 
 * @param budget - Текущий бюджет
 * @param techCost - Стоимость добавляемой технологии
 * @returns Обновлённый бюджет или null если недостаточно средств
 */
export function updateBudget(budget: Budget, techCost: number): Budget | null {
  if (budget.remaining < techCost) {
    return null; // Недостаточно средств
  }

  return {
    ...budget,
    spent: budget.spent + techCost,
    remaining: budget.remaining - techCost,
  };
}

/**
 * Проверяет, достаточно ли средств для добавления технологии
 * 
 * @param budget - Текущий бюджет
 * @param tech - Технология для проверки
 * @returns true если достаточно средств, false иначе
 */
export function canAffordTech(budget: Budget, tech: Technology): boolean {
  const cost = calculateTechCost(tech);
  return budget.remaining >= cost;
}

/**
 * Возвращает процент использования бюджета
 * 
 * @param budget - Текущий бюджет
 * @returns Процент использования (0-100)
 */
export function getBudgetUsagePercent(budget: Budget): number {
  if (budget.total === 0) return 0;
  return (budget.spent / budget.total) * 100;
}

