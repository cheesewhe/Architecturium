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
  performance: number;
  stability: number;
  usability: number;
  price: number;
  complexity: number; // Базовая сложность изучения
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
  
  // ВИДИМЫЕ параметры (показываются игроку)
  performance: number; // 0-100
  stability: number; // 0-100
  usability: number; // 0-100
  price: number; // 0-100 (чем меньше, тем дешевле)
  complexity: number; // 0-100 Сложность изучения (для сортировки)
  
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

