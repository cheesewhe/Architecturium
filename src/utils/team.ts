import { Team, Developer, AppSchema } from '../types';

/**
 * Система команды разработчиков
 * 
 * Управляет наймом разработчиков и их влиянием на проект
 */

/**
 * Создаёт пустую команду
 */
export function createTeam(): Team {
  return {
    developers: [],
    totalSalary: 0,
    averageSkill: 0,
  };
}

/**
 * Добавляет разработчика в команду
 */
export function addDeveloper(team: Team, developer: Developer): Team {
  const newDevelopers = [...team.developers, developer];
  return calculateTeamStats(newDevelopers);
}

/**
 * Удаляет разработчика из команды
 */
export function removeDeveloper(team: Team, developerId: string): Team {
  const newDevelopers = team.developers.filter(d => d.id !== developerId);
  return calculateTeamStats(newDevelopers);
}

/**
 * Рассчитывает статистику команды
 */
function calculateTeamStats(developers: Developer[]): Team {
  const totalSalary = developers.reduce((sum, dev) => sum + dev.salary, 0);
  const averageSkill = developers.length > 0
    ? developers.reduce((sum, dev) => sum + dev.skill, 0) / developers.length
    : 0;

  return {
    developers,
    totalSalary,
    averageSkill,
  };
}

/**
 * Рассчитывает влияние команды на скорость разработки
 * 
 * @param team - Команда разработчиков
 * @param schema - Схема проекта
 * @returns Множитель скорости разработки (1.0 = базовая скорость)
 */
export function calculateTeamSpeedMultiplier(team: Team, schema: AppSchema): number {
  if (team.developers.length === 0) {
    return 0.3; // Без команды разработка очень медленная
  }

  // Базовый множитель от среднего навыка
  const skillMultiplier = team.averageSkill / 100;

  // Бонус за правильную специализацию
  const specializationBonus = calculateSpecializationBonus(team, schema);

  // Штраф за слишком большую команду (сложность координации)
  const coordinationPenalty = team.developers.length > 8 ? 0.1 : 0;

  return Math.max(0.5, Math.min(2.0, skillMultiplier + specializationBonus - coordinationPenalty));
}

/**
 * Рассчитывает бонус за правильную специализацию
 */
function calculateSpecializationBonus(team: Team, schema: AppSchema): number {
  const frontendCount = schema.frontend.length;
  const backendCount = schema.backend.length;
  
  const frontendDevs = team.developers.filter(d => 
    d.specialization === 'frontend' || d.specialization === 'fullstack'
  ).length;
  
  const backendDevs = team.developers.filter(d => 
    d.specialization === 'backend' || d.specialization === 'fullstack'
  ).length;
  
  const devopsDevs = team.developers.filter(d => d.specialization === 'devops').length;
  const dbaDevs = team.developers.filter(d => d.specialization === 'dba').length;
  
  let bonus = 0;
  
  // Бонус за соответствие специализации задачам
  if (frontendCount > 0 && frontendDevs > 0) bonus += 0.1;
  if (backendCount > 0 && backendDevs > 0) bonus += 0.1;
  if (devopsDevs > 0) bonus += 0.05; // DevOps всегда полезен
  if (dbaDevs > 0) bonus += 0.05; // DBA всегда полезен
  
  return Math.min(0.3, bonus);
}

/**
 * Получает название специализации на русском
 */
export function getSpecializationName(specialization: Developer['specialization']): string {
  const names: Record<Developer['specialization'], string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    devops: 'DevOps',
    dba: 'DBA',
    fullstack: 'Fullstack',
  };
  return names[specialization];
}

