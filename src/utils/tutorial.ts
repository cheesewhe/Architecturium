import { TutorialStep } from '../types';
import { tutorialSteps } from '../data/tutorial';

/**
 * Система туториала
 * 
 * Управляет пошаговым обучением пользователя
 */

/**
 * Получает следующий шаг туториала
 * 
 * @param currentStepId - ID текущего шага
 * @returns Следующий шаг или null если туториал завершён
 */
export function getNextStep(currentStepId: string | null): TutorialStep | null {
  if (!currentStepId) {
    return tutorialSteps[0];
  }

  const currentIndex = tutorialSteps.findIndex(step => step.id === currentStepId);
  if (currentIndex === -1 || currentIndex === tutorialSteps.length - 1) {
    return null;
  }

  return tutorialSteps[currentIndex + 1];
}

/**
 * Получает предыдущий шаг туториала
 * 
 * @param currentStepId - ID текущего шага
 * @returns Предыдущий шаг или null если это первый шаг
 */
export function getPreviousStep(currentStepId: string): TutorialStep | null {
  const currentIndex = tutorialSteps.findIndex(step => step.id === currentStepId);
  if (currentIndex <= 0) {
    return null;
  }

  return tutorialSteps[currentIndex - 1];
}

/**
 * Проверяет, завершён ли туториал
 * 
 * @param currentStepId - ID текущего шага
 * @returns true если туториал завершён
 */
export function isTutorialComplete(currentStepId: string | null): boolean {
  if (!currentStepId) return false;
  const lastStep = tutorialSteps[tutorialSteps.length - 1];
  return currentStepId === lastStep.id;
}

/**
 * Получает прогресс туториала в процентах
 * 
 * @param currentStepId - ID текущего шага
 * @returns Прогресс от 0 до 100
 */
export function getTutorialProgress(currentStepId: string | null): number {
  if (!currentStepId) return 0;
  const currentIndex = tutorialSteps.findIndex(step => step.id === currentStepId);
  if (currentIndex === -1) return 0;
  return ((currentIndex + 1) / tutorialSteps.length) * 100;
}

