import { Technology, AppSchema } from '../types';

/**
 * СИСТЕМА ДИНАМИЧЕСКОЙ СОРТИРОВКИ ТЕХНОЛОГИЙ
 * 
 * Сортирует технологии в зависимости от уже выбранных:
 * 1. Пустая схема → по сложности (от простого к сложному)
 * 2. Один элемент → по рекомендованности для него
 * 3. Два и более → по рекомендованности для всей связки
 */

export function sortTechnologies(
  technologies: Technology[],
  appSchema: AppSchema
): Technology[] {
  const selectedTechs = [
    ...appSchema.frontend.map(p => p.technology),
    ...appSchema.backend.map(p => p.technology)
  ];

  // СЛУЧАЙ 1: Пустая схема - сортировка по сложности
  if (selectedTechs.length === 0) {
    return sortByComplexity(technologies);
  }

  // СЛУЧАЙ 2: Один элемент - сортировка по рекомендованности для него
  if (selectedTechs.length === 1) {
    return sortByRecommendationForOne(technologies, selectedTechs[0]);
  }

  // СЛУЧАЙ 3: Два и более - сортировка по рекомендованности для связки
  return sortByRecommendationForMany(technologies, selectedTechs);
}

// СЛУЧАЙ 1: Сортировка по complexity (от простого к сложному)
function sortByComplexity(technologies: Technology[]): Technology[] {
  return [...technologies].sort((a, b) => {
    const complexA = a.complexity || 50;
    const complexB = b.complexity || 50;
    return complexA - complexB; // От меньшего к большему = от простого к сложному
  });
}

// СЛУЧАЙ 2: Сортировка по рекомендованности для ОДНОЙ технологии
function sortByRecommendationForOne(
  technologies: Technology[],
  selected: Technology
): Technology[] {
  return [...technologies].sort((a, b) => {
    const scoreA = calculateRecommendationScore(a, [selected]);
    const scoreB = calculateRecommendationScore(b, [selected]);
    return scoreB - scoreA; // От большего к меньшему = от рекомендованного к нерекомендованному
  });
}

// СЛУЧАЙ 3: Сортировка по рекомендованности для НЕСКОЛЬКИХ технологий
function sortByRecommendationForMany(
  technologies: Technology[],
  selected: Technology[]
): Technology[] {
  return [...technologies].sort((a, b) => {
    const scoreA = calculateRecommendationScore(a, selected);
    const scoreB = calculateRecommendationScore(b, selected);
    
    // Если score равны, то сортируем по complexity
    if (scoreA === scoreB) {
      const complexA = a.complexity || 50;
      const complexB = b.complexity || 50;
      return complexA - complexB;
    }
    
    return scoreB - scoreA; // От большего к меньшему
  });
}

// Вычисляет "рекомендованность" технологии для набора уже выбранных
function calculateRecommendationScore(
  tech: Technology,
  selected: Technology[]
): number {
  let score = 0;
  
  selected.forEach((selectedTech) => {
    // Проверяем, есть ли tech в preferred списке selectedTech
    if (selectedTech.compatibility?.preferred.includes(tech.id)) {
      score += 100; // Очень рекомендуется
    }
    
    // Проверяем, есть ли tech в preferred списке самой tech для selectedTech
    if (tech.compatibility?.preferred.includes(selectedTech.id)) {
      score += 100; // Взаимная рекомендация
    }
    
    // Проверяем compatible
    if (selectedTech.compatibility?.compatible.includes(tech.id)) {
      score += 50; // Совместим
    }
    
    if (tech.compatibility?.compatible.includes(selectedTech.id)) {
      score += 50;
    }
    
    // Проверяем несовместимость (штраф!)
    if (selectedTech.compatibility?.incompatible.includes(tech.id)) {
      score -= 1000; // Очень плохо!
    }
    
    if (tech.compatibility?.incompatible.includes(selectedTech.id)) {
      score -= 1000;
    }
    
    // Проверяем скрытые модификаторы
    if (tech.modifiers) {
      tech.modifiers.forEach((modifier) => {
        if (modifier.targetTechId === selectedTech.id) {
          // Если есть модификаторы для выбранной технологии - это хорошо
          score += 30;
          
          // Чем больше позитивных модификаторов, тем выше score
          if (modifier.ux) {
            const uxSum = (modifier.ux.performance || 0) + 
                          (modifier.ux.stability || 0) + 
                          (modifier.ux.userFriendliness || 0);
            score += Math.max(0, uxSum); // Только позитивные
          }
          
          if (modifier.dev) {
            const devSum = (modifier.dev.developmentSpeed || 0) + 
                           (modifier.dev.maintainability || 0) + 
                           (-(modifier.dev.complexity || 0)) + // Меньше complexity = лучше
                           (-(modifier.dev.cost || 0)); // Меньше cost = лучше
            score += Math.max(0, devSum);
          }
        }
      });
    }
    
    // Проверяем модификаторы выбранной технологии для этой
    if (selectedTech.modifiers) {
      selectedTech.modifiers.forEach((modifier) => {
        if (modifier.targetTechId === tech.id) {
          score += 30;
          
          if (modifier.ux) {
            const uxSum = (modifier.ux.performance || 0) + 
                          (modifier.ux.stability || 0) + 
                          (modifier.ux.userFriendliness || 0);
            score += Math.max(0, uxSum);
          }
          
          if (modifier.dev) {
            const devSum = (modifier.dev.developmentSpeed || 0) + 
                           (modifier.dev.maintainability || 0) + 
                           (-(modifier.dev.complexity || 0)) + 
                           (-(modifier.dev.cost || 0));
            score += Math.max(0, devSum);
          }
        }
      });
    }
  });
  
  return score;
}

// Вспомогательная функция - получить label рекомендованности
export function getRecommendationLabel(
  tech: Technology,
  selected: Technology[]
): string | null {
  if (selected.length === 0) {
    // Показываем сложность
    const complexity = tech.complexity || 50;
    if (complexity < 35) return '⭐ Просто';
    if (complexity < 55) return '⭐⭐ Средне';
    if (complexity < 75) return '⭐⭐⭐ Сложно';
    return '⭐⭐⭐⭐ Очень сложно';
  }
  
  const score = calculateRecommendationScore(tech, selected);
  
  if (score < -500) return '❌ Несовместимо';
  if (score > 150) return '✅ Рекомендуется';
  if (score > 50) return '○ Совместимо';
  return null; // Нейтрально
}

