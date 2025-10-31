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

