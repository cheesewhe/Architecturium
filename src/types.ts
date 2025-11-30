// Типы для совместимости технологий
export interface TechnologyCompatibility {
  preferred: string[]; // Рекомендуемые технологии
  compatible: string[]; // Совместимые (с нюансами)
  incompatible: string[]; // Несовместимые
}

// Скрытые модификаторы - детальное влияние технологий друг на друга
export interface TechnologyModifier {
  targetTechId: string; // С какой технологией взаимодействует
  ux?: {
    performance?: number;
    stability?: number;
    userFriendliness?: number;
  };
  dev?: {
    developmentSpeed?: number;
    maintainability?: number;
    complexity?: number;
    cost?: number;
  };
}

// Видимые параметры технологии (для игрока)
export interface VisibleTechParams {
  // UX параметры
  performance: number;
  stability: number;
  userFriendliness: number;
  // Dev параметры
  developmentSpeed: number;
  maintainability: number;
  complexity: number; // Базовая сложность изучения
  cost: number;
}

// Типы для технологий
export interface Technology {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'pattern' | 'library' | 'database' | 'service';
  description: string;
  detailedDescription?: string; // Подробное обучающее описание
  pros: string[];
  cons: string[];
  
  // ВИДИМЫЕ параметры UX (показываются игроку)
  performance: number; // 0-100 Производительность
  stability: number; // 0-100 Стабильность
  userFriendliness: number; // 0-100 Удобство для пользователя
  
  // ВИДИМЫЕ параметры Dev (показываются игроку)
  developmentSpeed: number; // 0-100 Скорость разработки
  maintainability: number; // 0-100 Поддерживаемость
  complexity: number; // 0-100 Сложность изучения (чем выше, тем сложнее)
  cost: number; // 0-100 Стоимость разработки (чем выше, тем дороже)
  
  // СКРЫТЫЕ параметры (только для расчётов)
  compatibility?: TechnologyCompatibility;
  modifiers?: TechnologyModifier[]; // Скрытые модификаторы влияния на другие технологии
}

// Типы для панелей в схеме
export interface Panel {
  id: string;
  technology: Technology;
  x: number;
  y: number;
  connections: string[]; // IDs других панелей
}

// Типы для полной схемы приложения
export interface AppSchema {
  frontend: Panel[];
  backend: Panel[];
}

// Параметры готового приложения - разделены на UX и Development
export interface AppMetrics {
  // Пользовательский опыт (User Experience)
  ux: {
    performance: number;      // Производительность для пользователя
    stability: number;         // Стабильность работы
    userFriendliness: number;  // Удобство использования
  };
  // Параметры разработки (Development)
  dev: {
    developmentSpeed: number;  // Скорость разработки
    maintainability: number;   // Удобство поддержки
    complexity: number;        // Сложность (чем ниже, тем лучше)
    cost: number;              // Стоимость
  };
}

// Система бюджета проекта
export interface Budget {
  total: number;        // Общий бюджет проекта
  spent: number;        // Потрачено
  remaining: number;    // Осталось
}

// Система достижений
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'general' | 'architecture' | 'performance' | 'budget' | 'challenge';
}

// Система туториала
export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string | null; // CSS селектор элемента
  action: 'next' | 'click' | 'select' | 'observe' | 'complete';
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  highlight?: boolean;
}

// Система временной прогрессии
export type ProjectPhase = 'planning' | 'mvp' | 'beta' | 'production' | 'maintenance';

export interface ProjectTimeline {
  currentPhase: ProjectPhase;
  phaseProgress: number; // 0-100
  totalProgress: number; // 0-100
  daysElapsed: number;
  estimatedDaysRemaining: number;
}

// Система команды разработчиков
export interface Developer {
  id: string;
  name: string;
  specialization: 'frontend' | 'backend' | 'devops' | 'dba' | 'fullstack';
  skill: number; // 0-100
  salary: number; // месячная зарплата
  experience: number; // лет опыта
}

export interface Team {
  developers: Developer[];
  totalSalary: number;
  averageSkill: number;
}

// Система случайных событий
export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  choices?: EventChoice[];
  effects?: EventEffects;
  probability: number; // 0-1
}

export interface EventChoice {
  id: string;
  text: string;
  effects: EventEffects;
}

export interface EventEffects {
  metrics?: Partial<AppMetrics>;
  budget?: number;
  timeline?: { days: number };
}

// Система целей и челленджей
export interface Challenge {
  id: string;
  name: string;
  description: string;
  objectives: ChallengeObjective[];
  constraints?: ChallengeConstraints;
  reward?: string;
}

export interface ChallengeObjective {
  id: string;
  description: string;
  type: 'metric' | 'technology' | 'budget' | 'time';
  target: number | string;
  current: number | string;
  completed: boolean;
}

export interface ChallengeConstraints {
  maxTechnologies?: number;
  maxBudget?: number;
  requiredTechnologies?: string[];
  forbiddenTechnologies?: string[];
  maxTime?: number; // дни
}

// Система типов приложений
export interface AppType {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirements: {
    performance: number;
    stability: number;
    userFriendliness: number;
    developmentSpeed: number;
    maintainability: number;
    maxComplexity: number;
    maxCost: number;
  };
  recommendedTechnologies: string[];
  challenges: string[];
}

// Система безопасности
export interface SecurityMetrics {
  score: number; // 0-100
  vulnerabilities: SecurityVulnerability[];
  compliance: ComplianceStatus[];
}

export interface SecurityVulnerability {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedTech: string;
  fix?: string;
}

export interface ComplianceStatus {
  standard: 'PCI-DSS' | 'GDPR' | 'HIPAA' | 'SOC2';
  compliant: boolean;
  issues: string[];
}

// Система нагрузочного тестирования
export interface LoadTest {
  id: string;
  name: string;
  users: number;
  duration: number; // секунды
  results?: LoadTestResults;
}

export interface LoadTestResults {
  avgResponseTime: number;
  maxResponseTime: number;
  requestsPerSecond: number;
  errorRate: number;
  bottlenecks: Bottleneck[];
}

export interface Bottleneck {
  technology: string;
  issue: string;
  impact: number; // 0-100
  recommendation: string;
}

